import * as rsbuildReal from '@rsbuild/core'
import type { createDevServer } from '@rsbuild/core/dist/internal'
import type { Options } from '@storybook/types'
import { dirname, join, parse } from 'path'
import express from 'express'
import fs from 'fs-extra'
import {
  NoStatsForViteDevError,
  WebpackInvocationError,
} from '@storybook/core-events/server-errors'
import type { RsbuildBuilder } from './types'
import rsbuildConfig from './preview/iframe-rsbuild.config'

import prettyTime from 'pretty-hrtime'

export * from './types'
export * from './preview/virtual-module-mapping'

type RsbuildDevServer = Awaited<ReturnType<typeof createDevServer>>

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

export const rsbuild = async (_: unknown, options: Options) => {
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

  return {
    bail,
    stats: {
      toJson: () => {
        throw new NoStatsForViteDevError()
      },
    },
    totalTime: process.hrtime(startTime),
  }
}

export const build = async ({ options }: BuilderStartOptions) => {
  const { createRsbuild } = await executor.get(options)
  const config = await getConfig(options)
  const rsbuildBuild = await createRsbuild({
    cwd: process.cwd(),
    rsbuildConfig: config,
  })

  const previewResolvedDir = getAbsolutePath('@storybook/preview')
  const previewDirOrigin = join(previewResolvedDir, 'dist')
  const previewDirTarget = join(options.outputDir || '', `sb-preview`)

  const previewFiles = fs.copy(previewDirOrigin, previewDirTarget, {
    filter: (src) => {
      const { ext } = parse(src)
      if (ext) {
        return ext === '.js'
      }
      return true
    },
  })

  await Promise.all([rsbuildBuild.build(), previewFiles])
}

export const corePresets = [join(__dirname, './preview-preset.js')]

export const previewMainTemplate = () =>
  require.resolve('storybook-builder-rsbuild/templates/preview.ejs')
