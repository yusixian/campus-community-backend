/*
 * @Author: 41
 * @Date: 2022-02-15 17:29:53
 * @LastEditors: 41
 * @LastEditTime: 2022-02-16 19:03:13
 * @Description: 
 */
// 导入包
const Koa = require('koa')
const KoaBody = require('koa-body')

const errHandler = require('./errHandler')
// 创建app实例
const app = new Koa()
// 导入封装好的路由
const userRouter = require('../routers/user.route')
// 创建中间件
app.use(KoaBody())
app.use(userRouter.routes())

// 统一的错误处理
app.on('error', errHandler)

module.exports = app