const path = require('path')
const resolve = dir => path.resolve(__dirname, dir)
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const RootEntry = require('./rootEnrty.plugins')
const webpack = require('webpack')



const {watchFile,ViewEntry} = require('./.watch.view')



// 获取html文件名，生成多页面入口

const getTemplates = path => {
  const htmls = fs.readdirSync(path)
  return htmls.reduce((cur, html) => {
    const isHtml = html.indexOf('html') > -1
    const fileName = isHtml && html.replace('.html', '')
    isHtml && cur.push(fileName)
    return cur
  }, [])
}




const getViews = path => {
  const files = fs.readdirSync(path)
  let temp = []
  const filesAll = (files) => files.reduce((cur, file) => {
    const hasSuffix = file.indexOf('.') > -1
    hasSuffix && cur.push(file)
    !hasSuffix && filesAll(fs.readdirSync(resolve(`${path}/${file}`)))
    return cur
  }, temp)
  return filesAll(files)
}


const templates = getTemplates(resolve('../template'))
const views = getViews(resolve('../src/views'))



const TemplateEntryPlugins = templates.reduce((cur, tp) => {
  const singleTemplate = new HtmlWebpackPlugin({
    filename: `${tp}.html`,
    template: resolve(`./../template/${tp}.html`),
    chunks: [tp]
  })
  cur.plugins.push(singleTemplate)
  cur.entry[tp] = resolve(`../src/static/js/${tp}`)
  return cur
}, { entry: [], plugins: [] })


const baseConfig = {
  entry: {
    'views':resolve('../.root.mouted.entry/index'),
    ...TemplateEntryPlugins.entry
  },
  output: {
    path: resolve('../dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.j(s|sx)?$/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: 'css-loader'
      }
    ]
  },
  plugins: [
    ...TemplateEntryPlugins.plugins,
    new RootEntry(),
    new VueLoaderPlugin(),
    new CleanWebpackPlugin()
  ]
}

module.exports = baseConfig



