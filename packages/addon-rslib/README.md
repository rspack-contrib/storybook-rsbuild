# storybook-addon-rslib

## Usage

1. Install the addon

```bash
pnpm add storybook-addon-rslib -D
```

2. Add it to `main.js`

```ts
export default {
  addons: ['storybook-addon-rslib'],
}
```

or with config

```ts
export default {
  addons: [
    {
      name: 'storybook-addon-rslib',
      options: {
        // Check options section.
      },
    },
  ],
}
```

## Options

```ts
export interface AddonOptions {
  rslib?: {
    /**
     * `cwd` passed to loadConfig of Rslib
     * @default undefined
     */
    cwd?: string
    /**
     *  `path` passed to loadConfig of Rslib
     * @default undefined
     */
    configPath?: string
    /**
     * The lib config index in `lib` field to use, will be merged with the other fields in the config.
     * Set to a number to use the lib config at that index.
     * Set to `false` to disable using the lib config.
     * @experimental subject to change at any time
     * @default 0
     */
    libIndex?: number | false
  }
}
```
