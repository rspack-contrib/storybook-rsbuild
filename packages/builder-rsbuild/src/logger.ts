import { logger as rsbuildLogger } from '@rsbuild/core'
import picocolors from 'picocolors'
import { logger } from 'storybook/internal/node-logger'

export function overrideRsbuildLogger() {
  const logWithPrefix =
    (fn: (msg: string) => void) =>
    (msg: unknown): void =>
      fn(`${picocolors.bgCyanBright(' Rsbuild ')} ${String(msg)}`)

  rsbuildLogger.override({
    error: logWithPrefix(logger.error),
    warn: logWithPrefix(logger.warn),
    info: logWithPrefix(logger.info),
    success: logWithPrefix(logger.info),
    debug: logWithPrefix(logger.info),
    log: logWithPrefix(logger.info),
    ready: logWithPrefix(logger.info),
    start: logWithPrefix(logger.info),
  })
}
