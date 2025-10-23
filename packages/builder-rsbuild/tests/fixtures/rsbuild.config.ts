import { defineConfig } from '@rsbuild/core'

export default defineConfig({
  source: {
    entry: {
      custom: ['./user-defined-entry.js'],
    },
  },
})
