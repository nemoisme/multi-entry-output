
const path = require('path')
const resolve = dir => path.resolve(__dirname, dir)
const fs = require('fs')
const webpack = require('webpack')


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

const watchFile = () => {

  try {
    let ViewEntry = {}
    const viewPath = resolve('../src/views')
    //view 下面有文件改动
    fs.watch(viewPath, (event, file) => {
      console.log(file, 'file')
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
      })
      const viewIndexStr = fs.readFileSync(resolve('../.root.mouted.entry/index.js'), 'utf8')
      fs.writeFileSync(
        resolve('../.root.mouted.entry/index.js'),
        `${viewIndexStr}\n import './${name}'`,
        (err) => { if (!!err) return }
      )
    })
  } catch (e) {
    console.log(e)
  }

}


module.exports = watchFile
