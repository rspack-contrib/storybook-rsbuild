import { dirname, join } from 'node:path'
import type { StorybookConfig } from 'storybook-react-rsbuild'
import moduleFederationConfig from '../module-federation.config'

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
    {
      // For this repo, you can use `storybook-addon-modernjs` directly.
      name: getAbsolutePath('storybook-addon-modernjs'),
      options: {},
    },
    {
      name: '@module-federation/storybook-addon',
      options: {
        remotes: moduleFederationConfig.remotes,
      },
    },
  ],
  framework: {
    // For this repo, you can use `storybook-react-rsbuild` directly.
    name: getAbsolutePath('storybook-react-rsbuild'),
    options: {},
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      propFilter: () => true,
    },
    check: true,
  },
}

export default config
