import { CDVC } from 'check-dependency-version-consistency'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

// @ts-ignore
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

let mismatch = false

// === dependencies ===
const cdvcDep = new CDVC(__dirname, {
  depType: ['dependencies'],
  ignorePackage: ['@sandboxes/react-16'],
  ignoreDep: ['find-up'],
})

const dep = cdvcDep.hasMismatchingDependencies
if (dep) {
  mismatch = true
  console.log(cdvcDep.toMismatchSummary())
}

// === devDependencies ===
const cdvcDev = new CDVC(__dirname, {
  depType: ['devDependencies'],
  ignorePackage: ['@sandboxes/react-16'],
  ignoreDep: ['@module-federation/storybook-addon', "@modern-js/app-tools"],
})

const dev = cdvcDev.hasMismatchingDependencies
if (dev) {
  mismatch = true
  console.log(cdvcDev.toMismatchSummary())
}

// === peerDependencies ===
const cdvcPeer = new CDVC(__dirname, {
  depType: ['peerDependencies'],
  ignorePackage: ['storybook-builder-rsbuild'],
})

// === optionalDependencies & resolutions ===
const cdvcOptRes = new CDVC(__dirname, {
  depType: ['optionalDependencies', 'resolutions'],
})

const optRes = cdvcOptRes.hasMismatchingDependencies
if (optRes) {
  mismatch = true
  console.log(cdvcOptRes.toMismatchSummary())
}

const peer = cdvcPeer.hasMismatchingDependencies
if (peer) {
  mismatch = true
  console.log(cdvcPeer.toMismatchSummary())
}

if (mismatch) {
  console.error('Dependency version mismatches found.')
  process.exit(1)
} else {
  console.log('No dependency version mismatches found.')
}
