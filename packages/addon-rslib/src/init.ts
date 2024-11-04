import { createRsbuild, mergeRsbuildConfig } from '@rsbuild/core';
import { composeCreateRsbuildConfig } from '@rslib/core';

import type { RsbuildInstance, RsbuildConfig } from '@rsbuild/core';
import type { RslibConfig } from '@rslib/core'


export async function startMFDevServer(config: RslibConfig): Promise<RsbuildInstance | undefined> {
  const rsbuildInstance = await initMFRsbuild(config);
  if (!rsbuildInstance) {
    // no mf format, return.
    return;
  }
  await rsbuildInstance.startDevServer();
  return rsbuildInstance;
}

async function initMFRsbuild(
  rslibConfig: RslibConfig,
): Promise<RsbuildInstance | undefined> {
  const rsbuildConfigObject = await composeCreateRsbuildConfig(rslibConfig);
  const mfRsbuildConfig = rsbuildConfigObject.find(
    (config) => config.format === 'mf',
  );

  if (!mfRsbuildConfig) {
    // no mf format, return.
    return;
  }

  mfRsbuildConfig.config = changeEnvToDev(mfRsbuildConfig.config);
  return createRsbuild({
    rsbuildConfig: mfRsbuildConfig.config,
  });
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
  });
}