/*
 * @Author: 41
 * @Date: 2022-02-15 15:40:06
 * @LastEditors: 41
 * @LastEditTime: 2022-02-15 16:01:23
 * @Description: 
 */
// 导入包
const Koa = require('koa')
// 导入设置的端口号
const { APP_PORT } = require('./config/config.default')
// 创建app实例
const app = new Koa()
// 创建中间件
app.use((ctx, next) => {
  ctx.body = 'hello apii'
})
// 监听端口
app.listen(APP_PORT, () => {
  //使用模板字符串输出端口
  console.log(`server is running on http://localhost:${APP_PORT}`);
})