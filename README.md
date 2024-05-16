# Storybook × Rsbuild

The repository contains the Storybook Rsbuild builder and framework integrations for UI frameworks.

| package                                                 | description                                          |
| ------------------------------------------------------- | ---------------------------------------------------- |
| [storybook-builder-rsbuild](./packages/builder-rsbuild) | Rsbuild powered builder for Storybook                |
| [storybook-react-rsbuild](./packages/react-rsbuild)     | React integration for Storybook with Rsbuild builder |
| [storybook-vue3-rsbuild](./packages/vue3-rsbuild)       | Vue3 integration for Storybook with Rsbuild builder  |

## Usage

> [!NOTE]  
> Requirements: `@rsbuild/core >= 0.6.15`.

In Storybook v8, you don't need to manually install storybook-builder-rsbuild, it has been depended by the framework, such as `storybook-react-rsbuild` and `storybook-vue3-rsbuild`.

### Use with React

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
       // Customize the final webpack config here
       return config;
     },
   };

   export default config;
   ```

You're all set now. You could also checkout the example in [sandboxes/react-rsbuild](./sandboxes/react-rsbuild).

### Use with Vue3

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
       // Customize the final webpack config here
       return config;
     },
   };

   export default config;
   ```

You're all set now. You could also checkout the example in [sandboxes/vue3-rsbuild](./sandboxes/vue3-rsbuild).

### Customize the Rsbuild config

The builder _will_ read your `rsbuild.config.js` file, though it may change some of the options in order to work correctly.
It looks for the Rsbuild config in the CWD. If your config is located elsewhere, specify the path using the `rsbuildConfigPath` builder option:

```javascript
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

## Troubleshooting

### Error caused by bundling unwanted modules

Because Rspack temporarily does not support the `webpackInclude` magic comment, non-story files may be bundled, which could lead to build failures. These files can be ignored using `rspack.IgnorePlugin`.

```js
// .storybook/main.js
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
                  const absPathHasExt = extname(resource)
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

## Rspack support tasks

- [ ] Support persistent cache
- [ ] Support lazy compilation
- [ ] Support virtual modules
- [ ] Support `module.unknownContextCritical`
- [ ] Support `webpackInclude` magic comment
- [ ] Support `compilation.dependencyTemplates.set` for react-docgen-typescript

## Credits

Some codes are copied or modified from [storybookjs/storybook](https://github.com/storybookjs/storybook).

## License

[MIT](./LICENSE)
