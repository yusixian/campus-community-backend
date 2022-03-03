/*
 * @Author: 41
 * @Date: 2022-02-15 15:40:06
 * @LastEditors: lihao
 * @LastEditTime: 2022-03-03 19:46:26
 * @Description: 
 */

// 导入设置的端口号
const { APP_PORT } = require('./config/config.default')
// 导入封装的app
const app = require('./app/index')
// 监听端口
app.listen(APP_PORT, () => {
  //使用模板字符串输出端口
  console.log(`server is running on http://localhost:${APP_PORT}`);
})

const {clients, wss} = require('./ws/wsServer')
const {ws} = require('./ws/wsClient')
