// @ts-ignore
import addonModernjsConfig from '../../packages/addon-modernjs/build-config'
// @ts-ignore
import addonRslibConfig from '../../packages/addon-rslib/build-config'
// @ts-ignore
import builderConfig from '../../packages/builder-rsbuild/build-config'
// @ts-ignore
import htmlFrameworkConfig from '../../packages/framework-html/build-config'
// @ts-ignore
import reactFrameworkConfig from '../../packages/framework-react/build-config'
// @ts-ignore
import vue3FrameworkConfig from '../../packages/framework-vue3/build-config'
// @ts-ignore
import webComponentsFrameworkConfig from '../../packages/framework-web-components/build-config'
import type { BuildEntriesByPackageName } from './utils/entry-utils'

export const buildEntries = {
  // builders
  'storybook-builder-rsbuild': builderConfig,

  // frameworks
  'storybook-html-rsbuild': htmlFrameworkConfig,
  'storybook-react-rsbuild': reactFrameworkConfig,
  'storybook-vue3-rsbuild': vue3FrameworkConfig,
  'storybook-web-components-rsbuild': webComponentsFrameworkConfig,

  // addons
  'storybook-addon-modernjs': addonModernjsConfig,
  'storybook-addon-rslib': addonRslibConfig,
}

export function isBuildEntries(key: string): key is keyof typeof buildEntries {
  return key in buildEntries
}

export function hasPrebuild(
  entry: BuildEntriesByPackageName[keyof BuildEntriesByPackageName],
): entry is BuildEntriesByPackageName[keyof BuildEntriesByPackageName] & {
  prebuild: (cwd: string) => Promise<void>
} {
  return 'prebuild' in entry
}
