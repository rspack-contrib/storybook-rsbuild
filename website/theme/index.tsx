import './index.css'
import { useLang } from '@rspress/core/runtime'
import {
  getCustomMDXComponent as BaseGetCustomMDXComponent,
  Layout as BaseLayout,
  Callout,
} from '@rspress/core/theme'
import {
  Search as PluginAlgoliaSearch,
  ZH_LOCALES,
} from '@rspress/plugin-algolia/runtime'
import { NavIcon } from '@rstack-dev/doc-ui/nav-icon'

export * from '@rspress/core/theme'

import {
  LlmsContainer,
  LlmsCopyButton,
  LlmsViewOptions,
} from '@rspress/plugin-llms/runtime'

export const Layout = () => {
  return (
    <BaseLayout
      beforeNavTitle={<NavIcon />}
      afterHero={
        <div
          style={{
            maxWidth: '1152px',
            margin: '0 auto',
            padding: '0 24px',
            marginTop: '-2rem',
          }}
        >
          <Callout type="tip" title="✨ Storybook 10 Support Available">
            <p style={{ marginBottom: '16px' }}>
              We've released a beta version compatible with Storybook 10. Try it
              out by installing with the <code>beta</code> tag, and check out
              the{' '}
              <a
                href="https://deploy-preview-388--storybook-rsbuild.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: 'var(--rp-c-brand)',
                }}
              >
                v3 documentation
              </a>
              :
            </p>
            <div
              style={{
                background: 'var(--rp-c-bg-soft)',
                border: '1px solid var(--rp-c-divider)',
                borderRadius: '8px',
                padding: '16px',
                fontSize: '14px',
                lineHeight: '1.7',
                fontFamily: 'var(--rp-font-family-mono)',
                color: 'var(--rp-c-text-1)',
                overflowX: 'auto',
              }}
            >
              <div style={{ whiteSpace: 'pre' }}>
                <span style={{ color: 'var(--rp-c-brand)' }}>pnpm add</span>{' '}
                storybook-builder-rsbuild@beta storybook-react-rsbuild@beta
              </div>
              <div
                style={{
                  whiteSpace: 'pre',
                  marginTop: '8px',
                  color: 'var(--rp-c-text-3)',
                  fontStyle: 'italic',
                }}
              >
                # or for other frameworks:
              </div>
              <div style={{ whiteSpace: 'pre', marginTop: '4px' }}>
                <span style={{ color: 'var(--rp-c-brand)' }}>pnpm add</span>{' '}
                storybook-builder-rsbuild@beta storybook-vue3-rsbuild@beta
              </div>
            </div>
          </Callout>
        </div>
      }
    />
  )
}

export function getCustomMDXComponent() {
  const { h1: H1, ...mdxComponents } = BaseGetCustomMDXComponent()

  const MyH1 = ({ ...props }) => {
    return (
      <>
        <H1 {...props} />
        <LlmsContainer>
          <LlmsCopyButton />
          <LlmsViewOptions />
        </LlmsContainer>
      </>
    )
  }
  return {
    ...mdxComponents,
    h1: MyH1,
  }
}

export const Search = () => {
  const lang = useLang()
  return (
    <PluginAlgoliaSearch
      docSearchProps={{
        appId: '9P1TZPCO0M', // cspell:disable-line
        apiKey: '0c634b2461f6d52185f373adf28888b5', // cspell:disable-line
        indexName: 'storybook-rsbuild',
        searchParameters: {
          facetFilters: [`lang:${lang}`],
        },
      }}
      locales={ZH_LOCALES}
    />
  )
}
