import type { RsbuildConfig } from '@rsbuild/core'
import type {
  Builder,
  Options,
  TypescriptOptions as TypeScriptOptionsBase,
} from '@storybook/types'
import type ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'

// Storybook's Stats are optional Webpack related property
type RsbuildStats = {
  toJson: () => any
}

/**
 * Options for TypeScript usage within Storybook.
 */
export interface TypescriptOptions extends TypeScriptOptionsBase {
  /**
   * Configures `fork-ts-checker-webpack-plugin`
   */
  checkOptions?: ConstructorParameters<typeof ForkTsCheckerWebpackPlugin>[0]
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
