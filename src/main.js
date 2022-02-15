/*
 * @Author: 41
 * @Date: 2022-02-15 15:40:06
 * @LastEditors: 41
 * @LastEditTime: 2022-02-15 17:21:50
 * @Description: 
 */
// 导入包
const Koa = require('koa')
// 导入设置的端口号
const { APP_PORT } = require('./config/config.default')
// 导入封装好的路由
const userRouter = require('./routers/user.route')
// 创建app实例
const app = new Koa()

// 创建中间件
app.use(userRouter.routes())
// 监听端口
app.listen(APP_PORT, () => {
  //使用模板字符串输出端口
  console.log(`server is running on http://localhost:${APP_PORT}`);
})