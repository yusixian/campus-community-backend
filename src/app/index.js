/*
 * @Author: 41
 * @Date: 2022-02-15 17:29:53
 * @LastEditors: 41
 * @LastEditTime: 2022-02-15 21:14:06
 * @Description: 
 */
// 导入包
const Koa = require('koa')
const KoaBody = require('koa-body')
// 创建app实例
const app = new Koa()
// 导入封装好的路由
const userRouter = require('../routers/user.route')
// 创建中间件
app.use(KoaBody())
app.use(userRouter.routes())

module.exports = app