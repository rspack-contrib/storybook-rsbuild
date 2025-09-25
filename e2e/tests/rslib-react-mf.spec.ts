import path from 'node:path'
import { expect, test } from '@playwright/test'
import { sandboxes } from '../sandboxes'
import { previewFrame } from '../utils/assertions'
import { type DevServerHandle, launchDevServer } from '../utils/devServer'
import { launchSandbox } from '../utils/sandboxProcess'

const sandbox = sandboxes.find((entry) => entry.name === 'rslib-react-mf')!

if (!sandbox) {
  throw new Error('Sandbox definition not found: rslib-react-mf')
}

const DEV_SERVER_READY_INDICATOR = 'built in'

test.describe(sandbox.name, () => {
  let server: Awaited<ReturnType<typeof launchSandbox>> | null = null
  let devServer: DevServerHandle | null = null

  test.beforeAll(async () => {
    devServer = await launchDevServer({
      cwd: path.resolve(sandbox.relativeDir),
      command: { executable: 'pnpm', args: ['run', 'dev'] },
      readyIndicator: DEV_SERVER_READY_INDICATOR,
      logPrefix: `[${sandbox.name}:dev]`,
    })
    try {
      server = await launchSandbox(sandbox)
    } catch (error) {
      await devServer.stop()
      devServer = null
      throw error
    }
  })

  test.afterAll(async () => {
    if (server) {
      await server.stop()
      server = null
    }
    if (devServer) {
      await devServer.stop()
      devServer = null
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
      await expect(title).toHaveText('CounterButton')
      return
    }

    throw new Error(
      'Could not locate the Storybook docs root for rslib-react-mf. The sandbox may have rendered the Canvas view or failed to load docs.',
    )
  })
})
