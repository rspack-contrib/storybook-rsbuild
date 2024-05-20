# Preparation

```bash
corepack enable # if it's not enabled
pnpm i
```

## Development

```bash
pnpm dev # will watch and rebuild all packages in ./packages
```

Then development with the packages in `./sandboxes`.

## Release

For repository maintainers:

1. bump version locally with changeset (`changeset add` and `changeset version`) and generate a bump commit.
2. create a PR to merge the commit into main branch.
3. trigger [rspack-contrib/storybook-rsbuild/actions/workflows/release.yaml](https://github.com/rspack-contrib/storybook-rsbuild/actions/workflows/release.yaml) manually, NPM publish, git tag push and GitHub Release will be created then.
