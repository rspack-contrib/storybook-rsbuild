/** @type {import('prebundle').Config} */
const config = {
  prettier: true,
  externals: {
    'storybook/internal/common': 'storybook/internal/common',
    'storybook/internal/node-logger': 'storybook/internal/node-logger',
  },
  dependencies: [
    {
      name: '@storybook/core-webpack',
      target: 'es2020',
    },
  ],
}

export default config
