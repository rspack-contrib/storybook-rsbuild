# storybook-react-native-web-rsbuild

> Storybook framework preset for React Native Web powered by Rsbuild.

## Installation

```bash
pnpm add storybook-react-native-web-rsbuild metro-react-native-babel-preset babel-plugin-react-native-web -D
```

## Usage

Update your `.storybook/main.ts` configuration:

```ts
import type { StorybookConfig } from 'storybook-react-native-web-rsbuild'

const config: StorybookConfig = {
  framework: {
    name: 'storybook-react-native-web-rsbuild',
    options: {
      // modulesToTranspile: ['react-native-paper'],
      // modulesToAlias: { 'react-native-gesture-handler': 'react-native-gesture-handler/web' },
    },
  },
}

export default config
```

See the [documentation](https://storybook.rsbuild.rs) for more details.
