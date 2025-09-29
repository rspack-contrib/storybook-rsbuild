import { dirname, join } from 'node:path'
import type { StorybookConfig } from 'storybook-react-native-web-rsbuild'

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')))
}

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-onboarding',
    '@storybook/addon-docs',
    '@chromatic-com/storybook',
  ],
  framework: {
    name: getAbsolutePath('storybook-react-native-web-rsbuild'),
    options: {},
  },
}

export default config
