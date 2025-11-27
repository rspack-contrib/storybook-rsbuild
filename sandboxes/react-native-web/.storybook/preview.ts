import 'react-native-reanimated'
import './global.css'

const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    docs: {
      source: { excludeDecorators: true },
    },
  },
  tags: ['autodocs'],
}

export default preview
