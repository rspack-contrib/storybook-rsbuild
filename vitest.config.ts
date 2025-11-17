import { defineConfig } from 'vitest/config'

// Root vitest config to override defaults
// This ensures e2e/*.spec.ts files are not picked up by vitest
export default defineConfig({
  test: {
    // Only include .test.ts files, exclude .spec.ts (which are for Playwright e2e tests)
    include: ['**/*.test.{ts,tsx}'],
  },
})
