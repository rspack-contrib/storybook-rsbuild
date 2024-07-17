import { mergeRsbuildConfig } from '@rsbuild/core'
import { hasDocsOrControls } from 'storybook/internal/docs-tools'

import type { RsbuildConfig } from '@rsbuild/core'
import { requirer } from './requirer'
import type { StorybookConfig } from './types'

export const rsbuildFinalDocs: NonNullable<
  StorybookConfig['rsbuildFinal']
> = async (config, options): Promise<RsbuildConfig> => {
  if (!hasDocsOrControls(options)) return config

  const typescriptOptions = await options.presets.apply('typescript', {} as any)
  const debug = options.loglevel === 'debug'

  const { reactDocgen } = typescriptOptions || {}

  if (typeof reactDocgen !== 'string') {
    return config
  }

  if (reactDocgen !== 'react-docgen-typescript') {
    return mergeRsbuildConfig(config, {
      tools: {
        rspack: {
          module: {
            rules: [
              {
                test: /\.(cjs|mjs|tsx?|jsx?)$/,
                enforce: 'pre',
                loader: requirer(
                  require.resolve,
                  'storybook-react-rsbuild/loaders/react-docgen-loader',
                ),
                options: {
                  debug,
                },
                exclude: /(\.(stories|story)\.(js|jsx|ts|tsx))|(node_modules)/,
              },
            ],
          },
        },
      },
    })
  }

  // TODO: Rspack doesn't support the hooks `react-docgen-typescript`' required
  throw new Error(
    "Rspack didn't support the hooks `react-docgen-typescript`' required",
  )

  // const { ReactDocgenTypeScriptPlugin } = await import(
  //   '@storybook/react-docgen-typescript-plugin'
  // )

  // const { reactDocgenTypescriptOptions } = typescriptOptions || {}

  // return mergeRsbuildConfig(config, {
  //   tools: {
  //     rspack: {
  //       module: {
  //         rules: [
  //           {
  //             test: /\.(cjs|mjs|jsx?)$/,
  //             enforce: 'pre',
  //             loader: requirer(
  //               require.resolve,
  //               'storybook-react-rsbuild/loaders/react-docgen-loader',
  //             ),
  //             options: {
  //               debug,
  //             },
  //             exclude: /(\.(stories|story)\.(js|jsx|ts|tsx))|(node_modules)/,
  //           },
  //         ],
  //       },
  //       plugins: [
  //         new ReactDocgenTypeScriptPlugin({
  //           ...reactDocgenTypescriptOptions,
  //           // We *need* this set so that RDT returns default values in the same format as react-docgen
  //           savePropValueAsString: true,
  //         }),
  //       ],
  //     },
  //   },
  // })
}
