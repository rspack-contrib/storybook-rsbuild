import type { BuildEntries } from '../../scripts/build/utils/entry-utils'

const config: BuildEntries = {
  entries: {
    browser: [
      {
        exportEntries: ['.'],
        entryPoint: './src/index.ts',
      },
    ],
    node: [
      {
        exportEntries: ['./preset'],
        entryPoint: './src/preset.ts',
        dts: false,
      },
      {
        exportEntries: ['./node'],
        entryPoint: './src/node/index.ts',
      },
      {
        exportEntries: ['./loaders/react-docgen-loader'],
        entryPoint: './src/loaders/react-docgen-loader.ts',
      },
    ],
  },
}

export default config
