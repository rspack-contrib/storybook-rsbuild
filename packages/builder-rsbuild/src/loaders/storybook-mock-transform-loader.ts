import { rewriteSbMockImportCalls } from 'storybook/internal/mocking-utils'
import { logger } from 'storybook/internal/node-logger'

import type { Rspack } from '@rsbuild/core'

const storybookMockTransformLoader = function (
  this: Rspack.LoaderContext<any>,
  source: string,
  sourceMap: any,
  meta: any,
) {
  const callback = this.async()

  try {
    const result = rewriteSbMockImportCalls(source)
    callback(null, result.code, result.map || undefined, meta)
  } catch (error) {
    logger.debug(
      `Could not transform sb.mock(import(...)) calls in ${this.resourcePath}: ${error}`,
    )
    callback(null, source, sourceMap, meta)
  }
}

export default storybookMockTransformLoader
