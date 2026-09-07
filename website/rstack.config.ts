import { pluginAlgolia } from '@rspress/plugin-algolia'
import { pluginSitemap } from '@rspress/plugin-sitemap'
import { pluginTwoslash } from '@rspress/plugin-twoslash'
import {
  transformerNotationDiff,
  transformerNotationFocus,
  transformerNotationHighlight,
} from '@shikijs/transformers'
import { readFileSync } from 'node:fs'
import { pluginOpenGraph } from 'rsbuild-plugin-open-graph'
import { pluginFontOpenSans } from 'rspress-plugin-font-open-sans'
import { define } from 'rstack'

const siteUrl = 'https://storybook.rsbuild.rs'
const siteDescription = 'Storybook builder and frameworks powered by Rsbuild.'
const siteDescriptionZh = '由 Rsbuild 驱动的 Storybook builder 与 frameworks。'
const heroImage = `${siteUrl}/storybook-rsbuild.svg`

const peerRange = (pkg: string, name: string): string => {
  const manifest = JSON.parse(
    readFileSync(
      new URL(`../packages/${pkg}/package.json`, import.meta.url),
      'utf8',
    ),
  ) as { peerDependencies?: Record<string, string> }
  const range = manifest.peerDependencies?.[name]
  if (!range)
    throw new Error(`"${name}" is not a peerDependency of packages/${pkg}`)
  return range
}

// `<PeerRange name="<dep>" />` in docs expands to the peer range declared in
// `packages/*/package.json`, so docs never drift from the published manifests.
// `framework-react` stands in for every framework package: `pnpm
// check-dependency-version` keeps their peer ranges identical. An unknown name
// is left untouched and fails the MDX compile as an undefined component.
const peerRanges: Record<string, string> = {
  storybook: peerRange('framework-react', 'storybook'),
  '@rsbuild/core': peerRange('framework-react', '@rsbuild/core'),
  'react-native-web': peerRange(
    'framework-react-native-web',
    'react-native-web',
  ),
}
// `replaceRules` runs on the raw source before MDX compiles, for the HTML,
// `.md` and llms.txt outputs alike. GFM table cells must escape `|`
// (`^1.5.0 || ^2.0.0-0`), even inside code spans, while outside tables the
// backslash would be literal, so table rows get their own rule first.
const peerRangeRules = Object.entries(peerRanges).flatMap(([name, range]) => {
  const marker = `<PeerRange name="${name}" />`
  return [
    {
      search: new RegExp(`^(\\|.*)${marker}`, 'gm'),
      replace: `$1\`${range.replace(/\|/g, '\\|')}\``,
    },
    { search: new RegExp(marker, 'g'), replace: `\`${range}\`` },
  ]
})

define.doc({
  plugins: [
    pluginAlgolia({
      verificationContent: '8D19FD11BAF8DB11',
    }),
    pluginFontOpenSans(),
    pluginTwoslash(),
    pluginSitemap({
      siteUrl,
    }),
  ],
  root: 'docs',
  replaceRules: peerRangeRules,
  lang: 'en',
  title: 'Storybook Rsbuild',
  description: siteDescription,
  icon: '/storybook-rsbuild.svg',
  logo: {
    light: '/storybook-rsbuild-dark-text.svg',
    dark: '/storybook-rsbuild-light-text.svg',
  },
  llms: true,
  search: {
    codeBlocks: true,
  },
  markdown: {
    link: {
      checkDeadLinks: true,
    },
    shiki: {
      langs: ['ts', 'tsx', 'json'],
      langAlias: {
        shell: 'bash',
      },
      transformers: [
        transformerNotationDiff(),
        transformerNotationHighlight(),
        transformerNotationFocus(),
      ],
    },
  },
  route: {
    cleanUrls: true,
  },
  themeConfig: {
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/rstackjs/storybook-rsbuild',
      },
    ],
    editLink: {
      docRepoBaseUrl:
        'https://github.com/rstackjs/storybook-rsbuild/tree/main/website/docs',
    },
    locales: [
      {
        lang: 'en',
        label: 'English',
        description: siteDescription,
      },
      {
        lang: 'zh',
        label: '简体中文',
        description: siteDescriptionZh,
      },
    ],
  },
  builderConfig: {
    plugins: [
      pluginOpenGraph({
        title: 'Storybook Rsbuild',
        url: siteUrl,
        description: siteDescription,
        image: heroImage,
        twitter: {
          card: 'summary_large_image',
        },
      }),
    ],
  },
})
