
const merge = require('webpack-merge')
const baseConfig = require('./base')
const path = require('path')
const resolve = dir => path.resolve(__dirname, dir)
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const prdConfig = {
  mode: 'production',
  plugins:[    new BundleAnalyzerPlugin()]
}

module.exports = merge(baseConfig, prdConfig)
