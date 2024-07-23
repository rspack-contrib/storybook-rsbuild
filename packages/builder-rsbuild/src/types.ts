import type { RsbuildConfig } from '@rsbuild/core'
import type { PluginTypeCheckerOptions } from '@rsbuild/plugin-type-check'
import type {
  Builder,
  BuilderResult as BuilderResultBase,
  Options,
  TypescriptOptions as TypeScriptOptionsBase,
} from 'storybook/internal/types'
import type { Stats } from './index'

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
  /**
   * Enable Rspack's lazy compilation (experimental).
   */
  lazyCompilation?: boolean
  /**
   * Which environment to use from the Rsbuild config.
   */
  environment?: string
}

export interface BuilderResult extends BuilderResultBase {
  stats?: Stats
}
