import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'
// @ts-expect-error
import rspackConfig from './rspack.config.cjs'

export default defineConfig({
  plugins: [pluginReact()],
  tools: {
    rspack: (config) => {
      // Apply less loader from the Rspack config.
      const lessLoader = rspackConfig.module.rules[2]
      config.module!.rules!.push(lessLoader)
      return config
    },
  },
})
