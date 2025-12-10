import { logger as rsbuildLogger } from '@rsbuild/core'
import picocolors from 'picocolors'
import { logger } from 'storybook/internal/node-logger'

export function overrideRsbuildLogger() {
  const logWithPrefix =
    (fn: (msg: string) => void) =>
    (msg: unknown): void =>
      fn(
        `${picocolors.black(picocolors.bgBlueBright('Rsbuild'))} ${String(msg)}`,
      )

  rsbuildLogger.override({
    error: logWithPrefix(logger.error),
    warn: logWithPrefix(logger.warn),
    info: logWithPrefix((msg) => logger.log(msg, { spacing: 0 })),
    start: logWithPrefix(logger.info),
    ready: logWithPrefix(logger.info),
    success: logWithPrefix(logger.info),
    log: logWithPrefix(logger.info),
    debug: logWithPrefix(logger.debug),
  })
}
