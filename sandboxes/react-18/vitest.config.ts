/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig, mergeConfig } from 'vitest/config'
import { vitestCommonConfig } from '../../vitest.config'

export default mergeConfig(
  vitestCommonConfig,
  defineConfig({
    test: {
      environment: 'node',
    },
  }),
)
