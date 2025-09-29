# React Native Web sandbox

这个沙盒用于验证 `storybook-react-native-web-rsbuild` 框架的集成效果，展示如何在 Rsbuild 中通过 Storybook 渲染 React Native 组件。

## 脚本

- `pnpm --filter @sandboxes/react-native-web run storybook`：本地启动 Storybook。
- `pnpm --filter @sandboxes/react-native-web run build:storybook`：构建 Storybook 并生成统计信息。
- `pnpm --filter @sandboxes/react-native-web run build`：使用 Rsbuild 构建示例应用。
