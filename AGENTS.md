# Repository Guidelines

## Repository Setup

Get a local environment running:

1. Install Node.js 20 so it matches `.nvmrc`; `nvm use` handles this if you rely on nvm.
2. Enable Corepack if you don’t have it already: `corepack enable` to use pnpm 10 as package manager.
3. Install dependencies with `pnpm install`, all packages will be built automatically after installation.

## Project Structure & Module Organization

This monorepo ships features near their consumers:

- `packages/builder-rsbuild`: Rsbuild-specific Storybook builder, similar to @storybook/builder-webpack5 but for Rsbuild, that other packages reuse.
- `packages/addon-rslib` / `packages/addon-modernjs`: adapter add-ons aligning Storybook with Rsbuild or Modern.js defaults.
- Renderer packages (`framework-html`, `framework-react`, `framework-vue3`, `framework-web-components`): expose renderer presets, preview hooks, and loader utilities; keep runtime logic in `src/`.
- `sandboxes/`: runnable Storybook apps that act as the primary regression suite, updating configs and stories when validating new behavior.
- Shared tooling appears in `scripts/`, docs in `website/`, and root configs such as `tsconfig.json`, `vitest-setup.ts`, and `pnpm-workspace.yaml`.

## Build, Test, and Development Commands

After `pnpm install`, rely on these root scripts:

- `pnpm dev`: runs each package’s `prep --watch` script for live rebuilds.
- `pnpm build`: builds every package except sandboxes; run before pushing.
- `pnpm build:sandboxes`: compiles each sandbox Storybook—treat a passing build as the integration gate.
- `pnpm check`: triggers per-package type and contract checks.
- `pnpm lint`: applies Biome formatting and lint rules.
- `pnpm test` / `pnpm test:watch`: execute Vitest suites.
- `pnpm check-dependency-version`: verifies dependency consistency after upgrades.
- `pnpm --filter <package> run <script>`: scope any command to a single workspace (for example `pnpm --filter framework-react run build`).

## Coding Style & Naming Conventions

Consistent style keeps cross-package reviews quick:

- Biome enforces two-space indentation, single quotes, and minimal semicolons—run `pnpm lint` to autofix.
- Use kebab-case for directories, files, and package names; exported symbols should mirror filenames (e.g., `create-rsbuild-plugin.ts`).
- Prefer explicit `.ts`/`.tsx` extensions, typed public APIs, and colocated sandbox helpers that mirror their owning package.
- Imports are auto-organized by Biome; avoid manual sorting unless absolutely necessary.

## Testing & Sandbox Workflow

Unit tests still matter, but sandboxes drive acceptance:

- Write Vitest coverage beside sources using `.test.ts(x)` or within `__tests__/`; use `@testing-library/jest-dom` for DOM assertions.
- Update the relevant sandbox (`main.ts`, `preview.ts`, stories) to demonstrate new features, then confirm with `pnpm build:sandboxes`.
- Commit regenerated snapshots under `__snapshots__/` only when behavior intentionally changes.

### Playwright sandbox debugging

- Use `pnpm e2e <sandbox>.spec.ts` to launch Storybook for that sandbox and reproduce the Playwright run locally.
- Attach with the Playwright MCP client while the run is active so you can browse the served Storybook instance and inspect the relevant DOM.
- Keep in mind that Storybook renders its preview inside an iframe—narrow your lookup to the preview frame before collecting selectors, then port those selectors back into the spec.

## Commit & Pull Request Guidelines

Ship changes with reviewer-friendly context:

- Follow Conventional Commits (`feat:`, `fix(builder-rsbuild):`, `chore(deps):`) and keep subjects under 72 characters.
- Summarize user-facing impact in PR descriptions, link issues, and attach screenshots or terminal logs for sandbox-visible updates.
- Run `pnpm lint`, `pnpm build`, and `pnpm build:sandboxes` before requesting review; flag any manual QA needs for downstream packages.
