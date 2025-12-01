import { dirname, isAbsolute } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  babelParser,
  extractMockCalls,
  getIsExternal,
  resolveExternalModule,
  resolveWithExtensions,
} from 'storybook/internal/mocking-utils'

import type { Rspack } from '@rsbuild/core'
import { rspack } from '@rsbuild/core'
import { findMockRedirect } from '@vitest/mocker/redirect'

const PLUGIN_NAME = 'RspackMockPlugin'

export interface RspackMockPluginOptions {
  previewConfigPath: string
  configDir?: string
}

interface ExtractedMock {
  path: string
  spy: boolean
}

interface ResolvedMock extends ExtractedMock {
  absolutePath: string
  replacementResource: string
}

export class RspackMockPlugin {
  private readonly options: RspackMockPluginOptions
  private mockMap: Map<string, ResolvedMock> = new Map()

  constructor(options: RspackMockPluginOptions) {
    if (!options.previewConfigPath) {
      throw new Error(`[${PLUGIN_NAME}] \`previewConfigPath\` is required.`)
    }
    this.options = options
  }

  apply(compiler: Rspack.Compiler) {
    const logger = compiler.getInfrastructureLogger(PLUGIN_NAME)

    const updateMocks = () => {
      this.mockMap = new Map(
        this.extractAndResolveMocks(compiler).flatMap((mock) => [
          [mock.absolutePath, mock],
          [mock.absolutePath.replace(/\.[^.]+$/, ''), mock],
        ]),
      )
      logger.info(`Mock map updated with ${this.mockMap.size / 2} mocks.`)
    }

    compiler.hooks.beforeRun.tap(PLUGIN_NAME, updateMocks)
    compiler.hooks.watchRun.tap(PLUGIN_NAME, updateMocks)

    new rspack.NormalModuleReplacementPlugin(/.*/, (resource) => {
      try {
        const path = resource.request
        const importer = resource.context

        const isExternal = getIsExternal(path, importer)
        const absolutePath = isExternal
          ? resolveExternalModule(path, importer)
          : resolveWithExtensions(path, importer)

        if (this.mockMap.has(absolutePath)) {
          resource.request = this.mockMap.get(absolutePath)!.replacementResource
        }
      } catch {
        logger.debug(`Could not resolve mock for "${resource.request}".`)
      }
    }).apply(compiler as any)

    compiler.hooks.afterCompile.tap(PLUGIN_NAME, (compilation) => {
      compilation.fileDependencies.add(this.options.previewConfigPath)

      for (const mock of this.mockMap.values()) {
        if (
          isAbsolute(mock.replacementResource) &&
          mock.replacementResource.includes('__mocks__')
        ) {
          compilation.contextDependencies.add(dirname(mock.replacementResource))
        }
      }
    })
  }

  private extractAndResolveMocks(compiler: Rspack.Compiler): ResolvedMock[] {
    const { previewConfigPath, configDir } = this.options
    const logger = compiler.getInfrastructureLogger(PLUGIN_NAME)

    const mocks = extractMockCalls(
      {
        previewConfigPath,
        configDir: configDir ?? dirname(previewConfigPath),
      },
      babelParser,
      compiler.context,
      findMockRedirect,
    )

    const resolvedMocks: ResolvedMock[] = []

    for (const mock of mocks) {
      try {
        const { absolutePath, redirectPath } = mock

        let replacementResource: string

        if (redirectPath) {
          replacementResource = redirectPath
        } else {
          const loaderPath = fileURLToPath(
            import.meta.resolve(
              'storybook-builder-rsbuild/loaders/rsbuild-automock-loader',
            ),
          )
          replacementResource = `${loaderPath}?spy=${mock.spy}!${absolutePath}`
        }

        resolvedMocks.push({
          ...mock,
          replacementResource,
        })
      } catch (error) {
        logger.warn(
          `Could not resolve mock for "${mock.path}". It will be ignored.`,
        )
      }
    }

    return resolvedMocks
  }
}
