/*
 * @Author: lihao
 * @Date: 2022-03-03 19:53:23
 * @LastEditors: cos
 * @LastEditTime: 2022-03-05 20:44:57
 * @FilePath: \campus-community-backend\src\ws\service\ws.service.js
 * @Description: 
 * 
 * Copyright (c) 2022 by 用户/公司名, All Rights Reserved. 
 */
let { ws } = require('../wsClient')
let {clients} = require('../wsServer')
class WsService {
  /**
   * 后端私发消息
   * @param {*} uid 接收消息的目标
   * @param {*} data 传输的数据
   * @returns bool值  是否发送成功
   */
  async sendPrivateMessage(uid, data) {
    try {
      const message = {
        fromUId: 0,  //  发起通信的用户
        toUId: uid,    // 被通信的用户
        type: 'private', // 通信的类型， private（私发）、群发（group）、错误（error）
        data: data
      }
      ws.send(JSON.stringify(message))
      return true
    } catch (err) {
      console.error(err);
      return false
    }
  }
  /**
   * 后端群发消息
   * @param {*} data 传输的数据
   * @returns bool值  是否发送成功
   */
  async sendGroupMessage(data) {
    try {
      const message = {
        fromUId: 0,  //  发起通信的用户
        toUId: null,    // 被通信的用户
        type: 'group', // 通信的类型， private（私发）、群发（group）、错误（error）
        data: data
      }
      console.log(message);
      ws.send(JSON.stringify(message))
      return true
    } catch (err) {
      console.error(err);
      return false
    }
  }
  /**
   * 获取所有在线用户列表和数量
   * @returns 
   */
  async getAllOnlineUser(){
    let onlineUserIds = []
    for (const key in clients) {
      onlineUserIds.push(Number.parseInt(key.substring(0, key.length-1)))
    }
    return {
      onlineUserIds,
      count: onlineUserIds.length
    }
  }


}


module.exports = new WsService()