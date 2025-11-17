import type { StorybookConfig } from 'storybook-react-rsbuild'
import moduleFederationConfig from '../module-federation.config'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-onboarding',
    '@storybook/addon-docs',
    '@chromatic-com/storybook',
    {
      // For this repo, you can use `storybook-addon-modernjs` directly.
      name: import.meta.resolve('storybook-addon-modernjs') as any,
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
    name: import.meta.resolve('storybook-react-rsbuild') as any,
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
