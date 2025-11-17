import { type RsbuildConfig, mergeRsbuildConfig } from '@rsbuild/core'
import { loadConfig } from '@rslib/core'
import type {
  RsbuildFinal,
  StorybookConfigRsbuild,
} from 'storybook-builder-rsbuild'
import type { AddonOptions } from './types'

type BaseOptions = Parameters<RsbuildFinal>[1]

export const rsbuildFinal: StorybookConfigRsbuild['rsbuildFinal'] = async (
  config,
  options: BaseOptions & AddonOptions,
) => {
  const { rslib = {} } = options
  const {
    cwd,
    configPath,
    libIndex = 0,
    modifyLibConfig,
    modifyLibRsbuildConfig,
  } = rslib
  const { content } = await loadConfig({
    cwd: cwd,
    path: configPath,
  })

  const libConfig = libIndex === false ? {} : content.lib[libIndex]
  if (!libConfig) {
    throw new Error(
      `Lib config not found at index ${libIndex}, expect a lib config but got ${libConfig}`,
    )
  }

  if (typeof modifyLibConfig === 'function') {
    modifyLibConfig(libConfig)
  }

  const { lib: _lib, ...nonLibConfig } = content
  const mergedLibConfig: RsbuildConfig = mergeRsbuildConfig(
    nonLibConfig as RsbuildConfig,
    libConfig as RsbuildConfig,
  )

  // TODO: Add more unapplicable fields.

  // #region Remove unapplicable fields.
  delete mergedLibConfig.source?.entry
  delete mergedLibConfig.output?.distPath
  delete mergedLibConfig.output?.filename
  delete mergedLibConfig.output?.cleanDistPath
  delete mergedLibConfig.output?.externals
  delete mergedLibConfig.server?.publicDir
  delete mergedLibConfig.dev?.progressBar
  // #endregion

  // #region Critical in the MF library, but it is appropriate to remove it for all library formats.
  delete mergedLibConfig.dev?.assetPrefix
  // #endregion

  if (typeof modifyLibRsbuildConfig === 'function') {
    modifyLibRsbuildConfig(mergedLibConfig)
  }

  return mergeRsbuildConfig(config, mergedLibConfig)
}
