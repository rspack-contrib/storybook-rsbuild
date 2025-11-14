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
        expect(mdxLoaderValue).toMatch(/remarkPlugins: \[\n.*remarkGfm/)
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

  const start = findOpeningBrace(configText, markerIndex)
  const end = findClosingBrace(configText, start)
  return configText.slice(start, end + 1).trim()
}

function findOpeningBrace(text: string, fromIndex: number): number {
  for (let i = fromIndex; i >= 0; i -= 1) {
    if (text[i] === '{') {
      return i
    }
  }
  throw new Error('Unable to locate opening brace for MDX rule')
}

function findClosingBrace(text: string, startIndex: number): number {
  let depth = 0
  let inSingle = false
  let inDouble = false
  let inTemplate = false

  for (let i = startIndex; i < text.length; i += 1) {
    const char = text[i]
    const prevChar = text[i - 1]

    if (inSingle) {
      if (char === "'" && prevChar !== '\\') {
        inSingle = false
      }
      continue
    }

    if (inDouble) {
      if (char === '"' && prevChar !== '\\') {
        inDouble = false
      }
      continue
    }

    if (inTemplate) {
      if (char === '`' && prevChar !== '\\') {
        inTemplate = false
      }
      continue
    }

    if (char === "'") {
      inSingle = true
      continue
    }

    if (char === '"') {
      inDouble = true
      continue
    }

    if (char === '`') {
      inTemplate = true
      continue
    }

    if (char === '{') {
      depth += 1
      continue
    }

    if (char === '}') {
      depth -= 1
      if (depth === 0) {
        return i
      }
    }
  }

  throw new Error('Unable to locate closing brace for MDX rule')
}
