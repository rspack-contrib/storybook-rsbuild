import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { StorybookConfig } from 'storybook-react-native-web-rsbuild'

const getAbsolutePath = (value: string): string => {
  return path.resolve(
    fileURLToPath(
      new URL(import.meta.resolve(`${value}/package.json`, import.meta.url)),
    ),
    '..',
  )
}

console.log('🤒', getAbsolutePath('react-native-css-interop'))

const config: StorybookConfig = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-onboarding',
    '@chromatic-com/storybook',
  ],
  framework: {
    name: getAbsolutePath('storybook-react-native-web-rsbuild'),
    options: {
      reactNativeWeb: {
        modulesToTranspile: [
          getAbsolutePath('react-native-reanimated'),
          getAbsolutePath('react-native-css-interop'),
          getAbsolutePath('nativewind'),
          getAbsolutePath('react-native-svg'),
        ],
        babelPresets: ['nativewind/babel'],
        babelPresetReactOptions: { jsxImportSource: 'nativewind' },
        babelPlugins: ['react-native-reanimated/plugin'],
      },
    },
  },
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
  },
}

export default config
