import { type RsbuildConfig, mergeRsbuildConfig } from '@rsbuild/core'
import { hasDocsOrControls } from 'storybook/internal/docs-tools'
import type { StorybookConfig } from './types'

const rsbuildFinalDoc: StorybookConfig['rsbuildFinal'] = (
  config,
  options,
): RsbuildConfig => {
  if (!hasDocsOrControls(options)) return config

  let vueDocgenOptions = {}

  for (const preset of options.presetsList || []) {
    if (preset.name.includes('addon-docs') && preset.options.vueDocgenOptions) {
      const appendableOptions = preset.options.vueDocgenOptions
      vueDocgenOptions = {
        ...vueDocgenOptions,
        ...appendableOptions,
      }
    }
  }

  return {
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
  }
}

const rsbuildFinalBase: StorybookConfig['rsbuildFinal'] = (
  config,
  options,
): RsbuildConfig => {
  return {
    resolve: {
      alias: {
        // https://github.com/fengyuanchen/vue-feather/issues/8
        // Port https://github.com/storybookjs/storybook/blob/4224713c21c1f1ada8aca68db1b855dfad7f6975/code/presets/vue3-webpack/src/framework-preset-vue3.ts#L59.
        vue$: require.resolve('vue/dist/vue.esm-bundler.js'),
      },
    },
  }
}

export const rsbuildFinal: StorybookConfig['rsbuildFinal'] = (
  config,
  options,
) => {
  return mergeRsbuildConfig(
    config,
    rsbuildFinalBase(config, options),
    rsbuildFinalDoc(config, options),
  )
}
