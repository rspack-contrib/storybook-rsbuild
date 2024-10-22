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
