![Storybook Rsbuild](https://github.com/rspack-contrib/storybook-rsbuild/assets/7237365/00165054-9e3e-4a15-8a99-27985989b9d2)

# Storybook × Rsbuild

<p>
 <a href="https://www.npmjs.com/package/storybook-builder-rsbuild"><img src="https://img.shields.io/npm/v/storybook-builder-rsbuild?style=flat-square&color=ff4785" alt="latest version" /></a>
 <a href="https://npmcharts.com/compare/storybook-builder-rsbuild,storybook-react-rsbuild,storybook-react-vue,storybook-vue3-rsbuild,storybook-vue3-rsbuild?interval=7&log=false"><img src="https://img.shields.io/npm/dm/storybook-builder-rsbuild?style=flat-square&color=%23ff4785" alt="NPM downloads per month" /></a>
 <a href="https://github.com/rspack-contrib/storybook-rsbuild/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/storybook-builder-rsbuild?style=flat-square&color=%23ff4785" alt="license" /></a>
 <a href="https://github.com/rspack-contrib/storybook-rsbuild"><img src="https://img.shields.io/badge/main%20%28Storybook%208%29-ff4785" alt="main branch" /></a>
 <a href="https://github.com/rspack-contrib/storybook-rsbuild/tree/v2"><img src="https://img.shields.io/badge/v2%20%28Storybook%209%29-ff4785" alt="main branch" /></a>
</p>

The repository contains the Storybook Rsbuild builder and UI framework integrations.

> [!NOTE]
> For users of Storybook v9, Storybook Rsbuild already provides basic alpha version support. Check out the [v2](https://github.com/rspack-contrib/storybook-rsbuild/tree/v2) branch (using version `2.0-alpha.x`), and refer to the [Storybook v9 migration documentation](https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#from-version-8x-to-900).

## Usage

Check out the [documentation](https://storybook.rsbuild.dev).

## Roadmap

### Features

- [x] Support TS type check (fork-ts-checker-webpack-plugin) _(supported in [0.0.4](https://github.com/rspack-contrib/storybook-rsbuild/releases/tag/v0.0.4))_
- [ ] Support more frameworks (Preact / Svelte / vanilla html / Lit)

### Rspack support

- [x] Support `webpackInclude` magic comment _(supported in [0.0.7](https://github.com/rspack-contrib/storybook-rsbuild/releases/tag/v0.0.7))_
- [x] Support persistent cache
- [x] Support lazy compilation
- [ ] Support native virtual modules
- [ ] Support `module.unknownContextCritical`
- [x] Support `compilation.dependencyTemplates.set` for react-docgen-typescript (supported in a workaround)

## Credits

Some code is copied or modified from [storybookjs/storybook](https://github.com/storybookjs/storybook).

## License

[MIT](./LICENSE)
