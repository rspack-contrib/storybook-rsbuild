import { expect, test } from '@playwright/test'
import { sandboxes } from '../sandboxes'
import { expectDocsStorybookTitle, previewFrame } from '../utils/assertions'
import { launchSandbox } from '../utils/sandboxProcess'

const sandbox = sandboxes.find((entry) => entry.name === 'react-18')

if (!sandbox) {
  throw new Error('Sandbox definition not found: react-18')
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

  test('should render mocked greeting story', async ({ page }) => {
    const currentServer = server
    if (!currentServer) {
      throw new Error('Storybook server failed to start')
    }

    await page.goto(currentServer.url, { waitUntil: 'networkidle' })
    const storyCategory = 'mock-mockedgreeting'
    const sidebarCategory = page.locator(`[data-item-id="${storyCategory}"]`)
    await expect(sidebarCategory).toBeVisible()
    await sidebarCategory.click()

    const storyId = 'mock-mockedgreeting--uses-mocked-module'
    const sidebarItem = page.locator(`[data-item-id="${storyId}"]`)
    await expect(sidebarItem).toBeVisible()
    await sidebarItem.click()

    const frame = previewFrame(page)
    const greeting = frame.getByTestId('greeting-text')
    await expect(greeting).toBeVisible()
    await expect(greeting).toHaveText('Mocked greeting for Storybook')
  })
})
