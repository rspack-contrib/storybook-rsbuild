import { dirname, join } from 'node:path'
import { pluginVue } from '@rsbuild/plugin-vue'
import type { StorybookConfig } from 'storybook-vue3-rsbuild'

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')))
}

const config: StorybookConfig = {
  stories: ['../stories/*.mdx', '../stories/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-onboarding',
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@chromatic-com/storybook',
    '@storybook/addon-interactions',
    {
      name: getAbsolutePath('storybook-addon-rslib'),
      options: {
        rslib: {
          include: ['**/stories/**'],
        },
      },
    },
  ],
  framework: {
    name: getAbsolutePath('storybook-vue3-rsbuild'),
    options: {},
  },
  rsbuildFinal: (config) => {
    // Since HMR for Rspack is not supported by unplugin-vue as of now (https://github.com/unplugin/unplugin-vue/issues/162),
    // it's better to remove rsbuild-plugin-unplugin-vue and use @rsbuild/plugin-vue to handle all Vue files.
    config.plugins = (config.plugins || []).filter((p) => {
      if (p && 'name' in p) {
        return p.name !== 'plugin-unplugin-vue'
      }
      return true
    })
    config.plugins.push(pluginVue())
    return config
  },
}

export default config
