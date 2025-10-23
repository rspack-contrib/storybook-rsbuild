import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it, vi } from 'vitest'
import type { RsbuildBuilderOptions } from '../../src/preview/iframe-rsbuild.config'
import createIframeRsbuildConfig from '../../src/preview/iframe-rsbuild.config'

const fixtureDir = fileURLToPath(new URL('../fixtures/', import.meta.url))
const fixtureRsbuildConfig = resolve(fixtureDir, 'rsbuild.config.ts')

const storybookEntries = ['storybook-entry.js']
const storiesConfig = [
  {
    directory: './stories',
    files: '*.stories.tsx',
    titlePrefix: '',
  },
]

const createOptions = () => {
  const presetValues = new Map<string, unknown>([
    [
      'core',
      {
        builder: {
          name: 'storybook-builder-rsbuild',
          options: {
            rsbuildConfigPath: fixtureRsbuildConfig,
            addonDocs: {},
            fsCache: false,
            lazyCompilation: false,
          },
        },
      },
    ],
    ['framework', {}],
    ['frameworkOptions', { renderer: '@storybook/react' }],
    ['env', { STORYBOOK_ENV: 'development' }],
    ['logLevel', 'info'],
    ['previewHead', '<!-- head -->'],
    ['previewBody', '<!-- body -->'],
    [
      'previewMainTemplate',
      '<!DOCTYPE html><html><head></head><body><div id="root"></div></body></html>',
    ],
    ['docs', {}],
    ['entries', storybookEntries],
    ['stories', storiesConfig],
    ['tags', {}],
    ['build', { test: {} }],
    ['previewAnnotations', []],
  ])

  const apply = vi.fn(
    async (name: string, defaultValue?: unknown): Promise<unknown> => {
      if (name === 'mdxLoaderOptions') {
        return defaultValue
      }

      if (presetValues.has(name)) {
        return presetValues.get(name)
      }

      return defaultValue
    },
  )

  const cache = {
    get: vi.fn((_key: string, fallback: number) => fallback),
  } as unknown as Required<RsbuildBuilderOptions>['cache']

  const options: Partial<RsbuildBuilderOptions> = {
    configType: 'DEVELOPMENT',
    quiet: true,
    outputDir: 'storybook-static',
    packageJson: { version: '8.0.0-test' },
    presets: {
      apply:
        apply as unknown as Required<RsbuildBuilderOptions>['presets']['apply'],
    },
    previewUrl: 'http://localhost:6006/iframe.html',
    typescriptOptions: {
      check: false,
      skipCompiler: true,
    },
    features: {},
    cache,
    configDir: fixtureDir,
    build: {},
  }

  return { options, apply }
}

describe('iframe-rsbuild.config', () => {
  it('overrides rsbuild source.entry with Storybook entry', async () => {
    const { options } = createOptions()

    const config = await createIframeRsbuildConfig(
      options as RsbuildBuilderOptions,
    )

    const expectedDynamicEntry = resolve(
      process.cwd(),
      'storybook-config-entry.js',
    )

    expect(config.source?.entry).toEqual({
      main: [storybookEntries[0], expectedDynamicEntry],
    })
  })
})
