import { type AddressInfo, createServer } from 'node:net'
import { join, parse } from 'node:path'
import * as rsbuildReal from '@rsbuild/core'
import fs from 'fs-extra'
import prettyTime from 'pretty-hrtime'
import sirv from 'sirv'
import { corePath } from 'storybook/core-path'
import { getPresets, resolveAddonName } from 'storybook/internal/common'
import { WebpackInvocationError } from 'storybook/internal/server-errors'
import type {
  Options,
  Preset,
  StorybookConfigRaw,
} from 'storybook/internal/types'
import rsbuildConfig, {
  type RsbuildBuilderOptions,
} from './preview/iframe-rsbuild.config'
import { applyReactShims } from './react-shims'
import type { RsbuildBuilder } from './types'

export * from './types'
export * from './preview/virtual-module-mapping'

type RsbuildDevServer = Awaited<
  ReturnType<rsbuildReal.RsbuildInstance['createDevServer']>
>
type StatsOrMultiStats = Parameters<rsbuildReal.OnAfterBuildFn>[0]['stats']
export type Stats = NonNullable<
  Exclude<StatsOrMultiStats, { stats: unknown[] }>
>

export const printDuration = (startTime: [number, number]) =>
  prettyTime(process.hrtime(startTime))
    .replace(' ms', ' milliseconds')
    .replace(' s', ' seconds')
    .replace(' m', ' minutes')

type BuilderStartOptions = Parameters<RsbuildBuilder['start']>['0']

export const executor = {
  get: async (options: Options) => {
    const rsbuildInstance =
      (await options.presets.apply<typeof rsbuildReal>('rsbuildInstance')) ||
      rsbuildReal

    return rsbuildInstance
  },
}

const isObject = (val: unknown): val is Record<string, any> =>
  val != null && typeof val === 'object' && Array.isArray(val) === false

function nonNullables<T>(value: T): value is NonNullable<T> {
  return value !== undefined
}

const rsbuild = async (_: unknown, options: RsbuildBuilderOptions) => {
  const { presets } = options
  // #region webpack addons
  const webpackAddons =
    await presets.apply<StorybookConfigRaw['addons']>('webpackAddons')
  const resolvedWebpackAddons = (webpackAddons ?? [])
    .map((preset: Preset) => {
      const options = isObject(preset) ? preset.options || undefined : undefined
      const name = isObject(preset) ? preset.name : preset
      // Taken fromm https://github.com/storybookjs/storybook/blob/f3b15ce1f28daac195e7698c075be7790f8172f1/code/core/src/common/presets.ts#L198.
      return resolveAddonName(options.configDir, name, options)
    })
    .filter(nonNullables)
  const { apply } = await getPresets(resolvedWebpackAddons, options)
  const webpackAddonsConfig: rsbuildReal.Rspack.Configuration = await apply(
    'webpackFinal',
    // TODO: using empty webpack config as base for now. It's better to using the composed rspack
    // config in `iframe-rsbuild.config.ts` as base config. But when `tools.rspack` is an async function,
    // the following `tools.rspack` raise an ` Promises are not supported` error.
    {
      output: {},
      module: {},
      plugins: [],
      resolve: {},
      devServer: {},
      optimization: {},
      performance: {},
      externals: {},
      experiments: {},
      node: {},
      stats: {},
      entry: {},
    },
    options,
  )
  // #endregion

  let defaultConfig = await rsbuildConfig(options, webpackAddonsConfig)
  const shimsConfig = await applyReactShims(defaultConfig, options)

  defaultConfig = rsbuildReal.mergeRsbuildConfig(
    defaultConfig,
    shimsConfig,
  ) as rsbuildReal.RsbuildConfig

  const finalDefaultConfig = await presets.apply(
    'rsbuildFinal',
    defaultConfig,
    options,
  )

  return finalDefaultConfig
}

export const getConfig: RsbuildBuilder['getConfig'] = async (options) => {
  const { presets } = options
  const typescriptOptions = await presets.apply('typescript', {}, options)
  const frameworkOptions = await presets.apply<any>('frameworkOptions')

  return rsbuild({}, {
    ...options,
    typescriptOptions,
    frameworkOptions,
  } as any)
}

let server: RsbuildDevServer

export async function bail(): Promise<void> {
  return server?.close()
}

export const start: RsbuildBuilder['start'] = async ({
  startTime,
  options,
  router,
  server: storybookServer,
  channel,
}) => {
  const { createRsbuild } = await executor.get(options)
  const config = await getConfig(options)
  const rsbuildBuild = await createRsbuild({
    cwd: process.cwd(),
    rsbuildConfig: {
      ...config,
      server: {
        ...config.server,
        port: await getRandomPort(options.host),
        host: options.host,
        htmlFallback: false,
        printUrls: false,
      },
      dev: {
        client: {},
      },
    },
  })

  const rsbuildServer = await rsbuildBuild.createDevServer()

  const waitFirstCompileDone = new Promise<StatsOrMultiStats>((resolve) => {
    rsbuildBuild.onDevCompileDone(({ stats, isFirstCompile }) => {
      if (!isFirstCompile) {
        return
      }
      resolve(stats)
    })
  })

  server = rsbuildServer

  if (!rsbuildBuild) {
    throw new WebpackInvocationError({
      // eslint-disable-next-line local-rules/no-uncategorized-errors
      error: new Error('Missing Rsbuild build instance at runtime!'),
    })
  }

  const previewResolvedDir = join(corePath, 'dist/preview')
  const previewDirOrigin = previewResolvedDir

  router.use(
    '/sb-preview',
    sirv(previewDirOrigin, { maxAge: 300000, dev: true, immutable: true }),
  )

  router.use(rsbuildServer.middlewares)
  rsbuildServer.connectWebSocket({ server: storybookServer })
  const stats = await waitFirstCompileDone

  return {
    bail,
    stats,
    totalTime: process.hrtime(startTime),
  }
}

// explicit type annotation to bypass TypeScript check
// see: https://github.com/microsoft/TypeScript/issues/47663#issuecomment-1519138189
export const build: ({ options }: BuilderStartOptions) => Promise<Stats> =
  async ({ options }) => {
    const { createRsbuild } = await executor.get(options)
    const config = await getConfig(options)
    const rsbuildBuild = await createRsbuild({
      cwd: process.cwd(),
      rsbuildConfig: config,
    })

    const previewResolvedDir = join(corePath, 'dist/preview')
    const previewDirOrigin = previewResolvedDir
    const previewDirTarget = join(options.outputDir || '', 'sb-preview')
    let stats: Stats

    rsbuildBuild.onAfterBuild((params) => {
      stats = params.stats as Stats
    })

    const previewFiles = fs.copy(previewDirOrigin, previewDirTarget, {
      filter: (src) => {
        const { ext } = parse(src)
        if (ext) {
          return ext === '.js'
        }
        return true
      },
    })

    rsbuildBuild.onAfterBuild((params) => {
      stats = params.stats as Stats
    })

    await Promise.all([rsbuildBuild.build(), previewFiles])
    return stats!
  }

export const corePresets = [join(__dirname, './preview-preset.js')]

export const previewMainTemplate = () =>
  require.resolve('storybook-builder-rsbuild/templates/preview.ejs')

function getRandomPort(host?: string) {
  return new Promise<number>((resolve, reject) => {
    const server = createServer()
    server.unref()
    server.on('error', reject)
    server.listen({ port: 0, host }, () => {
      const { port } = server.address() as AddressInfo
      server.close(() => {
        resolve(port)
      })
    })
  })
}
