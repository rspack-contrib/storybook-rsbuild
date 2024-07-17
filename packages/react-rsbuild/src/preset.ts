import { dirname, join } from 'node:path'
import type { PresetProperty } from 'storybook/internal/types'
import { rsbuildFinalDocs } from './react-docs'
import type { StorybookConfig } from './types'

const getAbsolutePath = <I extends string>(input: I): I =>
  dirname(require.resolve(join(input, 'package.json'))) as any

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
      name: getAbsolutePath('storybook-builder-rsbuild'),
      options:
        typeof framework === 'string' ? {} : framework.options.builder || {},
    },
    renderer: getAbsolutePath('@storybook/react'),
  }
}
