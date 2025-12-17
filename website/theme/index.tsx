import './index.css'
import { useLang } from '@rspress/core/runtime'
import {
  getCustomMDXComponent as BaseGetCustomMDXComponent,
  Layout as BaseLayout,
} from '@rspress/core/theme-original'
import {
  Search as PluginAlgoliaSearch,
  ZH_LOCALES,
} from '@rspress/plugin-algolia/runtime'
import { NavIcon } from '@rstack-dev/doc-ui/nav-icon'

export * from '@rspress/core/theme-original'

import {
  LlmsContainer,
  LlmsCopyButton,
  LlmsViewOptions,
} from '@rspress/plugin-llms/runtime'

export const Layout = () => {
  return <BaseLayout beforeNavTitle={<NavIcon />} />
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
