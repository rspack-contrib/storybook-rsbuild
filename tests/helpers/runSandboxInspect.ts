import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { access } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { stripVTControlCharacters as stripAnsi } from 'node:util'

export interface SandboxInspectResult {
  sandboxName: string
  outputDir: string
  configs: Record<string, string>
  logs: string
}

const repoRoot = fileURLToPath(new URL('../..', import.meta.url))
const inspectCache = new Map<string, Promise<SandboxInspectResult>>()

export function runSandboxInspect(
  sandboxName: string,
): Promise<SandboxInspectResult> {
  if (!inspectCache.has(sandboxName)) {
    inspectCache.set(sandboxName, inspectSandboxOnce(sandboxName))
  }

  return inspectCache.get(sandboxName)!
}

async function inspectSandboxOnce(
  sandboxName: string,
): Promise<SandboxInspectResult> {
  const filter = `@sandboxes/${sandboxName}`
  const child = spawn('pnpm', ['--filter', filter, 'run', 'build:storybook'], {
    cwd: repoRoot,
    env: {
      ...process.env,
      DEBUG: 'rsbuild',
      CI: 'true',
      FORCE_COLOR: '0',
    },
    shell: process.platform === 'win32',
    stdio: ['ignore', 'pipe', 'pipe'],
  })

  let stdout = ''
  let stderr = ''

  child.stdout?.setEncoding('utf8')
  child.stdout?.on('data', (chunk: string) => {
    stdout += chunk
  })

  child.stderr?.setEncoding('utf8')
  child.stderr?.on('data', (chunk: string) => {
    stderr += chunk
  })

  const [code] = (await once(child, 'close')) as [number | null, NodeJS.Signals]

  const logs = `${stdout}${stderr}`
  const sanitizedLogs = stripAnsi(logs)

  if (code !== 0) {
    throw new Error(
      `storybook build failed for sandbox "${sandboxName}" (exit ${code}).\n${logs}`,
    )
  }

  const parsed = parseInspectOutput(sanitizedLogs)
  if (!parsed.outputDir) {
    throw new Error(
      `Failed to detect output directory for sandbox "${sandboxName}". Logs:\n${logs}`,
    )
  }

  if (Object.keys(parsed.configs).length === 0) {
    throw new Error(
      `No inspected config files found for sandbox "${sandboxName}". Logs:\n${logs}`,
    )
  }

  for (const filePath of Object.values(parsed.configs)) {
    await access(filePath)
  }

  return {
    sandboxName,
    outputDir: parsed.outputDir,
    configs: parsed.configs,
    logs,
  }
}

function parseInspectOutput(output: string) {
  const configs: Record<string, string> = {}
  const configRegex =
    / -\ (Rsbuild config|Rspack Config(?: \([^)]+\))?):\s+(.+)$/gm
  let match: RegExpExecArray | null
  match = configRegex.exec(output)
  while (match) {
    const [, label, filePath] = match
    configs[label.trim()] = filePath.trim()
    match = configRegex.exec(output)
  }

  const outputDirMatch = /Output directory:\s*(.+)$/m.exec(output)

  return {
    configs,
    outputDir: outputDirMatch?.[1].trim(),
  }
}
