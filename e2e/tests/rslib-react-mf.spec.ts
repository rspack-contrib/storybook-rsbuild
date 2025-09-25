import { type SpawnOptionsWithoutStdio, spawn } from 'node:child_process'
import { once } from 'node:events'
import path from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'
import { expect, test } from '@playwright/test'
import { sandboxes } from '../sandboxes'
import { expectDocsStorybookTitle, previewFrame } from '../utils/assertions'
import { launchSandbox } from '../utils/sandboxProcess'

const sandbox = sandboxes.find((entry) => entry.name === 'rslib-react-mf')!

if (!sandbox) {
  throw new Error('Sandbox definition not found: rslib-react-mf')
}

const DEV_SCRIPT_ARGS = ['run', 'dev'] as const
const DEV_SERVER_READY_TIMEOUT_MS = 120_000
const DEV_SERVER_SHUTDOWN_TIMEOUT_MS = 10_000
const DEV_SERVER_READY_INDICATOR = 'built in'

interface DevServerHandle {
  stop: () => Promise<void>
}

test.describe(sandbox.name, () => {
  let server: Awaited<ReturnType<typeof launchSandbox>> | null = null
  let devServer: DevServerHandle | null = null

  test.beforeAll(async () => {
    devServer = await startMfDevServer()
    try {
      server = await launchSandbox(sandbox)
    } catch (error) {
      await devServer.stop()
      devServer = null
      throw error
    }
  })

  test.afterAll(async () => {
    if (server) {
      await server.stop()
      server = null
    }
    if (devServer) {
      await devServer.stop()
      devServer = null
    }
  })

  test('should load the home page', async ({ page }) => {
    const currentServer = server
    if (!currentServer) {
      throw new Error('Storybook server failed to start')
    }

    await page.goto(currentServer.url, { waitUntil: 'networkidle' })
    const frame = previewFrame(page)
    const docsRoot = frame.locator('#storybook-docs:not([hidden])')

    if ((await docsRoot.count()) > 0) {
      await expect(docsRoot).toBeVisible()
      const title = docsRoot.locator('h1')
      await expect(title).toBeVisible()
      await expect(title).toHaveText('CounterButton')
      return
    }
  })
})

async function startMfDevServer(): Promise<DevServerHandle> {
  const resolvedDir = path.resolve(sandbox.relativeDir)
  const spawnOptions: SpawnOptionsWithoutStdio = {
    cwd: resolvedDir,
    env: {
      ...process.env,
      CI: 'true',
    },
    stdio: ['pipe'],
    shell: process.platform === 'win32',
  }

  const child = spawn('pnpm', [...DEV_SCRIPT_ARGS], spawnOptions)

  const prefix = `[${sandbox.name}:dev]`
  let resolveReady: (() => void) | null = null
  let readySignalled = false
  let stdoutBuffer = ''

  child.stdout?.setEncoding('utf-8')
  child.stderr?.setEncoding('utf-8')

  const readyPromise = new Promise<void>((resolve, reject) => {
    let settled = false
    let timeoutId: NodeJS.Timeout | null = null

    const finish = (callback: () => void) => {
      if (settled) {
        return
      }
      settled = true
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      child.off('exit', onExit)
      child.off('error', onError)
      callback()
    }

    function onExit(code: number | null, signal: NodeJS.Signals | null) {
      finish(() => {
        const details = [
          code !== null ? `exit code ${code}` : null,
          signal ? `signal ${signal}` : null,
        ]
          .filter(Boolean)
          .join(', ')
        const suffix = details ? ` (${details})` : ''
        reject(new Error(`MF dev server exited before it was ready${suffix}`))
      })
    }

    function onError(error: Error) {
      finish(() => reject(error))
    }

    timeoutId = setTimeout(() => {
      finish(() =>
        reject(
          new Error(
            `Timed out waiting for MF dev server to print "${DEV_SERVER_READY_INDICATOR}"`,
          ),
        ),
      )
    }, DEV_SERVER_READY_TIMEOUT_MS)

    child.on('exit', onExit)
    child.on('error', onError)

    resolveReady = () => finish(resolve)
  })

  child.stdout?.on('data', (chunk) => {
    process.stdout.write(`${prefix} ${chunk}`)
    if (readySignalled) {
      return
    }
    stdoutBuffer += chunk.toLowerCase()
    if (stdoutBuffer.includes(DEV_SERVER_READY_INDICATOR)) {
      readySignalled = true
      resolveReady?.()
      resolveReady = null
    } else if (stdoutBuffer.length > 10_000) {
      stdoutBuffer = stdoutBuffer.slice(-5_000)
    }
  })

  child.stderr?.on('data', (chunk) => {
    process.stderr.write(`${prefix} ${chunk}`)
  })

  try {
    await readyPromise
  } catch (error) {
    if (child.exitCode === null) {
      const exitPromise = once(child, 'exit')
      child.kill('SIGTERM')
      const result = await Promise.race([
        exitPromise.then(() => 'exit' as const),
        delay(DEV_SERVER_SHUTDOWN_TIMEOUT_MS).then(() => 'timeout' as const),
      ])
      if (result === 'timeout') {
        child.kill('SIGKILL')
        await once(child, 'exit')
      }
    }
    throw error
  }

  return {
    stop: async () => {
      if (child.exitCode !== null) {
        return
      }
      const exitPromise = once(child, 'exit')
      child.kill('SIGTERM')
      const result = await Promise.race([
        exitPromise.then(() => 'exit' as const),
        delay(DEV_SERVER_SHUTDOWN_TIMEOUT_MS).then(() => 'timeout' as const),
      ])
      if (result === 'timeout') {
        child.kill('SIGKILL')
        await once(child, 'exit')
      }
    },
  }
}
