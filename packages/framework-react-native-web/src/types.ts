import type { PluginOptions as ReactDocgenTypescriptOptions } from '@storybook/react-docgen-typescript-plugin'
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

export type ReactNativeWebOptions = {
  modulesToTranspile?: string[]
  modulesToAlias?: Record<string, string>
  babelPlugins?: Array<string | [string, Record<string, unknown>]>
  babelPresets?: Array<string | [string, Record<string, unknown>]>
  babelPresetReactOptions?: Record<string, unknown>
  babelPresetReactNativeOptions?: Record<string, unknown>
  projectRoot?: string
}

export type FrameworkOptions = {
  builder?: BuilderOptions
  strictMode?: boolean
  legacyRootApi?: boolean
  reactNativeWeb?: ReactNativeWebOptions
}

type TypescriptOptionsReact = {
  reactDocgen: 'react-docgen-typescript' | 'react-docgen' | false
  reactDocgenTypescriptOptions: ReactDocgenTypescriptOptions
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
  typescript?: Partial<
    TypescriptOptionsBase & TypescriptOptionsBuilder & TypescriptOptionsReact
  >
}

export type StorybookConfig = Omit<
  StorybookConfigBase,
  keyof StorybookConfigRsbuild | keyof StorybookConfigFramework
> &
  StorybookConfigRsbuild &
  StorybookConfigFramework
