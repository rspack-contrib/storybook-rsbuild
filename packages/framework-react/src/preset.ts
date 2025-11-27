import { fileURLToPath } from 'node:url'
import type { PresetProperty } from 'storybook/internal/types'
import { rsbuildFinalDocs } from './react-docs'
import type { StorybookConfig } from './types'

export const rsbuildFinal: StorybookConfig['rsbuildFinal'] = async (
  config,
  options,
) => {
  const finalConfig = rsbuildFinalDocs(config, options)
  return finalConfig
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
