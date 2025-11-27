import { defineConfig } from 'vitest/config'

export const vitestCommonConfig = defineConfig({
  test: {
    passWithNoTests: true,
    clearMocks: true,
    globals: true,
    testTimeout: 10000,
    environment: 'node',
    pool: 'threads',
    include: ['**/*.test.{ts,tsx}'],
  },
})

// Root vitest config which aggregates all other vitest configs
export default defineConfig({
  test: {
    projects: [
      './packages/*/vitest.config.ts',
      './sandboxes/*/vitest.config.ts',
      './tests/vitest.config.ts',
    ],
  },
})
