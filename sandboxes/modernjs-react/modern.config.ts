import path from 'node:path'
import {
  type AppTools,
  appTools,
  type CliPluginFuture,
  defineConfig,
} from '@modern-js/app-tools'

// https://modernjs.dev/en/configure/app/usage
export default defineConfig({
  runtime: {
    router: true,
  },
  source: {
    alias: {
      '@my-src': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    appTools({
      bundler: 'rspack', // Set to 'webpack' to enable webpack
    }),
    {
      name: 'modern-js-rsbuild-plugin',
      setup(api) {
        api.modifyRsbuildConfig((_config) => {
          console.log('run builder hook')
        })
      },
    } as CliPluginFuture<AppTools<'shared'>>,
    {
      name: 'modern-js-plugin',
      setup(api) {
        api.config(() => {
          return {
            output: {
              disableTsChecker: true, // 关闭 TypeScript 类型检查
            },
          }
        })
      },
    } as CliPluginFuture<AppTools<'shared'>>,
  ],
})
