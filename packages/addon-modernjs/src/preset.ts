import type { AppNormalizedConfig, AppTools } from '@modern-js/app-tools'
import {
  builderPluginAdapterBasic,
  builderPluginAdapterHooks,
  parseRspackConfig as parseToRsbuildConfig,
} from '@modern-js/app-tools/builder'
import { createStorybookOptions } from '@modern-js/plugin-v2/cli'
// TODO: better import from `@modern-js/app-tools/builder`
import { mergeRsbuildConfig } from '@rsbuild/core'
import type { StorybookConfigRsbuild } from 'storybook-builder-rsbuild'

const MODERN_META_NAME = 'modern-js'
const MODERN_CONFIG_FILE = 'modern.config.ts'

/**
 * Storybook addon for Modern.js, only support bundler `rspack`.
 */
export const rsbuildFinal: StorybookConfigRsbuild['rsbuildFinal'] = async (
  config,
) => {
  const cwd = process.cwd()
  const { config: resolveConfig, getAppContext } = await createStorybookOptions<
    AppTools<'shared'>
  >({
    cwd,
    configFile: MODERN_CONFIG_FILE,
    metaName: MODERN_META_NAME,
  })

  const nonStandardConfig = {
    ...resolveConfig,
    plugins: [resolveConfig.builderPlugins],
  }
  // Parse the non-standardized config to rsbuild config
  const { rsbuildConfig, rsbuildPlugins } = await parseToRsbuildConfig(
    nonStandardConfig,
    {
      cwd,
    },
  )

  const appContext = getAppContext()
  const adapterParams = {
    appContext,
    normalizedConfig: resolveConfig as AppNormalizedConfig<'rspack'>,
  }

  // Inject the extra rsbuild plugins
  rsbuildConfig.plugins = [
    ...rsbuildPlugins,
    ...(rsbuildConfig.plugins || []),
    builderPluginAdapterBasic(adapterParams),
    builderPluginAdapterHooks(adapterParams),
  ]

  const finalConfig = mergeRsbuildConfig(config, rsbuildConfig)
  return finalConfig
}
