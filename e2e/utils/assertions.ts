import { expect, type FrameLocator, type Page } from '@playwright/test'

const previewFrameSelector = 'iframe[title="storybook-preview-iframe"]'

export function previewFrame(page: Page): FrameLocator {
  return page.frameLocator(previewFrameSelector)
}

export async function expectDocsStorybookTitle(page: Page): Promise<void> {
  const frame = previewFrame(page)
  const docsRoot = frame.locator('#storybook-docs:not([hidden])')

  if ((await docsRoot.count()) > 0) {
    await expect(docsRoot).toBeVisible()
    const title = docsRoot.locator('#configure-your-project')
    await expect(title).toBeVisible()
    await expect(title).toHaveText('Configure your project')
    return
  }

  throw new Error('Could not locate the Storybook doc root')
}
