import { expect, test } from '@playwright/test'
import { sandboxes } from '../sandboxes'
import { previewFrame } from '../utils/assertions'
import { launchSandbox } from '../utils/sandboxProcess'

const sandbox = sandboxes.find((entry) => entry.name === 'react-native-web')

if (!sandbox) {
  throw new Error('Sandbox definition not found: react-native-web')
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

  test('should load the home page with Button docs', async ({ page }) => {
    const currentServer = server
    if (!currentServer) {
      throw new Error('Storybook server failed to start')
    }

    await page.goto(currentServer.url, { waitUntil: 'networkidle' })

    const frame = previewFrame(page)
    const docsRoot = frame.locator('#storybook-docs:not([hidden])')
    await expect(docsRoot).toBeVisible()

    // Check that Button component docs are rendered
    const title = docsRoot.locator('h1')
    await expect(title).toBeVisible()
    await expect(title).toHaveText('Button')
  })

  test('should render Button component with React Native Web primitives', async ({
    page,
  }) => {
    const currentServer = server
    if (!currentServer) {
      throw new Error('Storybook server failed to start')
    }

    // Navigate to Primary story
    await page.goto(
      `${currentServer.url}?path=/story/components-button--primary`,
      {
        waitUntil: 'networkidle',
      },
    )

    const frame = previewFrame(page)

    // The button text should be visible
    // TouchableOpacity renders as a div, and Text renders as a span
    const buttonText = frame.getByText('Primary Button')
    await expect(buttonText).toBeVisible()
  })

  test('should render Card component', async ({ page }) => {
    const currentServer = server
    if (!currentServer) {
      throw new Error('Storybook server failed to start')
    }

    // Navigate to Card Default story
    await page.goto(
      `${currentServer.url}?path=/story/components-card--default`,
      {
        waitUntil: 'networkidle',
      },
    )

    const frame = previewFrame(page)

    // Check card title is rendered
    const cardTitle = frame.getByText('Card Title')
    await expect(cardTitle).toBeVisible()

    // Check card content is rendered
    const cardContent = frame.getByText(
      'This is the card content. You can put any React Native components here.',
    )
    await expect(cardContent).toBeVisible()
  })

  test('should show props table with docgen', async ({ page }) => {
    const currentServer = server
    if (!currentServer) {
      throw new Error('Storybook server failed to start')
    }

    // Navigate to Button docs
    await page.goto(`${currentServer.url}?path=/docs/components-button--docs`, {
      waitUntil: 'networkidle',
    })

    const frame = previewFrame(page)
    const docsRoot = frame.locator('#storybook-docs:not([hidden])')
    await expect(docsRoot).toBeVisible()

    // Check that props table shows expected props from docgen
    const labelProp = docsRoot.getByText('The button label')
    await expect(labelProp).toBeVisible()

    const variantProp = docsRoot.getByText('Visual variant of the button')
    await expect(variantProp).toBeVisible()
  })
})
