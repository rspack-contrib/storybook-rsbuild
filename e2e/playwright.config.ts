import { defineConfig, devices } from '@playwright/test'

const isCI = !!process.env.CI

export default defineConfig({
  testDir: './tests',
  forbidOnly: isCI,
  workers: isCI ? '25%' : '50%',
  retries: isCI ? 3 : 0,
  reporter: [['list']],
  timeout: isCI ? 360_000 : 180_000,
  use: {
    ...devices['Desktop Chrome'],
    headless: true,
    trace: 'retain-on-failure',
    navigationTimeout: 60_000,
  },
  expect: {
    timeout: isCI ? 60_000 : 20_000,
  },
})
