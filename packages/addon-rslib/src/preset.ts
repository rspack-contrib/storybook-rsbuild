import { type RsbuildConfig, mergeRsbuildConfig } from '@rsbuild/core'
import { loadConfig } from '@rslib/core'
import type {
  RsbuildFinal,
  StorybookConfigRsbuild,
} from 'storybook-builder-rsbuild'

import { startMFDevServer } from './init';

import type { AddonOptions } from './types'

type BaseOptions = Parameters<RsbuildFinal>[1]

export const rsbuildFinal: StorybookConfigRsbuild['rsbuildFinal'] = async (
  config,
  options: BaseOptions & AddonOptions,
) => {
  const { rslib = {} } = options
  const { cwd, configPath, libIndex = 0 } = rslib
  const rslibConfig = await loadConfig({
    cwd: cwd,
    path: configPath,
  })
  await startMFDevServer(rslibConfig);

  const libConfig = libIndex === false ? {} : rslibConfig.lib[libIndex]
  if (!libConfig) {
    throw new Error(
      `Lib config not found at index ${libIndex}, expect a lib config but got ${libConfig}`,
    )
  }

  const { lib: _lib, ...nonLibConfig } = rslibConfig
  const mergedLibConfig: RsbuildConfig = mergeRsbuildConfig(
    nonLibConfig as RsbuildConfig,
    libConfig as RsbuildConfig,
  )

  // Remove unapplicable fields.
  // TODO: add unapplicable fields
  delete mergedLibConfig.source?.entry
  delete mergedLibConfig.output?.distPath
  delete mergedLibConfig.output?.filename

  return mergeRsbuildConfig(config, mergedLibConfig);
}
