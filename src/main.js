/*
 * @Author: 41
 * @Date: 2022-02-15 15:40:06
 * @LastEditors: cos
 * @LastEditTime: 2022-03-02 11:21:06
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

//********************************* */
// const WebSocket = require('ws');
// const ws = new WebSocket.Server({ port: 8888 });
// var clients = []
// ws.on('connection', client => {
//   console.log('server connection');
//   if (clients.indexOf(client) === -1) {
//     clients.push(client)
//     console.log("有" + clients.length + "客户端在线");
//     client.on('message', function (msg) {
//       console.log('收到消息' + msg);
//       for (var c of clients) {
//         if (c != client) {
//           c.send(msg)
//         }
//       }
//     })
//   }
// });
// ws.on('close', client => {
//   clients.splice(clients.indexOf(client), 1)
//   console.log("有" + clients.length + "客户端在线");
// })