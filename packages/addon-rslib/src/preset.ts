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
  const { cwd, configPath, libIndex = 0 } = rslib
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

  const { lib: _lib, ...nonLibConfig } = content
  const mergedLibConfig: RsbuildConfig = mergeRsbuildConfig(
    nonLibConfig as RsbuildConfig,
    libConfig as RsbuildConfig,
  )

  // TODO: Add more unapplicable fields.

  // #region Remove unapplicable fields that affects `source` / `output`.
  delete mergedLibConfig.source?.entry
  delete mergedLibConfig.output?.distPath
  delete mergedLibConfig.output?.filename
  // #endregion

  // #region Critical in the MF library, but it is appropriate to remove it for all library formats.
  delete mergedLibConfig.output?.assetPrefix
  delete mergedLibConfig.dev?.assetPrefix
  // #endregion

  return mergeRsbuildConfig(config, mergedLibConfig)
}
