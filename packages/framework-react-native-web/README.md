# storybook-react-native-web-rsbuild

Rsbuild-based Storybook framework for React Native Web. It reuses the React framework defaults and adds React Native Web specific Babel + Rspack tweaks (aliases, `.web.*` extensions, `__DEV__` defines, and a configurable Babel loader for uncompiled RN modules).

## Usage

```ts
// .storybook/main.ts
import type { StorybookConfig } from 'storybook-react-native-web-rsbuild'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  framework: {
    name: 'storybook-react-native-web-rsbuild',
    options: {
      reactNativeWeb: {
        modulesToTranspile: ['react-native-reanimated', 'nativewind'],
        babelPresets: ['nativewind/babel'],
        babelPlugins: ['react-native-reanimated/plugin'],
      },
    },
  },
}

export default config
```
