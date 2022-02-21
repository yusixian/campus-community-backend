/*
 * @Author: 41
 * @Date: 2022-02-20 21:45:57
 * @LastEditors: lihao
 * @LastEditTime: 2022-02-21 15:24:52
 * @Description: 
 */
const fs = require('fs')

const Router = require('koa-router')
const router = new Router()

fs.readdirSync(__dirname).forEach(file => {
  // console.log(file);
  if (file !== 'index.js') {
    const r = require('./' + file)
    router.use(r.routes())
  }
})

module.exports = router