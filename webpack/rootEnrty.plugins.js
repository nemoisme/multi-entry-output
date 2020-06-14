
const path = require('path')
const resolve = dir => path.resolve(__dirname, dir)
const fs = require('fs')

class RootEntry {
  constructor(options) {
    this.options = options
  }
  getViewsName(path) {
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
  generateHtml(id, js, css, title) {
    return `<!doctype html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <title>${title}</title>
    </head>
    
    <body>
        <div id="${id}"></div>
        <script src="${js}"></script>
    </body>
    
    </html>`
  }
  apply(compiler) {
    compiler.hooks.emit.tapAsync('RootEntry', async (compilation, callback) => {
      // console.log(compilation,'compilation')
      const views = this.getViewsName(resolve('../src/views'))
      for (let i = 0; i < views.length; i++) {
        const [name, suffix] = views[i].split('.')
        const fileStr = this.generateHtml(name, 'test.js')
        const rootStr = id => `import Vue from 'vue'
        import vueView from '../src/views/vueView.vue'
        new Vue({
          el:'#vueView',
          render:h=>h(vueView)
        })`

        fs.writeFile('./../.root.mouted.entry/test.js', rootStr('vueView'), (err) => {
          console.log(err)
        })

        compilation.assets[`${name}.html`] = {
          source: () => fileStr,
          size: () => fileStr.length
        }
      }
      callback()
    })
  }
}


module.exports = RootEntry