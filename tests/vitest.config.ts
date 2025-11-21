import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    setupFiles: [resolve(__dirname, './vitest-setup.ts')],
    include: ['./*.test.ts'],
    testTimeout: 120000,
  },
})
