const path = require('path')
const resolve = dir => path.resolve(__dirname, dir)
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const RootEntry = require('./rootEnrty.plugins')
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

let ViewEntry = {}


const TemplateEntryPlugins = templates.reduce((cur, tp) => {
  const singleTemplate = new HtmlWebpackPlugin({
    filename: `${tp}.html`,
    template: resolve(`./../template/${tp}.html`),
    chunks: [tp]
  })
  cur.plugins.push(singleTemplate)
  cur.entry[tp] = resolve(`../src/static/js/${tp}`)
  return cur
}, { entry: {}, plugins: [] })




// 监听watch views下面的文件改动

const watchFile =  () => {
  const viewPath = resolve('../src/views')

  for (let i = 0; i < views.length; i++) {
    const [fileName, suffix] = views[i].split('.')
    ViewEntry[fileName] = resolve(`../.root.mouted.entry/${fileName}`)
  }

  //view 下面有文件改动
  fs.watch(viewPath, (event, file) => {
    const [name, suffix] = file.split('.')
    const rootStr = (id = 'vueView', ui = 'vue') =>
      `import Vue from 'vue'
     import ${id} from '../src/views/${id}.vue'
     new Vue({
       el:'#${id}',
       render:h=>h(${id})
      })`
    const path = resolve(`./../.root.mouted.entry/${name}.js`)
    const isExist = fs.existsSync(path)
    !isExist && fs.writeFileSync(path, rootStr(name, 'vue'), (err) => {
      console.log(err, 'err')
      if (!!err) return
      ViewEntry[name] = resolve(path)
    })
  })
}

 watchFile()

module.exports = {
  entry: {
    ...ViewEntry,
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
        test: /\.js$/,
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