/*
 * @Author: lihao
 * @Date: 2022-03-03 19:33:57
 * @LastEditors: lihao
 * @LastEditTime: 2022-03-05 10:08:59
 * @FilePath: \campus-community-backend\src\ws\wsClient.js
 * @Description: 
 * 
 * Copyright (c) 2022 by 用户/公司名, All Rights Reserved. 
 */

let WebSocket =  require('ws')
let ws = new WebSocket('ws://localhost:8001/0', ['**********']);
// let ws = new WebSocket('ws://localhost:8001/0', ['Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcl9uYW1lIjoiYWRtaW4iLCJpc19hZG1pbiI6dHJ1ZSwiaW1nIjoiaHR0cHM6Ly93d3cucGlja3Bpay5jb20vYmxlZC1zbG92ZW5pYS1sYWtlLW1vdW50YWlucy1tb3VudGFpbi10aGUtZm9nLTk3IiwiaXNfYWN0aXZlIjp0cnVlLCJuYW1lIjoiYWRtaW4iLCJjaXR5IjoiY2hpbmEiLCJzZXgiOiLnlLciLCJzZXNzaW9uaWQiOjE2NDYyOTg5ODcxNzYsImlhdCI6MTY0NjI5ODk4NywiZXhwIjoxNjQ2Mzg1Mzg3fQ.c2QCttYE3LcKs_PdLFBcVNJzjC4K89Ihp0_Z2j4BFF4']);
ws.on('open', () =>{
  console.log("【ws服务器客户端】：连接成功");
})
ws.on('close', () => {
  console.log("【ws服务器客户端】：退出连接");
})
ws.on('message', (msg) => {
  console.log("【ws服务器客户端】：收到消息 " + msg);
})
ws.on('error', (err) => {
  console.log("【ws服务器客户端】：连接出错 " + err);
})
module.exports = {
  ws
}