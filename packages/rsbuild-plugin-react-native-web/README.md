# rsbuild-plugin-react-native-web

Rsbuild plugin for React Native Web support. This plugin enables you to use React Native components in web applications built with Rsbuild.

## Installation

```bash
npm install rsbuild-plugin-react-native-web react-native-web
```

## Usage

```ts
// rsbuild.config.ts
import { defineConfig } from '@rsbuild/core'
import { pluginReactNativeWeb } from 'rsbuild-plugin-react-native-web'

export default defineConfig({
  plugins: [pluginReactNativeWeb()],
})
```

## Options

### modulesToTranspile

An array of additional node_modules that need to be transpiled. By default, packages starting with `react-native`, `@react-native`, `expo`, and `@expo` are already included.

```ts
pluginReactNativeWeb({
  modulesToTranspile: ['my-react-native-library'],
})
```

## Features

- Aliases `react-native` to `react-native-web`
- Adds `.web.*` file extensions with higher priority
- Configures global variables required by React Native (`__DEV__`, `EXPO_OS`, etc.)
- Handles Flow syntax in React Native packages
- Transforms problematic code patterns for web compatibility

## License

MIT
