/**
 * Code taken from https://github.com/storybookjs/storybook/tree/next/code/frameworks/react-vite/src/plugins
 */

import path from 'node:path'
import { createFilter } from '@rollup/pluginutils'
import type { RsbuildPlugin } from '@rsbuild/core'
import findUp from 'find-up'
import MagicString from 'magic-string'
import type { Documentation } from 'react-docgen'
import {
  ERROR_CODES,
  builtinHandlers as docgenHandlers,
  builtinResolvers as docgenResolver,
  makeFsImporter,
  parse,
} from 'react-docgen'
import { logger } from 'storybook/internal/node-logger'
import * as TsconfigPaths from 'tsconfig-paths'
import actualNameHandler from './docgen-handlers/actualNameHandler'
import {
  RESOLVE_EXTENSIONS,
  ReactDocgenResolveError,
  defaultLookupModule,
} from './docgen-resolver'

type DocObj = Documentation & { actualName: string; definedInFile: string }

// TODO: None of these are able to be overridden, so `default` is aspirational here.
const defaultHandlers = Object.values(docgenHandlers).map((handler) => handler)
const defaultResolver = new docgenResolver.FindExportedDefinitionsResolver()
const handlers = [...defaultHandlers, actualNameHandler]

type Options = {
  include?: string | RegExp | (string | RegExp)[]
  exclude?: string | RegExp | (string | RegExp)[]
}

export async function reactDocgen({
  include = /\.(mjs|tsx?|jsx?)$/,
  exclude = [/node_modules\/.*/],
}: Options = {}): Promise<RsbuildPlugin> {
  const cwd = process.cwd()
  const filter = createFilter(include, exclude)

  const tsconfigPath = await findUp('tsconfig.json', { cwd })
  const tsconfig = TsconfigPaths.loadConfig(tsconfigPath)

  let matchPath: TsconfigPaths.MatchPath | undefined

  if (tsconfig.resultType === 'success') {
    logger.info('Using tsconfig paths for react-docgen')
    matchPath = TsconfigPaths.createMatchPath(
      tsconfig.absoluteBaseUrl,
      tsconfig.paths,
      ['browser', 'module', 'main'],
    )
  }

  return {
    name: 'storybook:react-docgen-plugin',
    // enforce: 'pre',
    setup(api) {
      api.transform(
        {
          test: (id) => {
            if (!filter(path.relative(cwd, id))) {
              return false
            }

            return true
          },
        },
        async ({ code: src, resource: id }) => {
          // return ''
          //  transform(src: string, id: string) {
          //   if (!filter(path.relative(cwd, id))) {
          //     return
          //   }
          try {
            const docgenResults = parse(src, {
              resolver: defaultResolver,
              handlers,
              importer: getReactDocgenImporter(matchPath),
              filename: id,
            }) as DocObj[]
            const s = new MagicString(src)
            // biome-ignore lint/complexity/noForEach: <explanation>
            docgenResults.forEach((info) => {
              const { actualName, definedInFile, ...docgenInfo } = info
              // biome-ignore lint/suspicious/noDoubleEquals: <explanation>
              if (actualName && definedInFile == id) {
                const docNode = JSON.stringify(docgenInfo)
                s.append(`;${actualName}.__docgenInfo=${docNode}`)
              }
            })

            return {
              code: s.toString(),
              map: s.generateMap({ hires: true, source: id }).toString(),
            }
          } catch (e: any) {
            // Ignore the error when react-docgen cannot find a react component
            if (e.code === ERROR_CODES.MISSING_DEFINITION) {
              return src
            }
            throw e
          }
          // }
        },
      )
    },
  }
}

export function getReactDocgenImporter(
  matchPath: TsconfigPaths.MatchPath | undefined,
) {
  return makeFsImporter((filename, basedir) => {
    const mappedFilenameByPaths = (() => {
      if (matchPath) {
        const match = matchPath(filename)
        return match || filename
        // biome-ignore lint/style/noUselessElse: <explanation>
      } else {
        return filename
      }
    })()

    const result = defaultLookupModule(mappedFilenameByPaths, basedir)

    if (RESOLVE_EXTENSIONS.find((ext) => result.endsWith(ext))) {
      return result
    }

    throw new ReactDocgenResolveError(filename)
  })
}
