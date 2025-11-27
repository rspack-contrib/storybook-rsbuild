import { readFile } from 'node:fs/promises'
import { describe, expect, it } from 'vitest'
import { runSandboxInspect } from './helpers/runSandboxInspect'

interface SnapshotTarget {
  id: string
  labelMatcher: (label: string) => boolean
  extract: (content: string) => string
}

interface SandboxSnapshotCase {
  sandbox: string
  targets: SnapshotTarget[]
}

const SANDBOX_CASES: SandboxSnapshotCase[] = [
  {
    sandbox: 'react-16',
    targets: [
      {
        id: 'mdx-loader',
        labelMatcher: (label) =>
          label.toLowerCase().startsWith('rspack config'),
        extract: extractMdxLoaderRule,
      },
    ],
  },
]

describe.each(SANDBOX_CASES)(
  '$sandbox config snapshots',
  ({ sandbox, targets }) => {
    const inspectResultPromise = runSandboxInspect(sandbox)

    for (const target of targets) {
      it(`matches ${target.id}`, async () => {
        const inspectResult = await inspectResultPromise
        const matchedEntry = Object.entries(inspectResult.configs).find(
          ([label]) => target.labelMatcher(label),
        )

        if (!matchedEntry) {
          throw new Error(
            `No inspected config matched "${target.id}" for sandbox "${sandbox}"`,
          )
        }

        const [, filePath] = matchedEntry
        const content = await readFile(filePath, 'utf8')
        const mdxLoaderValue = target.extract(content)

        // Check that remarkPlugins is configured with remarkGfm
        const lines = mdxLoaderValue.split('\n')
        const remarkPluginsLineIndex = lines.findIndex((line) =>
          line.includes('remarkPlugins'),
        )
        expect(remarkPluginsLineIndex).toBeGreaterThanOrEqual(0)
        expect(lines[remarkPluginsLineIndex + 1]).toContain('remarkGfm')
      })
    }
  },
)

function extractMdxLoaderRule(configText: string): string {
  const literal = 'test: /\\.mdx$/'
  const markerIndex = configText.indexOf(literal)
  if (markerIndex === -1) {
    throw new Error('Unable to locate mdx loader rule in config output')
  }

  // Extract a small window around the marker - just need a few hundred chars for the options
  const windowStart = Math.max(0, markerIndex - 200)
  const windowEnd = Math.min(configText.length, markerIndex + 800)
  return configText.slice(windowStart, windowEnd)
}
