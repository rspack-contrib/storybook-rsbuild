import { pluginReact } from '@rsbuild/plugin-react'
import { pluginSass } from '@rsbuild/plugin-sass'
import { defineConfig, type LibConfig } from '@rslib/core'

const shared: LibConfig = {
  bundle: false,
  dts: {
    bundle: false,
  },
}

export default defineConfig({
  lib: [
    {
      ...shared,
      source: {
        entry: {
          index: ['./src/**', '!./src/env.d.ts'],
        },
      },
      format: 'esm',
      output: {
        distPath: {
          root: './dist/esm',
        },
      },
    },
    {
      ...shared,
      format: 'cjs',
      source: {
        entry: {
          index: ['./src/**', '!./src/env.d.ts'],
        },
      },
      output: {
        distPath: {
          root: './dist/cjs',
        },
      },
    },
  ],
  plugins: [
    pluginReact({
      swcReactOptions: {
        runtime: 'classic',
      },
    }),
    pluginSass(),
  ],
})
