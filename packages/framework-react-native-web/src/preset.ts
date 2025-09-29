import path from 'node:path'
import { mergeRsbuildConfig } from '@rsbuild/core'
import type { RsbuildConfig } from '@rsbuild/core'
import type { PresetProperty } from 'storybook/internal/types'
import type {
  FrameworkOptions,
  ReactNativeWebFrameworkDescription,
  StorybookConfig,
} from './types'

const getAbsolutePath = <I extends string>(input: I): I =>
  path.dirname(require.resolve(path.join(input, 'package.json'))) as any

type BabelPlugin = string | [string, Record<string, unknown>]

const getBabelPlugins = (options: FrameworkOptions): BabelPlugin[] => {
  const reactNativeWeb = 'react-native-web'
  if (options.babelPlugins && Array.isArray(options.babelPlugins)) {
    return [reactNativeWeb, ...options.babelPlugins]
  }
  return [reactNativeWeb]
}

const getModulePath = (name: string) => path.join('node_modules', name)

const DEFAULT_INCLUDES = [
  getModulePath('react-native'),
  getModulePath('react-navigation'),
  getModulePath('expo'),
  getModulePath('unimodules'),
  getModulePath('@react'),
  getModulePath('@expo'),
  getModulePath('@use-expo'),
  getModulePath('@unimodules'),
  getModulePath('native-base'),
  getModulePath('styled-components'),
]

const DEFAULT_EXCLUDES = [
  '/node_modules',
  '/bower_components',
  '/.expo/',
  '(webpack)',
]

const isInstalled = (name: string) => {
  try {
    require(`${name}/package.json`)
    return true
  } catch (er) {
    return false
  }
}

const getReactNativePreset = () => {
  if (isInstalled('@react-native/babel-preset')) {
    console.log('Using @react-native/babel-preset')
    return 'module:@react-native/babel-preset'
  }

  if (isInstalled('metro-react-native-babel-preset')) {
    console.log('Using metro-react-native-babel-preset')
    return 'module:metro-react-native-babel-preset'
  }

  throw new Error(
    "Couldn't find babel-preset-react-native or metro-react-native-babel-preset.",
  )
}

const WEB_EXTENSIONS = [
  '.web.js',
  '.web.jsx',
  '.web.ts',
  '.web.tsx',
  '.web.mjs',
] as const

const getFrameworkOptions = async (
  description: ReactNativeWebFrameworkDescription,
): Promise<FrameworkOptions> => {
  if (typeof description === 'string') {
    return {}
  }
  return description.options || {}
}

const createBabelRule = ({
  modules,
  root,
  babelPlugins,
  babelPresets,
  babelPresetReactOptions,
  babelPresetReactNativeOptions,
}: {
  modules: string[]
  root: string
  babelPlugins: BabelPlugin[]
  babelPresets: BabelPlugin[]
  babelPresetReactOptions: Record<string, unknown>
  babelPresetReactNativeOptions: Record<string, unknown>
}) => {
  const normalizedModules = modules.map((modulePath) =>
    path.normalize(modulePath),
  )

  const normalizedExcludes = DEFAULT_EXCLUDES.map((exclude) =>
    path.normalize(exclude),
  )

  return {
    test: /\.(js|jsx|ts|tsx|mjs)$/,
    loader: require.resolve('babel-loader'),
    include(filename: string) {
      if (!filename) {
        return false
      }

      for (const possibleModule of normalizedModules) {
        if (filename.includes(possibleModule)) {
          return true
        }
      }

      if (filename.includes(root)) {
        for (const excluded of normalizedExcludes) {
          if (filename.includes(excluded)) {
            return false
          }
        }
        return true
      }

      return false
    },
    options: {
      root,
      presets: [
        [
          getReactNativePreset(),
          {
            useTransformReactJSXExperimental: true,
            ...babelPresetReactNativeOptions,
          },
        ],
        [
          '@babel/preset-react',
          {
            runtime: 'automatic',
            ...babelPresetReactOptions,
          },
        ],
        ...babelPresets,
      ],
      plugins: [...babelPlugins],
    },
  }
}

const createRsbuildConfig = (
  frameworkOptions: FrameworkOptions,
): RsbuildConfig => {
  const root = frameworkOptions.projectRoot || process.cwd()
  const modulesToTranspile =
    frameworkOptions.modulesToTranspile?.map(getModulePath) ?? []
  const modules = [...DEFAULT_INCLUDES, ...modulesToTranspile]
  const babelPlugins = getBabelPlugins(frameworkOptions)
  const babelPresetReactOptions = frameworkOptions.babelPresetReactOptions ?? {}
  const babelPresetReactNativeOptions =
    frameworkOptions.babelPresetReactNativeOptions ?? {}
  const babelPresets = frameworkOptions.babelPresets ?? []
  const userAliases = frameworkOptions.modulesToAlias ?? {}

  const babelRule = createBabelRule({
    modules,
    root,
    babelPlugins,
    babelPresets,
    babelPresetReactOptions,
    babelPresetReactNativeOptions,
  })

  return {
    resolve: {
      alias: {
        'react-native$': 'react-native-web',
        ...userAliases,
      },
    },
    tools: {
      rspack: (config, { addRules, appendPlugins, rspack }) => {
        console.log('🕶', 1)
        appendPlugins([
          new rspack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(
              process.env.NODE_ENV || 'development',
            ),
            __DEV__: process.env.NODE_ENV !== 'production',
          }),
          new rspack.DefinePlugin({ process: { env: {} } }),
        ])

        addRules(babelRule)

        config.resolve ??= {}
        const extensions = new Set([
          ...WEB_EXTENSIONS,
          ...(config.resolve.extensions || []),
        ])
        config.resolve.extensions = Array.from(extensions)

        config.resolve.alias = {
          'react-native$': 'react-native-web',
          ...(config.resolve.alias || {}),
          ...userAliases,
        }
      },
    },
  }
}

export const rsbuildFinal: StorybookConfig['rsbuildFinal'] = async (
  config,
  options,
) => {
  const framework = (await options.presets.apply(
    'framework',
  )) as ReactNativeWebFrameworkDescription
  const frameworkOptions = await getFrameworkOptions(framework)

  console.log('🤱', 1)

  return mergeRsbuildConfig(config, createRsbuildConfig(frameworkOptions))
}

export const core: PresetProperty<'core'> = async (config, options) => {
  const framework = await options.presets.apply('framework')
  const builderOptions =
    typeof framework === 'string' ? {} : framework.options.builder || {}
  return {
    ...config,
    builder: {
      name: getAbsolutePath('storybook-builder-rsbuild'),
      options: builderOptions,
    },
    renderer: getAbsolutePath('@storybook/react'),
  }
}
