import { fileURLToPath } from 'node:url'
import type { PresetProperty } from 'storybook/internal/types'
import type { StorybookConfig } from './types'

export const core: PresetProperty<'core'> = async (_config, options) => {
  const framework = await options.presets.apply('framework')

  return {
    builder: {
      name: fileURLToPath(import.meta.resolve('storybook-builder-rsbuild')),
      options:
        typeof framework === 'string' ? {} : framework.options.builder || {},
    },
    renderer: fileURLToPath(
      import.meta.resolve('@storybook/web-components/preset'),
    ),
  }
}

export const rsbuildFinal: StorybookConfig['rsbuildFinal'] = (
  config,
  _options,
) => {
  delete config.html
  return config
}
