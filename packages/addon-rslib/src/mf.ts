import { createRsbuild, mergeRsbuildConfig } from '@rsbuild/core'
import { unstable_composeCreateRsbuildConfig } from '@rslib/core'

import type { RsbuildConfig, RsbuildInstance } from '@rsbuild/core'
import type { RslibConfig } from '@rslib/core'

export async function startMFDevServer(
  config: RslibConfig,
): Promise<RsbuildInstance | undefined> {
  if (process.env.NODE_ENV === 'production') {
    // storybook build should skip this.
    return
  }

  const rsbuildInstance = await initMFRsbuild(config)
  return rsbuildInstance
}

async function initMFRsbuild(
  rslibConfig: RslibConfig,
): Promise<RsbuildInstance | undefined> {
  const rsbuildConfigObject =
    await unstable_composeCreateRsbuildConfig(rslibConfig)
  const mfRsbuildConfig = rsbuildConfigObject.find(
    (config) => config.format === 'mf',
  )

  if (!mfRsbuildConfig) {
    // no mf format, return.
    return
  }

  mfRsbuildConfig.config = changeEnvToDev(mfRsbuildConfig.config)
  const rsbuildInstance = await createRsbuild({
    rsbuildConfig: mfRsbuildConfig.config,
  })
  await rsbuildInstance.startDevServer()
  return rsbuildInstance
}

function changeEnvToDev(rsbuildConfig: RsbuildConfig) {
  return mergeRsbuildConfig(rsbuildConfig, {
    mode: 'development',
    dev: {
      writeToDisk: true,
    },
    tools: {
      rspack: {
        optimization: {
          nodeEnv: 'development',
        },
      },
    },
  })
}
