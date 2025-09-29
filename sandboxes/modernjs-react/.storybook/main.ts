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
    '@storybook/addon-docs',
    '@chromatic-com/storybook',
    {
      // For this repo, you can use `storybook-addon-modernjs` directly.
      name: getAbsolutePath('storybook-addon-modernjs'),
      options: {},
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
