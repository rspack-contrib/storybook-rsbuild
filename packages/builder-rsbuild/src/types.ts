import type { RsbuildConfig } from '@rsbuild/core'
import type { Builder, Options } from '@storybook/types'

// Storybook's Stats are optional Webpack related property
type RsbuildStats = {
  toJson: () => any
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
