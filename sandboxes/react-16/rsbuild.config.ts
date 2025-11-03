import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'

export default defineConfig({
  environments: {
    web: {
      source: {
        entry: { index: './src/index.tsx' },
      },
    },
  },
  plugins: [pluginReact()],
  tools: {
    rspack: (config) => {
      const newConfig = {
        ...config,
        module: { ...config.module }, // works fine
        plugins: [...config.plugins], // should also works fine, to test packages/builder-rsbuild/src/preview/iframe-rsbuild.config.ts:265
      }
      return newConfig
    },
  },
})
