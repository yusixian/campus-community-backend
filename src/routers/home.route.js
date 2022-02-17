/*
 * @Author: 41
 * @Date: 2022-02-17 17:47:18
 * @LastEditors: 41
 * @LastEditTime: 2022-02-17 17:58:39
 * @Description: 
 */
const Router = require('koa-router')

const router = new Router()

router.get('/', async (ctx, next) => {
  await ctx.render('index', {})
})
module.exports = router