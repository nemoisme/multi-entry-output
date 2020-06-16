const baseConfig = require('./base')
const merge = require('webpack-merge')
const path = require('path')
const webpack = require("webpack")
const resolve = dir => path.resolve(__dirname, dir)
const fs = require('fs')
const webpackDevServer = require('webpack-dev-server')
const { watchFile, ViewEntry } = require('./.watch.view')


// 监听watch views下面的文件改动

const devConfig = {
  mode: 'development',
  watch: true,
  watchOptions: {
    ignored: /node_modules/,
    aggregateTimeout: 300,
    poll: 1000
  },
  entry: { ...ViewEntry },
  output: {
    path: resolve('../bound'),
    filename: '[name].js'
  },
  devServer: {
    host: 'localhost',
    port: 3000,
    historyApiFallback: true,
    contentBase: resolve("./../src"),
    overlay: {
      errors: true
    },
    open: false,
    inline: true,
    hot: false
  }
}


const compiler = webpack(merge(baseConfig, devConfig));

watchFile(webpackDevServer.addDevServerEntrypoints(ViewEntry, { inline: false }))

module.exports = merge(baseConfig, devConfig)