// Code taken from https://github.com/storybookjs/storybook/blob/next/code/vitest-setup.ts.
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import '@testing-library/jest-dom/vitest'

import { createSnapshotSerializer } from 'path-serializer'
import { expect } from 'vitest'

const workspaceRoot = dirname(fileURLToPath(new URL('./', import.meta.url)))

expect.addSnapshotSerializer(
  createSnapshotSerializer({
    root: workspaceRoot,
    workspace: workspaceRoot,
  }),
)
