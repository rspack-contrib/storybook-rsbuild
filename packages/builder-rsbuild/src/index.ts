import * as rsbuildReal from '@rsbuild/core'
import type { createDevServer } from '@rsbuild/core/dist/internal'
import type { Options } from '@storybook/types'
import { dirname, join, parse } from 'path'
import express from 'express'
import fs from 'fs-extra'
import { WebpackInvocationError } from '@storybook/core-events/server-errors'
import type { RsbuildBuilder } from './types'
import rsbuildConfig, {
  type RsbuildBuilderOptions,
} from './preview/iframe-rsbuild.config'

import prettyTime from 'pretty-hrtime'

export * from './types'
export * from './preview/virtual-module-mapping'

type RsbuildDevServer = Awaited<ReturnType<typeof createDevServer>>
type StatsOrMultiStats = Parameters<rsbuildReal.OnAfterBuildFn>[0]['stats']
export type Stats = NonNullable<
  Exclude<StatsOrMultiStats, { stats: unknown[] }>
>

export const printDuration = (startTime: [number, number]) =>
  prettyTime(process.hrtime(startTime))
    .replace(' ms', ' milliseconds')
    .replace(' s', ' seconds')
    .replace(' m', ' minutes')

const getAbsolutePath = <I extends string>(input: I): I =>
  dirname(require.resolve(join(input, 'package.json'))) as any

type BuilderStartOptions = Parameters<RsbuildBuilder['start']>['0']

export const executor = {
  get: async (options: Options) => {
    const rsbuildInstance =
      (await options.presets.apply<typeof rsbuildReal>('rsbuildInstance')) ||
      rsbuildReal

    return rsbuildInstance
  },
}

export const rsbuild = async (_: unknown, options: RsbuildBuilderOptions) => {
  const defaultConfig = await rsbuildConfig(options)
  const { presets } = options
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
        port: options.port,
        host: 'localhost',
        htmlFallback: false,
        strictPort: true,
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
      error: new Error(`Missing Rsbuild build instance at runtime!`),
    })
  }

  const previewResolvedDir = getAbsolutePath('@storybook/preview')
  const previewDirOrigin = join(previewResolvedDir, 'dist')

  router.use(
    `/sb-preview`,
    express.static(previewDirOrigin, { immutable: true, maxAge: '5m' }),
  )

  router.use(rsbuildServer.middlewares)
  storybookServer.on('upgrade', rsbuildServer.onHTTPUpgrade)
  const stats = await waitFirstCompileDone

  return {
    bail,
    stats,
    totalTime: process.hrtime(startTime),
  }
}

// explicit type annotation to bypass TypeScript check
// see: https://github.com/microsoft/TypeScript/issues/47663#issuecomment-1519138189
export const build: ({
  options,
}: BuilderStartOptions) => Promise<Stats> = async ({ options }) => {
  const { createRsbuild } = await executor.get(options)
  const config = await getConfig(options)
  const rsbuildBuild = await createRsbuild({
    cwd: process.cwd(),
    rsbuildConfig: config,
  })

  const previewResolvedDir = getAbsolutePath('@storybook/preview')
  const previewDirOrigin = join(previewResolvedDir, 'dist')
  const previewDirTarget = join(options.outputDir || '', `sb-preview`)
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
