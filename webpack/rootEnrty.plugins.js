
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
    const jsScript =  js.map(j => `<script src="${j}" ></script>`).join('')
    return `<!doctype html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <title>${title}</title>
    </head>
    
    <body>
        <div id="${id}"></div>
        ${jsScript}
    </body>
    
    </html>`
  }
  apply(compiler) {
    compiler.hooks.emit.tapAsync('RootEntry', async (compilation, callback) => {
      // console.log(compilation,'compilation')
      const views = this.getViewsName(resolve('../src/views'))
      for (let i = 0; i < views.length; i++) {
        const [name, suffix] = views[i].split('.')   // suffix=vue||jsx
        const fileStr = this.generateHtml(name, [suffix == 'vue' ? './vueBase.js' : './reactBase.js',`./views.js`, ])
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