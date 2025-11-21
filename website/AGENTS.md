# website/AGENTS.md

### Do
- Use **Rspress (v2)** for documentation.
- Use **React 19** for custom components and UI.
- Use ` ```ts twoslash ` for type-checked code blocks.
- Write standard Markdown or MDX in `docs/`.
- Use YAML frontmatter for metadata (title, sidebar position).

### Don't
- Do not use other documentation frameworks (e.g., Docusaurus, VitePress).
- Do not put content outside of `docs/` unless it's a custom page.

### Commands

```bash
# Start documentation dev server (scoped to website)
pnpm dev

# Build documentation
pnpm build

# Preview build
pnpm preview
```

### Project Structure

- **`docs/`**: Markdown/MDX content files.
- **`theme/`**: Custom theme components.
- **`rspress.config.ts`**: Site configuration.
- **`package.json`**: Dependencies (note `@rspress/*` plugins).

### Writing Documentation

1. **Content**: MDX files in `docs/`.
2. **Frontmatter**:
   ```yaml
   title: My Page
   sidebar_position: 1
   ```
3. **Code Blocks**:
   ````md
   ```ts twoslash
   const a = 1;
   ```
   ````
