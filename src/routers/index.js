/*
 * @Author: 41
 * @Date: 2022-02-20 21:45:57
 * @LastEditors: lihao
 * @LastEditTime: 2022-03-03 20:29:20
 * @Description: 
 */
const fs = require('fs')

const Router = require('koa-router')
const router = new Router()

const wsRouter = require('../ws/wsRoute/ws.route')

fs.readdirSync(__dirname).forEach(file => {
  // console.log(file);
  if (file !== 'index.js') {
    const r = require('./' + file)
    router.use(r.routes())
  }
})

router.use(wsRouter.routes())

module.exports = router