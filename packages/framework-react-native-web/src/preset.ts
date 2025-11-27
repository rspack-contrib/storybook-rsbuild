import { mergeRsbuildConfig } from '@rsbuild/core'
import {
  core as reactCore,
  rsbuildFinal as reactRsbuildFinal,
} from 'storybook-react-rsbuild/preset'
import { createReactNativeWebRsbuildConfig } from './react-native-web'
import type { FrameworkOptions, StorybookConfig } from './types'

export const rsbuildFinal: StorybookConfig['rsbuildFinal'] = async (
  config,
  options,
) => {
  const baseConfig = await reactRsbuildFinal(config, options)
  const frameworkOptions =
    (await options.presets.apply<FrameworkOptions | null>(
      'frameworkOptions',
      {},
      options,
    )) || {}

  const reactNativeWebOptions = frameworkOptions.reactNativeWeb ?? {}

  return mergeRsbuildConfig(
    baseConfig,
    createReactNativeWebRsbuildConfig(reactNativeWebOptions),
  )
}

export const core = reactCore
