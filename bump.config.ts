import { defineConfig } from 'bumpp'
import { version } from './packages/builder-rsbuild/package.json'

export default defineConfig({
  files: ['./packages/*/package.json'],
  commit: 'v%s',
  currentVersion: version,
  confirm: false,
  tag: false,
  push: false,
})
