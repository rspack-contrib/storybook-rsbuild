import type { Rspack } from '@rsbuild/core'
import { babelParser, getAutomockCode } from 'storybook/internal/mocking-utils'

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
