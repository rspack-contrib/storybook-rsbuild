import { resolve } from 'node:path'
/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig, mergeConfig } from 'vitest/config'
import { vitestCommonConfig } from '../../vitest.workspace'

export default mergeConfig(
  vitestCommonConfig,
  defineConfig({
    test: {
      setupFiles: [resolve(__dirname, '../../vitest-setup.ts')],
      environment: 'node',
    },
  }),
)
