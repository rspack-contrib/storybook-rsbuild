import { expect, test } from '@playwright/test'
import { sandboxes } from '../sandboxes'
import { expectDocsStorybookTitle, previewFrame } from '../utils/assertions'
import { launchSandbox } from '../utils/sandboxProcess'

const sandbox = sandboxes.find((entry) => entry.name === 'modernjs-react')

if (!sandbox) {
  throw new Error('Sandbox definition not found: modernjs-react')
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
    const frame = previewFrame(page)
    const docsRoot = frame.locator('#storybook-docs:not([hidden])')

    if ((await docsRoot.count()) > 0) {
      await expect(docsRoot).toBeVisible()
      const title = docsRoot.locator('h1')
      await expect(title).toBeVisible()
      await expect(title).toHaveText('AntdButton')
      return
    }

    throw new Error(
      'Could not locate the Storybook docs root for modernjs-react. The sandbox may have rendered the Canvas view or failed to load docs.',
    )
  })
})
