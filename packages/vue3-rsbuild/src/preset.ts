import { dirname, join } from 'node:path'
import type { PresetProperty } from 'storybook/internal/types'

export { rsbuildFinal } from './framework-preset-vue3-docs'

const getAbsolutePath = <I extends string>(input: I): I =>
  dirname(require.resolve(join(input, 'package.json'))) as any

export const core: PresetProperty<'core'> = async (config, options) => {
  const framework = await options.presets.apply('framework')

  return {
    builder: {
      name: getAbsolutePath('storybook-builder-rsbuild'),
      options:
        typeof framework === 'string' ? {} : framework.options.builder || {},
    },
    renderer: getAbsolutePath('@storybook/vue3'),
  }
}

export const typescript: PresetProperty<'typescript'> = async (config) => ({
  ...config,
  skipCompiler: true,
})
