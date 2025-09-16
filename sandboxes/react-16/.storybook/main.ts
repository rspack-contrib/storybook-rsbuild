import { dirname, join } from 'node:path'
import type { StorybookConfig } from 'storybook-react-rsbuild'

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')))
}

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-onboarding',
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-docs',
    '@chromatic-com/storybook',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: getAbsolutePath('storybook-react-rsbuild'),
    options: {
      builder: {
        lazyCompilation: true,
      },
    },
  },
  docs: {
    defaultName: 'Docs',
    docsMode: false,
  },
  typescript: {
    reactDocgen: 'react-docgen',
    check: true,
  },
  staticDirs: ['../public'],
  rsbuildFinal: async (config) => {
    config.tools!.rspack = (config, { mergeConfig }) => {
      return mergeConfig(config, {})
    }
    return config
  },
}

export default config
