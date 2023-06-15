require('@babel/register')
const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const outputDirectory = 'app_build'

module.exports = {
  target: 'web',
  mode: process.env.NODE_ENV || 'production',
  // entry: {
  //   study: './views/Study.render.react.js',
  //   admin: './views/Admin.render.react.js',
  //   main: './views/Main.render.react.js',
  //   login: './views/Login.render.react.js',
  //   register: './views/Register.render.react.js',
  //   reset: './views/Resetpw.render.react.js',
  //   account: './views/Account.render.react.js',
  //   editConfig: './views/EditConfig.render.react.js',
  //   config: './views/Config.render.react.js',
  //   deepdive: './views/DeepDive.render.react.js',
  //   graph: './views/Graph.render.react.js',
  //   reportsList: './views/ReportsList.render.react.js',
  //   editReport: './views/EditReport.render.react.js',
  //   report: './views/Report.render.react.js',
  //   chart: './views/Chart.render.react.js',
  //   newChart: './views/NewChart.render.react.js',
  //   studyDetails: './views/StudyDetails.render.react.js',
  //   viewChart: './views/ViewChart.render.react.js',
  //   editChart: './views/EditChart.render.react.js',
  // },
  entry: ['babel-polyfill', './views/index.js'],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: [/node_modules/, /\.test\.(js|jsx)$/],
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: [
                'react-html-attrs',
                '@babel/plugin-proposal-class-properties',
                ['@babel/plugin-proposal-decorators', { legacy: true }],
                ['@babel/plugin-transform-runtime', { legacy: true }],
              ],
              presets: [
                [
                  '@babel/preset-react',
                  {
                    runtime: 'automatic',
                  },
                ],
                '@babel/preset-env',
              ],
              cacheDirectory: true,
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'static/[hash][ext][query]',
        },
      },
    ],
  },
  optimization: {
    minimize: true,
  },
  output: {
    path: path.join(__dirname, outputDirectory),
    filename: 'bundle.js',
  },
  resolve: {
    fallback: {
      fs: false,
      net: false,
      tls: false,
    },
    extensions: ['*', '.js', '.jsx'],
  },
  devServer: {
    port: 3000,
    open: true,
    historyApiFallback: true,
    proxy: {
      '/api': 'http://localhost:9000',
    },
    hot: true,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
}
