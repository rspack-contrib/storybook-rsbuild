import type { StorybookConfig as StorybookConfigBase } from '@storybook/types'
import type {
  StorybookConfigRsbuild,
  BuilderOptions,
} from 'storybook-builder-rsbuild'

type FrameworkName = 'storybook-vue3-rsbuild'
type BuilderName = 'storybook-builder-rsbuild'

export type FrameworkOptions = {
  builder?: BuilderOptions
}

type StorybookConfigFramework = {
  framework:
    | FrameworkName
    | {
        name: FrameworkName
        options: FrameworkOptions
      }
  core?: StorybookConfigBase['core'] & {
    builder?:
      | BuilderName
      | {
          name: BuilderName
          options: BuilderOptions
        }
  }
  typescript?: StorybookConfigBase['typescript']
}

/**
 * The interface for Storybook configuration in `main.ts` files.
 */
export type StorybookConfig = Omit<
  StorybookConfigBase,
  keyof StorybookConfigRsbuild | keyof StorybookConfigFramework
> &
  StorybookConfigRsbuild &
  StorybookConfigFramework
