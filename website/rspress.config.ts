import * as path from 'node:path'
import { defineConfig } from 'rspress/config'

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  title: 'Storybook Rsbuild',
  description: 'Storybook builder and frameworks powered by Rsbuild.',
  icon: '/storybook-rsbuild.svg',
  logo: {
    light: '/storybook-rsbuild-dark-text.svg',
    dark: '/storybook-rsbuild-light-text.svg',
  },
  themeConfig: {
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/rspack-contrib/storybook-rsbuild',
      },
    ],
  },
})
