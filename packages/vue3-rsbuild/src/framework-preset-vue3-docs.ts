import type { StorybookConfig } from './types'
import { hasDocsOrControls } from 'storybook/internal/docs-tools'
import { mergeRsbuildConfig } from '@rsbuild/core'

export const rsbuildFinal: StorybookConfig['rsbuildFinal'] = (
  config,
  options,
) => {
  if (!hasDocsOrControls(options)) return config

  let vueDocgenOptions = {}

  options.presetsList?.forEach((preset) => {
    if (preset.name.includes('addon-docs') && preset.options.vueDocgenOptions) {
      const appendableOptions = preset.options.vueDocgenOptions
      vueDocgenOptions = {
        ...vueDocgenOptions,
        ...appendableOptions,
      }
    }
  })

  const finalConfig = mergeRsbuildConfig(config, {
    tools: {
      rspack: (config, { mergeConfig }) => {
        return mergeConfig(config, {
          module: {
            rules: [
              {
                test: /\.vue$/,
                loader: require.resolve('vue-docgen-loader', {
                  // paths: [require.resolve('@storybook/preset-vue3-webpack')],
                }),
                enforce: 'post',
                options: {
                  docgenOptions: {
                    alias: config.resolve?.alias,
                    ...vueDocgenOptions,
                  },
                },
              },
            ],
          },
        })
      },
    },
  })

  return finalConfig
}
