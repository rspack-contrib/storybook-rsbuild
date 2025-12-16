import type { Preview } from '@storybook/react'

// Import Tailwind CSS for Nativewind support
import '../src/global.css'

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

export default preview
