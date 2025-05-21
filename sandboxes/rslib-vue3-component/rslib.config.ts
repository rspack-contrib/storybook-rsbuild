import { pluginSass } from '@rsbuild/plugin-sass'
import { defineConfig } from '@rslib/core'
import { pluginUnpluginVue } from 'rsbuild-plugin-unplugin-vue'

export default defineConfig({
  lib: [
    {
      bundle: false,
      format: 'esm',
      output: {
        distPath: {
          root: './dist',
        },
      },
    },
  ],
  plugins: [pluginUnpluginVue(), pluginSass()],
})
