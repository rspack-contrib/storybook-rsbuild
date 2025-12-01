import type { Preview } from '@storybook/react'
import { sb } from 'storybook/test'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

// Provide a simple module mock to validate the new mocking pipeline.
// This swaps src/stories/utils/greeting.ts with its __mocks__ implementation.
sb.mock('../src/stories/utils/greeting.ts')

export default preview
