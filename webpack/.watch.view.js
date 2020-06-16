
const path = require('path')
const resolve = dir => path.resolve(__dirname, dir)
const fs = require('fs')
const webpackDevServer = require('webpack-dev-server')
const webpack = require('webpack')

let ViewEntry = {}

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



const views = getViews(resolve('../src/views'))

// 监听watch views下面的文件改动

const watchFile = (runFunc) => {
  try {
    const viewPath = resolve('../src/views')
    for (let i = 0; i < views.length; i++) {
      console.log(i)
      const [fileName, suffix] = views[i].split('.')
      ViewEntry[fileName] = resolve(`../.root.mouted.entry/${fileName}`)
    }

    //view 下面有文件改动
    fs.watch(viewPath, (event, file) => {
      const [name, suffix] = file.split('.')
      const rootStr = (id = 'vueView', ui = 'vue') => {
        const firstToUpperCaseName = id.slice(0, 1).toUpperCase() + id.slice(1)
        const vueEnry = `
        import Vue from 'vue'
        import ${id} from '../src/views/${id}.vue'
        new Vue({el:'#${id}',render:h=>h(${id})})
        `
        const reactEntry = `
        import React from 'react';
        import ReactDom from 'react-dom';
        import ${firstToUpperCaseName} from '../src/views/${id}.jsx'
        ReactDom.render(<${firstToUpperCaseName} />, document.getElementById('${id}'));
        `
        return ui == 'vue' ? vueEnry : reactEntry
      }

      const path = resolve(`./../.root.mouted.entry/${name}.js`)
      const isExist = fs.existsSync(path)
      !isExist && fs.writeFileSync(path, rootStr(name, suffix == 'jsx' ? 'react' : 'vue'), (err) => {
        console.log(err, 'err')
        if (!!err) return
        ViewEntry[name] = resolve(path)
        webpackDevServer.addDevServerEntrypoints(require('./dev'), { inline: false })
        runFunc()
      })
    })
  } catch (e) {
    console.log(e, 'ee')
  }

}
watchFile()
module.exports = { watchFile, ViewEntry }
