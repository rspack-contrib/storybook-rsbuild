import { babelParser, getAutomockCode } from 'storybook/internal/mocking-utils'

import type { Rspack } from '@rsbuild/core'

interface AutomockLoaderOptions {
  spy?: string
}

export default function rsbuildAutomockLoader(
  this: Rspack.LoaderContext<AutomockLoaderOptions>,
  source: string,
) {
  const options = this.getOptions()
  const isSpy = options.spy === 'true'

  const mocked = getAutomockCode(source, isSpy, babelParser as any)

  return mocked.toString()
}
