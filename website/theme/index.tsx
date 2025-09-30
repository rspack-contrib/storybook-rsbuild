import { useLang } from '@rspress/core/runtime'
import {
  Layout as BaseLayout,
  getCustomMDXComponent as BaseGetCustomMDXComponent,
} from '@rspress/core/theme'
import { NavIcon } from '@rstack-dev/doc-ui/nav-icon'
import {
  Search as PluginAlgoliaSearch,
  ZH_LOCALES,
} from '@rspress/plugin-algolia/runtime'

export * from '@rspress/core/theme'

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
