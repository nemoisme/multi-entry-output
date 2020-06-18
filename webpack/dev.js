const baseConfig = require('./base')
const merge = require('webpack-merge')
const path = require('path')
const webpack = require("webpack")
const resolve = dir => path.resolve(__dirname, dir)
const fs = require('fs')
const watchFile = require('./.watch.view')




watchFile()

const devConfig = (entry = {}) => ({
  mode: 'development',
  output: {
    path: resolve('../bound'),
    filename: '[name].js'
  },
  devServer: {
    host: 'localhost',
    port: 3000,
    historyApiFallback: true,
    contentBase: resolve("./../bound"),
    overlay: {
      errors: true
    },
    open: false,
    inline: true,
    hot: false
  },
  plugins: []
})






// const compiler = webpack(merge(baseConfig, devConfig));

// watchFile(webpackDevServer.addDevServerEntrypoints(ViewEntry, { inline: false }))

module.exports = merge(baseConfig, devConfig)