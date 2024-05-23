import { dirname, join, resolve } from 'path'
// @ts-expect-error (I removed this on purpose, because it's incorrect)
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin'
import type { Options } from '@storybook/types'
import type { BuilderOptions } from '../types'
import { globalsNameReferenceMap } from '@storybook/preview/globals'
import {
  stringifyProcessEnvs,
  normalizeStories,
  getBuilderOptions,
  isPreservingSymlinks,
} from '@storybook/core-common'
import { dedent } from 'ts-dedent'
import { getVirtualModules } from './virtual-module-mapping'
import { loadConfig, mergeRsbuildConfig } from '@rsbuild/core'
import type { RsbuildConfig } from '@rsbuild/core'
import { webpack as docsWebpack } from '@storybook/addon-docs/dist/preset'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'

const getAbsolutePath = <I extends string>(input: I): I =>
  dirname(require.resolve(join(input, 'package.json'))) as any
const maybeGetAbsolutePath = <I extends string>(input: I): I | false => {
  try {
    return getAbsolutePath(input)
  } catch (e) {
    return false
  }
}

const managerAPIPath = maybeGetAbsolutePath(`@storybook/manager-api`)
const componentsPath = maybeGetAbsolutePath(`@storybook/components`)
const globalPath = maybeGetAbsolutePath(`@storybook/global`)
const routerPath = maybeGetAbsolutePath(`@storybook/router`)
const themingPath = maybeGetAbsolutePath(`@storybook/theming`)

// these packages are not pre-bundled because of react dependencies.
// these are not dependencies of the builder anymore, thus resolving them can fail.
// we should remove the aliases in 8.0, I'm not sure why they are here in the first place.
const storybookPaths: Record<string, string> = {
  ...(managerAPIPath
    ? {
        [`@storybook/manager-api`]: managerAPIPath,
      }
    : {}),
  ...(componentsPath ? { [`@storybook/components`]: componentsPath } : {}),
  ...(globalPath ? { [`@storybook/global`]: globalPath } : {}),
  ...(routerPath ? { [`@storybook/router`]: routerPath } : {}),
  ...(themingPath ? { [`@storybook/theming`]: themingPath } : {}),
}

