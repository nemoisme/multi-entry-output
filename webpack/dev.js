const baseConfig = require('./base')
const merge = require('webpack-merge')
const path = require('path')
const webpack = require("webpack")
const resolve = dir => path.resolve(__dirname, dir)

const devConfig = {
  mode: 'development',
  watch: true,
  watchOptions: {
    ignored: /node_modules/,
    aggregateTimeout: 300,
    poll: 1000
  },
  output: {
    path: resolve('../bound'),
    filename: '[name].js'
  },
  devServer: {
    host: 'localhost',
    port: 3000,
    historyApiFallback: true,
    contentBase: resolve( "bound"),
    overlay: {
      errors: true
    },
    open:false,
    inline: true,
    hot: false
  }
}

module.exports = merge(baseConfig,devConfig)