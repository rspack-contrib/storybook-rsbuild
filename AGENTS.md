# Repository Guidelines

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

## Commit & Pull Request Guidelines

Ship changes with reviewer-friendly context:

- Follow Conventional Commits (`feat:`, `fix(builder-rsbuild):`, `chore(deps):`) and keep subjects under 72 characters.
- Summarize user-facing impact in PR descriptions, link issues, and attach screenshots or terminal logs for sandbox-visible updates.
- Run `pnpm lint`, `pnpm build`, and `pnpm build:sandboxes` before requesting review; flag any manual QA needs for downstream packages.
