import { fileURLToPath } from 'node:url'
import { mergeRsbuildConfig } from '@rsbuild/core'
import { pluginReactNativeWeb } from 'rsbuild-plugin-react-native-web'
import type { PresetProperty } from 'storybook/internal/types'
import { rsbuildFinal as reactRsbuildFinal } from 'storybook-react-rsbuild/preset'
import type { FrameworkOptions, StorybookConfig } from './types'

export const rsbuildFinal: StorybookConfig['rsbuildFinal'] = async (
  config,
  options,
) => {
  // Apply the react framework's rsbuildFinal for docgen support
  const reactConfig = await reactRsbuildFinal(config, options)

  // Get framework options
  const framework = await options.presets.apply('framework')
  const frameworkOptions: FrameworkOptions =
    typeof framework === 'string' ? {} : framework.options || {}

  // Apply React Native Web plugin
  return mergeRsbuildConfig(reactConfig, {
    plugins: [
      pluginReactNativeWeb({
        modulesToTranspile: frameworkOptions.modulesToTranspile,
        ...frameworkOptions.pluginOptions,
      }),
    ],
  })
}

export const core: PresetProperty<'core'> = async (config, options) => {
  const framework = await options.presets.apply('framework')
  return {
    ...config,
    builder: {
      name: fileURLToPath(import.meta.resolve('storybook-builder-rsbuild')),
      options:
        typeof framework === 'string' ? {} : framework.options.builder || {},
    },
    renderer: fileURLToPath(import.meta.resolve('@storybook/react/preset')),
  }
}
