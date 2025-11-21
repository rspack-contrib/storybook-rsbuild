import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { StorybookConfig } from 'storybook-react-rsbuild'

const getAbsolutePath = (value: string): any => {
  return path.resolve(
    fileURLToPath(
      new URL(import.meta.resolve(`${value}/package.json`, import.meta.url)),
    ),
    '..',
  )
}

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-onboarding',
    '@storybook/addon-docs',
    '@chromatic-com/storybook',
    {
      name: getAbsolutePath('storybook-addon-rslib') as any,
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
    name: getAbsolutePath('storybook-react-rsbuild') as any,
    options: {},
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    check: true,
  },
}

export default config
