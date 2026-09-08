import { Fragment } from 'react'

/**
 * Renders a peer dependency range as declared in the package manifests under
 * `packages/`. The ranges are read at config time in `rstack.config.ts` and
 * injected via Rsbuild `source.define`, so docs never drift from what is
 * published.
 *
 * A union such as `^1.5.0 || ^2.0.0-0` is rendered as one code span per
 * alternative, joined by ` / `: the `.md` / llms.txt output serializes code
 * spans verbatim, and a literal `|` inside a GFM table cell would split it.
 */
export const PeerRange = ({ name }: { name: keyof typeof __PEER_RANGES__ }) => {
  // `__PEER_RANGES__` is replaced by an object literal at build time, so keep
  // it out of expression-statement position.
  const alternatives = __PEER_RANGES__[name].split('||')
  return alternatives.map((alternative, index) => (
    <Fragment key={alternative}>
      {index > 0 && ' / '}
      <code>{alternative.trim()}</code>
    </Fragment>
  ))
}
