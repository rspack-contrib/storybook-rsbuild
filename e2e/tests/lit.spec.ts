import { expect, test } from '@playwright/test'
import { sandboxes } from '../sandboxes'
import { expectDocsStorybookTitle, previewFrame } from '../utils/assertions'
import { launchSandbox } from '../utils/sandboxProcess'

const sandbox = sandboxes.find((entry) => entry.name === 'lit')

if (!sandbox) {
  throw new Error('Sandbox definition not found: lit')
}

test.describe(sandbox.name, () => {
  let server: Awaited<ReturnType<typeof launchSandbox>> | null = null

  test.beforeAll(async () => {
    server = await launchSandbox(sandbox)
  })

  test.afterAll(async () => {
    if (server) {
      await server.stop()
      server = null
    }
  })

  test('should load the home page', async ({ page }) => {
    const currentServer = server
    if (!currentServer) {
      throw new Error('Storybook server failed to start')
    }

    await page.goto(currentServer.url, { waitUntil: 'networkidle' })
    await expectDocsStorybookTitle(page)
  })
})
