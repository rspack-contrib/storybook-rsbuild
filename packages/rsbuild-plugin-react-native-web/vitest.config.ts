import { defineConfig, mergeConfig } from 'vitest/config'
import { vitestCommonConfig } from '../../vitest.config'

export default mergeConfig(
  vitestCommonConfig,
  defineConfig({
    test: {
      name: 'rsbuild-plugin-react-native-web',
    },
  }),
)
