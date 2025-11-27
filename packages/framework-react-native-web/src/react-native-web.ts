import { createRequire } from 'node:module'
import path from 'node:path'
import { pluginBabel } from '@rsbuild/plugin-babel'
import type { RsbuildConfig } from '@rsbuild/core'
import type { ReactNativeWebOptions } from './types'

const requireFromHere = createRequire(import.meta.url)

const getModule = (name: string) => path.join('node_modules', name)

const DEFAULT_INCLUDES = [
  getModule('react-native'),
  getModule('react-navigation'),
  getModule('expo'),
  getModule('unimodules'),
  getModule('@react'),
  getModule('@expo'),
  getModule('@use-expo'),
  getModule('@unimodules'),
  getModule('native-base'),
  getModule('styled-components'),
]

const DEFAULT_EXCLUDES = [
  '/node_modules',
  '/bower_components',
  '/.expo/',
  '(webpack)',
]

const RN_EXTENSIONS = ['.web.js', '.web.jsx', '.web.ts', '.web.tsx', '.web.mjs']

const getBabelPlugins = (options: ReactNativeWebOptions) => {
  const basePlugins = ['react-native-web']
  if (options?.babelPlugins && Array.isArray(options.babelPlugins)) {
    return [...basePlugins, ...options.babelPlugins]
  }
  return basePlugins
}

const isInstalled = (name: string) => {
  try {
    requireFromHere.resolve(`${name}/package.json`)
    return true
  } catch (error) {
    return false
  }
}

const getRnPreset = () => {
  if (isInstalled('@react-native/babel-preset')) {
    return 'module:@react-native/babel-preset'
  }

  if (isInstalled('metro-react-native-babel-preset')) {
    return 'module:metro-react-native-babel-preset'
  }

  throw new Error(
    "Couldn't find @react-native/babel-preset or metro-react-native-babel-preset.",
  )
}

const dedupe = <T>(values: T[]) => Array.from(new Set(values))
const escapeRegExp = (input: string) =>
  input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export const createReactNativeWebRsbuildConfig = (
  options: ReactNativeWebOptions = {},
): RsbuildConfig => {
  const babelPlugins = getBabelPlugins(options)
  const babelPresets = options?.babelPresets ?? []
  const babelPresetReactOptions = options?.babelPresetReactOptions ?? {}
  const babelPresetReactNativeOptions =
    options?.babelPresetReactNativeOptions ?? {}
  const root = options?.projectRoot ?? process.cwd()
  const userModules = options?.modulesToTranspile?.map(getModule) ?? []
  const modules = [...DEFAULT_INCLUDES, ...userModules]
  const userAliases = options?.modulesToAlias ?? {}
  const includePatterns = dedupe([
    ...modules.map((mod) => new RegExp(escapeRegExp(path.normalize(mod)))),
    new RegExp(escapeRegExp(path.normalize(root))),
  ])
  const excludePatterns = DEFAULT_EXCLUDES.map(
    (pattern) => new RegExp(escapeRegExp(path.normalize(pattern))),
  )

  const reactNativeWebAliases = (() => {
    try {
      return {
        'react-native-web/dist/index': requireFromHere.resolve(
          'react-native-web/dist/index.js',
        ),
        'react-native-web/dist/exports/StyleSheet': requireFromHere.resolve(
          'react-native-web/dist/exports/StyleSheet.js',
        ),
        'react-native-web/dist/exports/Touchable': requireFromHere.resolve(
          'react-native-web/dist/exports/Touchable.js',
        ),
      }
    } catch (error) {
      return {}
    }
  })()

  return {
    plugins: [
      pluginBabel({
        include: includePatterns,
        exclude: excludePatterns,
        babelLoaderOptions: () => ({
          babelrc: false,
          configFile: false,
          presets: [
            [
              getRnPreset(),
              {
                useTransformReactJSXExperimental: true,
                ...babelPresetReactNativeOptions,
              },
            ],
            [
              requireFromHere.resolve('@babel/preset-react'),
              {
                runtime: 'automatic',
                ...babelPresetReactOptions,
              },
            ],
            ...babelPresets,
          ],
          plugins: [...babelPlugins],
        }),
      }),
    ],
    tools: {
      rspack: (config, { mergeConfig, rspack }) => {
        const merged = mergeConfig(config, {
          plugins: [
            new rspack.DefinePlugin({
              'process.env.NODE_ENV': JSON.stringify(
                process.env.NODE_ENV || 'development',
              ),
              __DEV__: process.env.NODE_ENV !== 'production',
            }),
            new rspack.DefinePlugin({
              process: { env: {} },
            }),
          ],
          module: {
            rules: [
              {
                test: /\.(js|jsx|ts|tsx|mjs)$/,
                loader: requireFromHere.resolve('babel-loader'),
                include(filename: string) {
                  if (!filename) {
                    return false
                  }

                  for (const possibleModule of modules) {
                    if (filename.includes(path.normalize(possibleModule))) {
                      return true
                    }
                  }

                  if (filename.includes(root)) {
                    for (const excluded of DEFAULT_EXCLUDES) {
                      if (filename.includes(path.normalize(excluded))) {
                        return false
                      }
                    }
                    return true
                  }
                  return false
                },
                options: {
                  root,
                  presets: [
                    [
                      getRnPreset(),
                      {
                        useTransformReactJSXExperimental: true,
                        ...babelPresetReactNativeOptions,
                      },
                    ],
                    [
                      requireFromHere.resolve('@babel/preset-react'),
                      {
                        runtime: 'automatic',
                        ...babelPresetReactOptions,
                      },
                    ],
                    ...babelPresets,
                  ],
                  plugins: [...babelPlugins],
                },
              },
            ],
          },
        })

        const extensions = dedupe([
          ...RN_EXTENSIONS,
          ...(merged.resolve?.extensions ?? []),
        ])

        merged.resolve = {
          ...merged.resolve,
          extensions,
          alias: {
            'react-native$': 'react-native-web',
            ...reactNativeWebAliases,
            ...(merged.resolve?.alias ?? {}),
            ...userAliases,
          },
        }

        return merged
      },
    },
  }
}
