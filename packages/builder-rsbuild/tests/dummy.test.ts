import type { Presets } from 'storybook/internal/types'
import { describe, expect } from 'vitest'
import type { RsbuildBuilderOptions } from '../src/preview/iframe-rsbuild.config'

// @ts-expect-error TODO
const dummyOptions: RsbuildBuilderOptions = {
  configType: 'DEVELOPMENT',
  configDir: '',
  packageJson: {},
  presets: {
    apply: async (key: string) =>
      ({
        framework: {
          name: '',
        },
        addons: [],
        core: {
          builder: {},
        },
        options: {},
      })[key],
  } as Presets,
  presetsList: [],
  typescriptOptions: {
    check: false,
    skipCompiler: true,
  },
}

describe('dummy', () => {
  expect(1).toBe(1)
})
