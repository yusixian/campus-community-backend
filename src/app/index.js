/*
 * @Author: 41
 * @Date: 2022-02-15 17:29:53
 * @LastEditors: 41
 * @LastEditTime: 2022-03-01 13:36:08
 * @Description: 
 */
// 导入包
const path = require('path')
const cors = require('koa2-cors')
const Koa = require('koa')
const KoaBody = require('koa-body')
const render = require('koa-art-template')
const serve = require('koa-static')

// 导入封装好的路由
const router = require('../routers/index')
// 引入websocket
// 导入统一的错误处理函数
const errHandler = require('./errHandler')
// 创建app实例
const app = new Koa()
// 配置koa-art-template模板引擎
render(app, {
  root: path.join(path.resolve(__dirname, '..'), 'views'), //视图的位置
  extname: '.html'// 模板文件的后缀
})


// 添加跨域中间件
app.use(cors())
// 配置上传文件
app.use(KoaBody({
  multipart: true,
  formidable: {
    // 在配置选项option里，不推荐使用相对路径
    // 在option里的相对路径，不是相对的当前文件，相对process.cwd()
    uploadDir: path.join(__dirname, '../public/uploads'),
    keepExtensions: true
  }
}))
app.use(router.routes()).use(router.allowedMethods())
// 公共资源静态文件
app.use(serve(path.resolve(__dirname, '..') + '/public'))
// 统一的错误处理
app.on('error', errHandler)
module.exports = app