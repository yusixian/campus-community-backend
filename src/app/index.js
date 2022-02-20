/*
 * @Author: 41
 * @Date: 2022-02-15 17:29:53
 * @LastEditors: 41
 * @LastEditTime: 2022-02-20 21:51:51
 * @Description: 
 */
// 导入包
const Koa = require('koa')
const render = require('koa-art-template')
const path = require('path')
const serve = require('koa-static')
const KoaBody = require('koa-body')
const errHandler = require('./errHandler')
// 创建app实例
const app = new Koa()
// 配置koa-art-template模板引擎
render(app, {
  root: path.join(path.resolve(__dirname, '..'), 'views'), //视图的位置
  extname: '.html'// 模板文件的后缀
})
// console.log(path.resolve(__dirname, '..'));
// 导入封装好的路由
const router = require('../routers/index')
// const userRouter = require('../routers/user.route')
// const homeRouter = require('../routers/home.route')
// const articleRouter = require('../routers/article.route')
// const partition = require('../routers/partition.route')
// 创建中间件
app.use(KoaBody())
app.use(router.routes())
// app.use(userRouter.routes())
// app.use(homeRouter.routes())
// app.use(articleRouter.routes())
// app.use(partition.routes()) // 分区的路由
app.use(serve(path.resolve(__dirname, '..') + '/public'))
// 统一的错误处理
app.on('error', errHandler)

module.exports = app