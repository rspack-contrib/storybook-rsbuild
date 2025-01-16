import { pluginModuleFederation } from '@module-federation/rsbuild-plugin'
import { pluginReact } from '@rsbuild/plugin-react'
import { pluginSass } from '@rsbuild/plugin-sass'
import { type LibConfig, defineConfig } from '@rslib/core'

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
    {
      format: 'mf',
      output: {
        distPath: {
          root: './dist/mf',
        },
        assetPrefix: 'http://localhost:3001/mf',
      },
      dev: {
        assetPrefix: 'http://localhost:3001/mf',
      },
      plugins: [
        pluginModuleFederation({
          name: 'rslib_provider',
          exposes: {
            '.': './src/index.tsx',
          },
          shared: {
            react: {
              singleton: true,
            },
            'react-dom': {
              singleton: true,
            },
          },
        }),
      ],
    },
  ],
  // just for dev
  server: {
    port: 3001,
  },
  plugins: [
    pluginReact({
      swcReactOptions: {
        runtime: 'classic',
      },
    }),
    pluginSass(),
  ],
})
