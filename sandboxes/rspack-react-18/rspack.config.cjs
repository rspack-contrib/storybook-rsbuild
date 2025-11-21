const { rspack } = require('@rspack/core')
const ReactRefreshPlugin = require('@rspack/plugin-react-refresh')

process.env.NODE_ENV = 'development'
const host = process.env.HOST || 'localhost'

/** @type {import('@rspack/core').Configuration} */
module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  // entry: './src/index.tsx',
  output: {
    filename: 'static/js/bundle.js',
  },
  devServer: {
    compress: true,
    hot: true,
    host,
    port: 3000,
  },
  plugins: [
    new ReactRefreshPlugin(),
    new rspack.HtmlRspackPlugin({
      template: './index.html',
    }),
  ],
  experiments: {
    css: true,
  },
  module: {
    rules: [
      {
        test: /\.m?[jt]sx$/,
        exclude: /node_modules/,
        use: {
          loader: 'builtin:swc-loader',
          options: {
            sourceMap: true,
            jsc: {
              parser: {
                syntax: 'typescript',
                jsx: true,
              },
              externalHelpers: true,
              preserveAllComments: false,
              transform: {
                react: {
                  runtime: 'automatic',
                  throwIfNamespace: true,
                  useBuiltins: false,
                },
              },
            },
          },
        },
      },
      {
        test: /\.css$/,
        type: 'javascript/auto',
        use: [
          {
            loader: 'style-loader',
            options: {
              esModule: false,
            },
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [require('autoprefixer')],
              },
            },
          },
        ],
      },
      {
        test: /\.less$/,
        type: 'javascript/auto',
        use: [
          {
            loader: require.resolve('style-loader'),
            options: {
              esModule: false,
            },
          },
          require.resolve('css-loader'),
          require.resolve('less-loader'),
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.mjs', '.js', '.cjs', '.jsx', '.tsx', '.ts'],
    modules: ['node_modules'],
  },
}
