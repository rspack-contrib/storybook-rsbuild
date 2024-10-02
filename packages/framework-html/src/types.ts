import type {
  BuilderOptions,
  StorybookConfigRsbuild,
  TypescriptOptions as TypescriptOptionsBuilder,
} from 'storybook-builder-rsbuild'
import type {
  StorybookConfig as StorybookConfigBase,
  TypescriptOptions as TypescriptOptionsBase,
} from 'storybook/internal/types'

type FrameworkName = 'storybook-html-rsbuild'
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
  typescript?: Partial<TypescriptOptionsBase & TypescriptOptionsBuilder>
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
