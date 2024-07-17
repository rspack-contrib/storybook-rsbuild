/**
 * This file is copied from https://github.com/storybookjs/storybook/blob/next
 * to follow the build process of Storybook to ease migration.
 */

import path, { dirname, join, relative } from 'node:path'
import aliasPlugin from 'esbuild-plugin-alias'
import * as fs from 'fs-extra'
import slash from 'slash'
import dedent from 'ts-dedent'
import type { Options } from 'tsup'
import { build } from 'tsup'
import type { PackageJson } from 'type-fest'
import { exec } from '../utils/exec'

/* TYPES */

type Formats = 'esm' | 'cjs'
type BundlerConfig = {
  entries: string[]
  externals: string[]
  noExternal: string[]
  platform: Options['platform']
  pre: string
  post: string
  formats: Formats[]
}
type PackageJsonWithBundlerConfig = PackageJson & {
  bundler: BundlerConfig
}
type DtsConfigSection = Pick<Options, 'dts' | 'tsconfig'>

/* MAIN */

const run = async ({ cwd, flags }: { cwd: string; flags: string[] }) => {
  const {
    name,
    dependencies,
    peerDependencies,
    bundler: {
      entries = [],
      externals: extraExternals = [],
      noExternal: extraNoExternal = [],
      platform,
      pre,
      post,
      formats = ['esm', 'cjs'],
    },
  } = (await fs.readJson(
    join(cwd, 'package.json'),
  )) as PackageJsonWithBundlerConfig

  if (pre) {
    await exec(
      `node -r ${__dirname}/../node_modules/esbuild-register/register.js ${pre}`,
      { cwd },
    )
  }

  const reset = hasFlag(flags, 'reset')
  const watch = hasFlag(flags, 'watch')
  const optimized = hasFlag(flags, 'optimized')

  if (reset) {
    await fs.emptyDir(join(process.cwd(), 'dist'))
  }

  const tasks: Promise<any>[] = []

  const outDir = join(process.cwd(), 'dist')
  const externals = [
    name!,
    ...extraExternals,
    ...Object.keys(dependencies || {}),
    ...Object.keys(peerDependencies || {}),
  ]

  const allEntries = entries.map((e: string) => slash(join(cwd, e)))

  const { dtsBuild, dtsConfig, tsConfigExists } = await getDTSConfigs({
    formats,
    entries,
    optimized,
  })

  /* preset files are always CJS only.
   * Generating an ESM file for them anyway is problematic because they often have a reference to `require`.
   * TSUP generated code will then have a `require` polyfill/guard in the ESM files, which causes issues for webpack.
   */
  const nonPresetEntries = allEntries.filter(
    (f) => !path.parse(f).name.includes('preset'),
  )

  const noExternal = [/^@vitest\/.+$/, ...extraNoExternal]

  if (formats.includes('esm')) {
    tasks.push(
      build({
        noExternal,
        silent: true,
        treeshake: true,
        entry: nonPresetEntries,
        shims: false,
        watch,
        outDir,
        sourcemap: false,
        format: ['esm'],
        target: ['chrome100', 'safari15', 'firefox91'],
        clean: false,
        ...(dtsBuild === 'esm' ? dtsConfig : {}),
        platform: platform || 'browser',
        esbuildPlugins: [
          aliasPlugin({
            process: path.resolve('../node_modules/process/browser.js'),
            util: path.resolve('../node_modules/util/util.js'),
          }),
        ],
        external: externals,

        esbuildOptions: (c) => {
          /* eslint-disable no-param-reassign */
          c.conditions = ['module']
          c.platform = platform || 'browser'
          Object.assign(c, getESBuildOptions(optimized))
          /* eslint-enable no-param-reassign */
        },
      }),
    )
  }

  if (formats.includes('cjs')) {
    tasks.push(
      build({
        noExternal,
        silent: true,
        entry: allEntries,
        watch,
        outDir,
        sourcemap: false,
        format: ['cjs'],
        target: 'node18',
        ...(dtsBuild === 'cjs' ? dtsConfig : {}),
        platform: 'node',
        clean: false,
        external: externals,

        esbuildOptions: (c) => {
          /* eslint-disable no-param-reassign */
          c.platform = 'node'
          Object.assign(c, getESBuildOptions(optimized))
          /* eslint-enable no-param-reassign */
        },
      }),
    )
  }

  if (tsConfigExists && !optimized) {
    tasks.push(...entries.map(generateDTSMapperFile))
  }

  await Promise.all(tasks)

  if (post) {
    await exec(
      `node -r ${__dirname}/../node_modules/esbuild-register/register.js ${post}`,
      { cwd },
      { debug: true },
    )
  }

  if (process.env.CI !== 'true') {
    console.log('done')
  }
}

/* UTILS */

async function getDTSConfigs({
  formats,
  entries,
  optimized,
}: {
  formats: Formats[]
  entries: string[]
  optimized: boolean
}) {
  const tsConfigPath = join(cwd, 'tsconfig.json')
  const tsConfigExists = await fs.pathExists(tsConfigPath)

  const dtsBuild =
    optimized && formats[0] && tsConfigExists ? formats[0] : undefined

  const dtsConfig: DtsConfigSection = {
    tsconfig: tsConfigPath,
    dts: {
      entry: entries,
      resolve: true,
    },
  }

  return { dtsBuild, dtsConfig, tsConfigExists }
}

function getESBuildOptions(optimized: boolean) {
  return {
    logLevel: 'error',
    legalComments: 'none',
    // just keep readable code
    // minifyWhitespace: optimized,
    // minifyIdentifiers: false,
    // minifySyntax: optimized,
  }
}

async function generateDTSMapperFile(file: string) {
  const { name: entryName, dir } = path.parse(file)

  const pathName = join(
    process.cwd(),
    dir.replace('./src', 'dist'),
    `${entryName}.d.ts`,
  )
  const srcName = join(process.cwd(), file)
  const rel = relative(dirname(pathName), dirname(srcName))
    .split(path.sep)
    .join(path.posix.sep)

  await fs.ensureFile(pathName)
  await fs.writeFile(
    pathName,
    dedent`
      // dev-mode
      export * from '${rel}/${entryName}';
    `,
    { encoding: 'utf-8' },
  )
}

const hasFlag = (flags: string[], name: string) =>
  !!flags.find((s) => s.startsWith(`--${name}`))

/* SELF EXECUTION */

const flags = process.argv.slice(2)
const cwd = process.cwd()

run({ cwd, flags }).catch((err: unknown) => {
  // We can't let the stack try to print, it crashes in a way that sets the exit code to 0.
  // Seems to have something to do with running JSON.parse() on binary / base64 encoded sourcemaps
  // in @cspotcode/source-map-support
  if (err instanceof Error) {
    console.error(err.stack)
  }
  process.exit(1)
})
