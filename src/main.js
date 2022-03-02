/*
 * @Author: 41
 * @Date: 2022-02-15 15:40:06
 * @LastEditors: lihao
 * @LastEditTime: 2022-03-02 22:54:18
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

// 已连接的客户端
let clients = new Array()
const WebSocket = require('ws')
// 启动端口为8888
const wss = new WebSocket.Server({ port: 8888 });
wss.on('connection', (ws, request) => {
  console.log(request.url);
  let id = request.url.substring(1)
  clients[id + 's'] = ws
  // 用户连接的提醒
  console.log('【建立连接】：当前连接用户数量为：' + Object.keys(clients).length);
  // 监听客户端的消息
  ws.on('message', (msg) => {
    console.log(msg)
    let message = null
    try {
      message = JSON.parse(msg)
    } catch (err) {
      console.log(err);
      clients[id + 's'].send(JSON.stringify({
        fromUId: -1,
        toUId: id,
        type: 'error',
        comtent: '您发送的消息格式有误！'
      }))
      return
    }
    if (message.type == 'private') {
      clients[`${message.toUId}s`].send(msg)
    } else if (message.type == 'group') {
      for (const key in clients) {
        clients[key].send(msg)
      }
    }
  })
  // 监听客户端错误
  ws.on('error', (err) => {
    console.log(err);
  })
  // 监听客户端断开连接
  ws.on('close', () => {
    // 客户端断开连接,删除
    delete clients[id + 's']
    console.log('【退出连接】: 当前连接用户数量为：' + Object.keys(data).length);
  })

})
// 监听服务关闭
wss.on('close', () => {
  console.log('wss close');
})


// const message = {
//   fromUId: 1,  //  发起通信的用户
//   toUId: 2,    // 被通信的用户
//   type: 'private', // 通信的类型， private（私发）、群发（group）、错误（error）
//   data: { // 传输的数据
//     reply: 'hello nice to meet you!'
//   }
// }