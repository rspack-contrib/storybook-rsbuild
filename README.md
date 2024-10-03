![Storybook Rsbuild](https://github.com/rspack-contrib/storybook-rsbuild/assets/7237365/00165054-9e3e-4a15-8a99-27985989b9d2)

# Storybook × Rsbuild

<p>
 <a href="https://www.npmjs.com/package/storybook-builder-rsbuild"><img src="https://img.shields.io/npm/v/storybook-builder-rsbuild?style=flat-square&color=ff4785" alt="latest version" /></a>
 <a href="https://npmcharts.com/compare/storybook-builder-rsbuild,storybook-react-rsbuild,storybook-react-vue,storybook-vue-rsbuild,storybook-vue3-rsbuild?interval=7&log=false"><img src="https://img.shields.io/npm/dm/storybook-builder-rsbuild?style=flat-square&color=%23ff4785" alt="NPM downloads per month" /></a>
 <a href="https://github.com/rspack-contrib/storybook-rsbuild/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/storybook-builder-rsbuild?style=flat-square&color=%23ff4785" alt="license" /></a>
</p>

The repository contains the Storybook Rsbuild builder and UI framework integrations.

| package                                                 | description                                                  |
| ------------------------------------------------------- | ------------------------------------------------------------ |
| [storybook-builder-rsbuild](./packages/builder-rsbuild) | Rsbuild powered builder for Storybook                        |
| [storybook-react-rsbuild](./packages/framework-react)   | React integration for Storybook with Rsbuild builder         |
| [storybook-vue3-rsbuild](./packages/framework-vue3)     | Vue 3 integration for Storybook with Rsbuild builder         |
| [storybook-html-rsbuild](./packages/framework-html)     | Vanilla JS/TS integration for Storybook with Rsbuild builder |

## Usage

> [!IMPORTANT]  
> Peer dependencies requirements:
>
> - **`@rsbuild/core >= 1.0.1`**: The builder relies on Rsbuild's 1.0 stable version. Check out Rsbuild's [1.0](https://rsbuild.dev/community/releases/v1-0) announcement for more details.
> - **`storybook >= 8.2.1`**: Storybook made some internal refactor in major version, 8.2.1 is tested out. (check out Storybook's [release note](https://storybook.js.org/blog/storybook-8/) for migrating from v7)

In Storybook v8, you don't need to manually install storybook-builder-rsbuild, it has been depended by the framework, such as `storybook-react-rsbuild` and `storybook-vue3-rsbuild`.

### Use with React (in a existing Rsbuild project)

1. Install React framework integration
   ```bash
   pnpm i storybook-react-rsbuild -D
   ```
2. Change `.storybook/main.js`

   ```js
   import { StorybookConfig } from 'storybook-react-rsbuild'

   const config: StorybookConfig = {
     framework: 'storybook-react-rsbuild',
     rsbuildFinal: (config) => {
       // Customize the final Rsbuild config here
       return config
     },
   }

   export default config
   ```

You're all set now. You could also check out the example in [sandboxes/react-18](./sandboxes/react-18) and use all other features listed in [Storybook site](https://storybook.js.org/docs).

### Use with Vue 3 (in a existing Rsbuild project)

1. Install Vue3 framework integration
   ```bash
   pnpm i storybook-vue3-rsbuild -D
   ```
2. Change `.storybook/main.js`

   ```js
   import { StorybookConfig } from 'storybook-vue3-rsbuild'

   const config: StorybookConfig = {
     framework: 'storybook-vue3-rsbuild',
     rsbuildFinal: (config) => {
       // Customize the final Rsbuild config here
       return config
     },
   }

   export default config
   ```

You're all set now. You could also check out the example in [sandboxes/vue3-rsbuild](./sandboxes/vue3-rsbuild) and use all other features listed in [Storybook site](https://storybook.js.org/docs).

### Use with vanilla JavaScript / TypeScript (in a existing Rsbuild project)

1. Install vanilla JavaScript / TypeScript integration
   ```bash
   pnpm i storybook-html-rsbuild -D
   ```
2. Change `.storybook/main.js`

   ```js
   import { StorybookConfig } from 'storybook-html-rsbuild'

   const config: StorybookConfig = {
     framework: 'storybook-html-rsbuild',
     rsbuildFinal: (config) => {
       // Customize the final Rsbuild config here
       return config
     },
   }

   export default config
   ```

You're all set now. You could also check out the example in [sandboxes/vanilla-ts](./sandboxes/vanilla) and use all other features listed in [Storybook site](https://storybook.js.org/docs).

### Builder options

#### `rsbuildConfigPath`

- Type: `string`
- Default: `undefined`

The builder will automatically load Rsbuild config file (e.g. `rsbuild.config.js`) in the project, though it may change some of the options in order to work correctly.
It looks for the Rsbuild config in the CWD. If your config is located elsewhere, specify the path using the `rsbuildConfigPath` builder option:

```js
// .storybook/main.mjs

const config = {
  framework: {
    name: 'storybook-react-rsbuild',
    options: {
      builder: {
        rsbuildConfigPath: '.storybook/customRsbuildConfig.js',
      },
    },
  },
}

export default config
```

#### `lazyCompilation`

- Type: `boolean`
- Default: `false`

Enables Rspack's experimental [lazy compilation](https://www.rspack.dev/config/experiments#experimentslazycompilation).

```js
// .storybook/main.mjs

const config = {
  framework: {
    name: 'storybook-react-rsbuild',
    options: {
      builder: {
        lazyCompilation: true,
      },
    },
  },
}

export default config
```

#### `environment`

- Type: `string`
- Default: `undefined`

Rsbuild supports build with [environment](https://rsbuild.dev/config/environments) config. When there's not listed environment or only one environment, the builder will the default environment's config. If there're more than one environment, you must specify the environment with `environment` option to tell the builder which environment's config to use.

```js
// .storybook/main.mjs

const config = {
  framework: {
    name: 'storybook-react-rsbuild',
    options: {
      builder: {
        environment: 'web-storybook',
      },
    },
  },
}

export default config
```

#### `addonDocs`

- Type: `object`
- Default: `undefined`

`@storybook/addon-docs` webpack options. The builder uses `@storybook/addon-docs` internally, and accepts the passing [some options](https://github.com/storybookjs/storybook/tree/next/code/addons/docs#preset-options) via `addonDocs`.

```js
// .storybook/main.mjs
import remarkGfm from 'remark-gfm'

const config = {
  framework: {
    name: 'storybook-react-rsbuild',
    options: {
      builder: {
        addonDocs: {
          mdxPluginOptions: {
            mdxCompileOptions: {
              remarkPlugins: [remarkGfm],
            },
          },
        },
      },
    },
  },
}

export default config
```

### Customize builder's Rsbuild config

You can also override the merged Rsbuild config:

```javascript
// use `mergeRsbuildConfig` to recursively merge Rsbuild options
import { mergeRsbuildConfig } from '@rsbuild/core'

const config = {
  async rsbuildFinal(config, { configType }) {
    // Be sure to return the customized config
    return mergeRsbuildConfig(config, {
      // Customize the Rsbuild config for Storybook
      source: {
        alias: { foo: 'bar' },
      },
    })
  },
}

export default config
```

The `rsbuildFinal` function will give you `config` which is the combination of your project's Rsbuild config and the builder's own Rsbuild config.
You can tweak this as you want, for example to set up aliases, add new plugins etc.

The `configType` variable will be either `"DEVELOPMENT"` or `"PRODUCTION"`.

The function should return the updated Rsbuild configuration.

### Using customized addon

Since Rspack is compatible with Webpack 5, storybook-builder-rsbuild can also use Webpack 5 addons. The configuration for ⁠`webpackAddons` is identical to that of Storybook's [addons](https://storybook.js.org/docs/api/main-config/main-config-addons). However, Storybook's addons only support the Vite builder and Webpack 5 builder by default. If you want to use Webpack 5 addons in storybook-builder-rsbuild, please add them to ⁠webpackAddons. For example, using the [`@storybook/addon-coverage`](https://github.com/storybookjs/addon-coverage) addon:

```js
const config: StorybookConfig = {
  // --snip--
  webpackAddons: [
    {
      name: '@storybook/addon-coverage',
      options: {
        istanbul: {
          include: ['src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
          exclude: [],
        },
      },
    },
  ],
  // --snip--
}
```

## FAQ

### How to Storybook to a subdirectory / subpath?

The default Vite and webpack builders in Storybook use relative paths for references, whereas Rsbuild does not recommend using relative paths for deployment (See the [tips](https://rsbuild.dev/config/output/asset-prefix#path-types:~:text=on%20file%20location.-,TIP,-It%27s%20not%20recommended)). Therefore, if you want to deploy Storybook on a sub-path such as `https://example.com/sb-path`, you can achieve this by configuring [`output.assetPrefix`](https://rsbuild.dev/config/output/asset-prefix).

```diff
const config: StorybookConfig = {
  // --snip--
  rsbuildFinal: (config) => {
+   config.output ??= {}
+   config.output.assetPrefix = '/sb-path/'
    return config
  },
  // --snip--
}
```

### Error caused by bundling unexpected files

> [!NOTE]
> Rspack starts to support `webpackInclude` magic comment, this trouble won't exists since 0.0.7

Because Rspack temporarily does not support the `webpackInclude` magic comment, non-story files may be bundled, which could lead to build failures. These files can be ignored using `rspack.IgnorePlugin` (see exmaple https://github.com/rspack-contrib/storybook-rsbuild/issues/19).

```js
// .storybook/main.js
import path from 'path'
import { mergeRsbuildConfig } from '@rsbuild/core'

export default {
  framework: 'storybook-react-rsbuild',
  async rsbuildFinal(config) {
    return mergeRsbuildConfig(config, {
      tools: {
        rspack: (config, { addRules, appendPlugins, rspack, mergeConfig }) => {
          return mergeConfig(config, {
            plugins: [
              new rspack.IgnorePlugin({
                checkResource: (resource, context) => {
                  // for example, ignore all markdown files
                  const absPathHasExt = path.extname(resource)
                  if (absPathHasExt === '.md') {
                    return true
                  }

                  return false
                },
              }),
            ],
          })
        },
      },
    })
  },
}
```

### Why using `getAbsolutePath` to resolve the framework in sandboxes in this repository?

https://storybook.js.org/docs/faq#how-do-i-fix-module-resolution-in-special-environments

## Roadmap

### Features

- [x] Support TS type check (fork-ts-checker-webpack-plugin) _(supported in [0.0.4](https://github.com/rspack-contrib/storybook-rsbuild/releases/tag/v0.0.4))_
- [ ] Support more frameworks (Preact / Svelte / vanilla html / Lit)

### Rspack support

- [x] Support `webpackInclude` magic comment _(supported in [0.0.7](https://github.com/rspack-contrib/storybook-rsbuild/releases/tag/v0.0.7))_
- [ ] Support persistent cache
- [x] Support lazy compilation
- [ ] Support virtual modules
- [ ] Support `module.unknownContextCritical`
- [x] Support `compilation.dependencyTemplates.set` for react-docgen-typescript (supported in a workaround)

## Credits

Some code is copied or modified from [storybookjs/storybook](https://github.com/storybookjs/storybook).

## License

[MIT](./LICENSE)
