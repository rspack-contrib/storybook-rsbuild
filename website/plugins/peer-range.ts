import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Minimal structural slice of Rsbuild's plugin API: `website` does not depend
// on `@rsbuild/core` directly, so its types are not resolvable here.
type TransformContext = {
  code: string
  addDependency: (file: string) => void
}
type RsbuildPluginApi = {
  transform: (
    descriptor: { test: RegExp; order: 'pre' | 'post' },
    handler: (context: TransformContext) => string,
  ) => void
}
type RsbuildPlugin = {
  name: string
  setup: (api: RsbuildPluginApi) => void
}

const PACKAGES_DIR = fileURLToPath(new URL('../../packages', import.meta.url))
const DEFAULT_PKG = 'builder-rsbuild'

// `<PeerRange name="storybook" />` or `<PeerRange pkg="framework-vue3" name="vue" />`
const PEER_RANGE_RE = /<PeerRange((?:\s+(?:name|pkg)="[^"]*")+)\s*\/>/g
const ATTR_RE = /(name|pkg)="([^"]*)"/g

const manifestPath = (pkg: string) =>
  path.join(PACKAGES_DIR, pkg, 'package.json')

const readPeerRange = (pkg: string, name: string): string => {
  const manifest = JSON.parse(readFileSync(manifestPath(pkg), 'utf8')) as {
    peerDependencies?: Record<string, string>
  }
  const range = manifest.peerDependencies?.[name]
  if (!range) {
    throw new Error(
      `<PeerRange />: "${name}" is not a peerDependency of packages/${pkg}`,
    )
  }
  return range
}

/**
 * Expands `<PeerRange name="<dep>" [pkg="<packages dir>"] />` in `.mdx` sources
 * into inline code holding the peer dependency range declared by that
 * package's `package.json` (`packages/builder-rsbuild` by default), so the docs
 * never drift from the published manifests.
 *
 * This is a source-level text substitution rather than a React component
 * because Rspress renders the llms.txt / `.md` outputs through a separate
 * pipeline that keeps JSX nested in tables and lists as literal text.
 */
export const pluginPeerRange = (): RsbuildPlugin => ({
  name: 'storybook-rsbuild:peer-range',
  setup(api) {
    api.transform({ test: /\.mdx$/, order: 'pre' }, ({ code, addDependency }) =>
      code.replace(
        PEER_RANGE_RE,
        (_match: string, attrs: string, offset: number) => {
          let pkg = DEFAULT_PKG
          let name: string | undefined
          for (const [, key, value] of attrs.matchAll(ATTR_RE)) {
            if (key === 'pkg') pkg = value
            else name = value
          }
          if (!name) {
            throw new Error('<PeerRange />: the "name" attribute is required')
          }
          addDependency(manifestPath(pkg))
          const range = readPeerRange(pkg, name)
          // GFM table cells must escape `|` (e.g. `^1.5.0 || ^2.0.0-0`), even
          // inside code spans; outside tables the backslash would be literal.
          const inTable = code[code.lastIndexOf('\n', offset) + 1] === '|'
          return `\`${inTable ? range.replace(/\|/g, '\\|') : range}\``
        },
      ),
    )
  },
})
