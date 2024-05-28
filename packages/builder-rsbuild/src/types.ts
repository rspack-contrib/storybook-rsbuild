import type { Stats } from './index'
import type { RsbuildConfig } from '@rsbuild/core'
import type {
  Builder,
  Options,
  TypescriptOptions as TypeScriptOptionsBase,
  BuilderResult as BuilderResultBase,
} from '@storybook/types'
import type { PluginTypeCheckerOptions } from '@rsbuild/plugin-type-check'

// Storybook's Stats are optional Webpack related property
type RsbuildStats = {
  toJson: () => any
}

/**
 * Options for TypeScript usage within Storybook.
 */
export interface TypescriptOptions extends TypeScriptOptionsBase {
  /**
   * Configures `@rsbuild/plugin-type-check`, using `fork-ts-checker-webpack-plugin` under the hood.
   */
  checkOptions?: PluginTypeCheckerOptions
}

export type RsbuildBuilder = Builder<RsbuildConfig, RsbuildStats>

export type RsbuildFinal = (
  config: RsbuildConfig,
  options: Options,
) => RsbuildConfig | Promise<RsbuildConfig>

export type StorybookConfigRsbuild = {
  rsbuildFinal?: RsbuildFinal
}

export type BuilderOptions = {
  /**
   * Path to rsbuild.config file, relative to CWD.
   */
  rsbuildConfigPath?: string
}

export interface BuilderResult extends BuilderResultBase {
  stats?: Stats
}
