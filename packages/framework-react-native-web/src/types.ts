import type {
  BuilderOptions,
  StorybookConfigRsbuild,
  TypescriptOptions as TypescriptOptionsBuilder,
} from 'storybook-builder-rsbuild'
import type {
  StorybookConfig as StorybookConfigBase,
  TypescriptOptions as TypescriptOptionsBase,
} from 'storybook/internal/types'

type FrameworkName = 'storybook-react-native-web-rsbuild'
type BuilderName = 'storybook-builder-rsbuild'

type BabelTuple = [string, Record<string, unknown>]

export type FrameworkOptions = {
  builder?: BuilderOptions
  modulesToTranspile?: string[]
  modulesToAlias?: Record<string, string>
  babelPlugins?: Array<string | BabelTuple>
  babelPresets?: Array<string | BabelTuple>
  babelPresetReactOptions?: Record<string, unknown>
  babelPresetReactNativeOptions?: Record<string, unknown>
  projectRoot?: string
}

export type ReactNativeWebFrameworkDescription =
  | FrameworkName
  | {
      name: FrameworkName
      options: FrameworkOptions
    }

type StorybookConfigFramework = {
  framework: ReactNativeWebFrameworkDescription
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
