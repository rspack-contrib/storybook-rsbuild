/**
 * Renders a peer dependency range as declared in the package manifests under
 * `packages/`. The ranges are read at config time in `rstack.config.ts` and
 * injected via Rsbuild `source.define`, so docs never drift from what is
 * published.
 */
export const PeerRange = ({ name }: { name: keyof typeof __PEER_RANGES__ }) => (
  <code>{__PEER_RANGES__[name]}</code>
)
