import { resolve } from 'node:path'
import { expect, it } from 'vitest'

const previewStatsJsonPath = resolve(
  __dirname,
  '../storybook-static/preview-stats.json',
)

it('Entry for Chromatic should be correct', async () => {
  const content = await import(previewStatsJsonPath)
  const lazyModule = content.modules.filter((module: any) => {
    const reasons = module.reasons || []
    const moduleNames: string[] = reasons.map(
      (reason: any) => reason.moduleName,
    )
    const isLazy = module?.id?.includes('lazy recursive')
    if (isLazy) {
      return moduleNames.find((name) =>
        name.includes('./storybook-config-entry.js + 1 modules'),
      )
    }

    return false
  })

  expect(lazyModule.length).toBe(2)
})
