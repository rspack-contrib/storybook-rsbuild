import * as path from 'node:path'
import { defineConfig } from '@rspress/core'
import { pluginAlgolia } from '@rspress/plugin-algolia'
import { pluginLlms } from '@rspress/plugin-llms'
import { pluginSitemap } from '@rspress/plugin-sitemap'
import { pluginTwoslash } from '@rspress/plugin-twoslash'
import { pluginFontOpenSans } from 'rspress-plugin-font-open-sans'

const siteUrl = 'https://storybook.rsbuild.rs'

export default defineConfig({
  plugins: [
    pluginAlgolia({
      verificationContent: '8D19FD11BAF8DB11',
    }),
    pluginFontOpenSans(),
    pluginLlms(),
    pluginTwoslash(),
    pluginSitemap({
      siteUrl,
    }),
  ],
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