export default async (options: Options): Promise<RsbuildConfig> => {
  const appliedDocsWebpack = await docsWebpack({}, options)
  const {
    outputDir = join('.', 'public'),
    quiet,
    packageJson,
    configType,
    presets,
    previewUrl,
    typescriptOptions,
    features,
  } = options

  const isProd = configType === 'PRODUCTION'
  const workingDir = process.cwd()

  const [
    coreOptions,
    frameworkOptions,
    envs,
    logLevel,
    headHtmlSnippet,
    bodyHtmlSnippet,
    template,
    docsOptions,
    entries,
    nonNormalizedStories,
    // modulesCount = 1000,
    build,
    tagsOptions,
  ] = await Promise.all([
    presets.apply('core'),
    presets.apply('frameworkOptions'),
    presets.apply<Record<string, string>>('env'),
    presets.apply('logLevel', undefined),
    presets.apply('previewHead'),
    presets.apply('previewBody'),
    presets.apply<string>('previewMainTemplate'),
    presets.apply('docs'),
    presets.apply<string[]>('entries', []),
    presets.apply('stories', []),
    options.cache?.get('modulesCount').catch(() => {}),
    options.presets.apply('build'),
    presets.apply('tags', {}),
  ])

  const { rsbuildConfigPath } = await getBuilderOptions<BuilderOptions>(options)
  const stories = normalizeStories(nonNormalizedStories, {
    configDir: options.configDir,
    workingDir,
  })

  // TODO: not inclined to support fork-ts-checker-webpack-plugin
  const shouldCheckTs =
    typescriptOptions.check && !typescriptOptions.skipCompiler
  const tsCheckOptions = typescriptOptions.checkOptions || {}

  // TODO: Rspack doesn't support persistent cache yet
  // const builderOptions = await getBuilderOptions<BuilderOptions>(options)
  // const cacheConfig = builderOptions.fsCache
  //   ? { cache: { type: 'filesystem' as const } }
  //   : {}

  // TODO: Rspack doesn't support lazyCompilation yet
  // const lazyCompilationConfig =
  //   builderOptions.lazyCompilation && !isProd
  //     ? {
  //         lazyCompilation: { entries: false },
  //       }
  //     : {}

  if (!template) {
    throw new Error(dedent`
      Storybook's Webpack5 builder requires a template to be specified.
      Somehow you've ended up with a falsy value for the template option.

      Please file an issue at https://github.com/storybookjs/storybook with a reproduction.
    `)
  }

  const externals: Record<string, string> = globalsNameReferenceMap
  if (build?.test?.disableBlocks) {
    externals['@storybook/blocks'] = '__STORYBOOK_BLOCKS_EMPTY_MODULE__'
  }

  // TODO: Rspack doesn't support virtual modules yet, use cache dir instead
  const { virtualModules: _virtualModules, entries: dynamicEntries } =
    await getVirtualModules(options)

  if (!options.cache) {
    throw new Error('Cache is required')
  }

  const { content } = await loadConfig({
    cwd: workingDir,
    path: rsbuildConfigPath,
  })

  const resourceFilename = isProd
    ? 'static/media/[name].[contenthash:8][ext]'
    : 'static/media/[path][name][ext]'

  const merged = mergeRsbuildConfig(content, {
    output: {
      cleanDistPath: false,
      dataUriLimit: {
        media: 10000,
      },
      sourceMap: {
        js: options.build?.test?.disableSourcemaps
          ? false
          : 'cheap-module-source-map',
        css: options.build?.test?.disableSourcemaps ? false : true,
      },
      distPath: {
        root: resolve(process.cwd(), outputDir),
      },
      filename: {
        js: isProd
          ? '[name].[contenthash:8].iframe.bundle.js'
          : '[name].iframe.bundle.js',
        image: resourceFilename,
        font: resourceFilename,
        media: resourceFilename,
      },
      assetPrefix: '/',
      externals,
    },
    dev: {
      assetPrefix: '',
      progressBar: !quiet,
    },
    source: {
      alias: {
        ...storybookPaths,
      },
      entry: {
        // to avoid `It's not allowed to load an initial chunk on demand. The chunk name "main" is already used by an entrypoint` of
        main: [...(entries ?? []), ...dynamicEntries],
      },
      define: {
        ...stringifyProcessEnvs(envs),
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    },
    performance: {
      chunkSplit: {
        strategy: 'custom',
        splitChunks: {
          chunks: 'all',
        },
      },
    },
    tools: {
      rspack: (config, { addRules, appendPlugins, rspack, mergeConfig }) => {
        // TODO: Rspack doesn't support `unknownContextCritical` yet
        // config.module.unknownContextCritical = false
        addRules({
          test: /\.stories\.([tj])sx?$|(stories|story)\.mdx$/,
          exclude: /node_modules/,
          enforce: 'post',
          use: [
            {
              loader: require.resolve(
                'storybook-builder-rsbuild/loaders/export-order-loader',
              ),
            },
          ],
        })

        config.resolve ??= {}
        config.resolve.symlinks = !isPreservingSymlinks()

        config.watchOptions = {
          ignored: /node_modules/,
        }
        config.output = config.output || {}
        config.output.publicPath = ''

        config.ignoreWarnings = [
          ...(config.ignoreWarnings || []),
          /export '\S+' was not found in 'global'/,
          /export '\S+' was not found in '@storybook\/global'/,
        ]

        config.resolve ??= {}
        config.resolve.fallback ??= {
          stream: false,
          path: require.resolve('path-browserify'),
          assert: require.resolve('browser-assert'),
          util: require.resolve('util'),
          url: require.resolve('url'),
          fs: false,
          constants: require.resolve('constants-browserify'),
        }

        config.optimization ??= {}
        config.optimization.runtimeChunk = true
        config.optimization.usedExports = options.build?.test
          ?.disableTreeShaking
          ? false
          : isProd
        config.optimization.moduleIds = 'named'

        appendPlugins(
          [
            new rspack.ProvidePlugin({
              process: require.resolve('process/browser.js'),
            }),
            new CaseSensitivePathsPlugin(),
            shouldCheckTs
              ? new ForkTsCheckerWebpackPlugin(tsCheckOptions)
              : null,
          ].filter(Boolean),
        )

        // TODO: manually call and apply `webpack` from @storybook/addon-docs
        // as it's a built-in logic for Storybook's official webpack and Vite builder.
        // we should remove this once we merge this into Storybook's repository
        // by defining builder plugin in @storybook/addon-docs/preset's source code

        return mergeConfig(config, appliedDocsWebpack)
      },
      htmlPlugin: {
        filename: `iframe.html`,
        // FIXME: `none` isn't a known option
        chunksSortMode: 'none' as any,
        alwaysWriteToDisk: true,
        inject: false,
        template,
        templateParameters: {
          version: packageJson.version,
          globals: {
            CONFIG_TYPE: configType,
            LOGLEVEL: logLevel,
            FRAMEWORK_OPTIONS: frameworkOptions,
            CHANNEL_OPTIONS: coreOptions.channelOptions,
            FEATURES: features,
            PREVIEW_URL: previewUrl,
            STORIES: stories.map((specifier) => ({
              ...specifier,
              importPathMatcher: specifier.importPathMatcher.source,
            })),
            DOCS_OPTIONS: docsOptions,
            TAGS_OPTIONS: tagsOptions,
            ...(build?.test?.disableBlocks
              ? { __STORYBOOK_BLOCKS_EMPTY_MODULE__: {} }
              : {}),
          },
          headHtmlSnippet,
          bodyHtmlSnippet,
        },
        minify: {
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: false,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true,
        },
      },
    },
  })

  return merged
}
