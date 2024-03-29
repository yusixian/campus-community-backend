/*
 * @Author: lihao
 * @Date: 2022-03-03 19:27:35
 * @LastEditors: lihao
 * @LastEditTime: 2022-03-06 21:48:06
 * @FilePath: \campus-community-backend\src\ws\wsServer.js
 * @Description: 
 * 
 * Copyright (c) 2022 by 用户/公司名, All Rights Reserved. 
 */
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/config.default')
// 已连接的客户端
let clients = new Array()
const WebSocket = require('ws')
// 启动端口为8888
const wss = new WebSocket.Server({ port: 8001 });
wss.on('listening', () => {
  console.log("【开始监听】：websocket server");
})
wss.on('connection', (ws, request) => {
  // console.log(request.url);
  // let id = request.url.substring(1)
  // try {
  //   id = parseInt(id)
  // } catch (err) {
  //   ws.close()
  //   return
  // }
  // console.log(request.headers['sec-websocket-protocol']);
  let id = null
  let authorization = request.headers['sec-websocket-protocol']
  // console.log(authorization);
  if (authorization != "**********") {
    const token = authorization.replace('Bearer ', '')
    try {
      const user = jwt.verify(token, JWT_SECRET)
      // if (user.id != id) {
      //   ws.close()
      //   return
      // }
      id = user.id
      console.log(123);
    } catch (err) {
      console.log(456);
      ws.close()
      return
    }
  }else {
    id = 0
  }
  clients[id + 's'] = ws
  // 用户连接的提醒
  console.log('【建立连接】：当前连接用户数量为：' + Object.keys(clients).length);
  // 监听客户端的消息
  ws.on('message', (msg) => {
    console.log("【收到消息】：" + msg)
    let message = null
    try {
      message = JSON.parse(msg)
    } catch (err) {
      console.error(err);
      clients[id + 's'].send(JSON.stringify({
        fromUId: 0,
        toUId: id,
        type: 'error',
        comtent: '您发送的消息格式有误！'
      }))
      return
    }
    console.log(clients[`${message.toUId}s`]);
    if (message.type == "private" && !clients[`${message.toUId}s`]) {
      
      ws.send(JSON.stringify({
        fromUId: 0,
        toUId: id,
        type: 'error',
        comtent: '当前用户不在线'
      }))
      return
    }
    message.fromUId = id
    if (message.type == 'private') {
      clients[`${message.toUId}s`].send(JSON.stringify(message))
    } else if (message.type == 'group') {
      for (const key in clients) {
        clients[key].send(JSON.stringify(message))
      }
    }
  })
  // 监听客户端错误
  ws.on('error', (err) => {
    console.error(err);
  })
  // 监听客户端断开连接
  ws.on('close', () => {
    // 客户端断开连接,删除
    delete clients[id + 's']
    console.log('【退出连接】: 当前连接用户数量为：' + Object.keys(clients).length);
  })

})
// 监听服务关闭
wss.on('close', () => {
  console.log('wss close');
})


module.exports = {
  clients,
  wss
}

// const message = {
//   fromUId: 1,  //  发起通信的用户
//   toUId: 2,    // 被通信的用户
//   type: 'private', // 通信的类型， private（私发）、群发（group）、错误（error）
//   data: { // 传输的数据
//     reply: 'hello nice to meet you!'
//   }
// }
