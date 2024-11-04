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
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
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
    {
      name: '@module-federation/storybook-addon/preset',
      options: {
        remotes: {
          'rslib-module':
            'rslib-module@http://localhost:3001/mf/mf-manifest.json',
        },
      },
    },
  ],
  framework: {
    name: getAbsolutePath('storybook-react-rsbuild'),
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    check: true,
  },
}

export default config
