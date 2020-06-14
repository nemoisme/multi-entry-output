
const merge = require('webpack-merge')
const baseConfig = require('./base')
const path = require('path')
const resolve = dir => path.resolve(__dirname, dir)

const prdConfig = {
  mode: 'production',
  plugins:[]
}

module.exports = merge(baseConfig, prdConfig)
