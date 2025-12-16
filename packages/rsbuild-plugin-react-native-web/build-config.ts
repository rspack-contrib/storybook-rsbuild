import type { BuildEntries } from '../../scripts/build/utils/entry-utils'

const config: BuildEntries = {
  entries: {
    browser: [],
    node: [
      {
        exportEntries: ['.'],
        entryPoint: './src/index.ts',
      },
    ],
  },
}

export default config
