import { resolve } from 'node:path'
import { defineConfig, defineWorkspace } from 'vitest/config'

export default defineWorkspace(['packages/*/vitest.config.ts'])

/**
 * CircleCI reports the wrong number of threads to Node.js, so we need to set it manually.
 * Unit tests are running with the xlarge resource class, which has 8 vCPUs.
 * @see https://jahed.dev/2022/11/20/fixing-node-js-multi-threading-on-circleci/
 * @see https://vitest.dev/config/#pooloptions-threads-maxthreads
 * @see https://circleci.com/docs/configuration-reference/#x86
 * @see .circleci/config.yml#L214
 */
const threadCount = process.env.CI ? 8 : undefined

export const vitestCommonConfig = defineConfig({
  test: {
    passWithNoTests: true,
    clearMocks: true,
    setupFiles: [resolve(__dirname, './vitest-setup.ts')],
    globals: true,
    testTimeout: 10000,
    environment: 'node',
    poolOptions: {
      threads: {
        minThreads: threadCount,
        maxThreads: threadCount,
      },
    },
  },
})
