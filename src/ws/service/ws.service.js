/*
 * @Author: lihao
 * @Date: 2022-03-03 19:53:23
 * @LastEditors: lihao
 * @LastEditTime: 2022-03-06 11:55:47
 * @FilePath: \campus-community-backend\src\ws\service\ws.service.js
 * @Description: 
 * 
 * Copyright (c) 2022 by 用户/公司名, All Rights Reserved. 
 */
let { ws } = require('../wsClient')
let { clients } = require('../wsServer')

const fs = require('fs');
const path = require('path');

let seqWatcher = null
let oldSeqContent = ""
let errWatcher = null
let oldErrContent = ""
let outWathcher = null
let oldOutContent = ""
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
  async getAllOnlineUser() {
    let onlineUserIds = []
    for (const key in clients) {
      onlineUserIds.push(Number.parseInt(key.substring(0, key.length - 1)))
    }
    return {
      onlineUserIds,
      count: onlineUserIds.length
    }
  }
  /**
   * 传输seq.log
   * @param {*} filepath 文件路径
   * @param {*} wsClients  需要传输的客户端
   */
  async sendSeqLogContent(filepath, wsClients) {
    try {
      // 获取日志所在路径
      let fullPath = path.join(__dirname, filepath)
      // 获取初始日志文件
      if (oldSeqContent == "") {
        fs.readFile(fullPath, 'utf-8', (err, data) => {
          if (err) {
            return false
          }
          oldSeqContent = data
        })
      }
      // 创建seq初始监听器
      if (seqWatcher == null) {
        seqWatcher = fs.watch(fullPath, (event, fiename) => {
          if (event == "change") { // 当为change时间时，进行传输
            fs.readFile(fullPath, 'utf-8', (err, data) => {
              if (err) {
                return false
              }
              // if (data == oldSeqContent) {
              //   return
              // }
              let newSeqLog = data.replace(oldSeqContent, "")
              for (let i = 0; i < wsClients.length; i++) {
                if (clients[wsClients[i] + 's']) {
                  clients[wsClients[i] + 's'].send(JSON.stringify({
                    fromUId: 0,
                    toUId: wsClients[i],
                    type: 'seqlog',
                    data: newSeqLog
                  }))
                }

              }
            })
          }
        })
      }
      return true

    } catch (err) {
      console.log(err);
      return false

    }

  }
  /**
   * 传输错误日志
   * @param {*} filepath 文件路径
   * @param {*} wsClients 需要传输的客户端
   */
  async sendErrLogContent(filepath, wsClients) {
    try {
      // 获取日志所在路径
      let fullPath = path.join(__dirname, filepath)
      // 获取初始日志文件
      if (oldErrContent == "") {
        fs.readFile(fullPath, 'utf-8', (err, data) => {
          if (err) {
            return false
          }
          oldErrContent = data
        })
      }
      // 创建seq初始监听器
      if (errWatcher == null) {
        errWatcher = fs.watch(fullPath, (event, fiename) => {
          if (event == "change") { // 当为change时间时，进行传输
            fs.readFile(fullPath, 'utf-8', (err, data) => {
              if (err) {
                return false
              }
              // if (data == oldErrContent) {
              //   return
              // }
              let newErrLog = data.replace(oldErrContent, "")
              for (let i = 0; i < wsClients.length; i++) {
                if (clients[wsClients[i] + 's']) {
                  clients[wsClients[i] + 's'].send(JSON.stringify({
                    fromUId: 0,
                    toUId: wsClients[i],
                    type: 'seqlog',
                    data: newErrLog
                  }))
                }
              }
            })
          }
        })
      }
      return true

    } catch (err) {
      console.log(err);
      return false

    }

  }
  /**
   * 传输输出日志
   * @param {*} filepath 文件路径
   * @param {*} wsClients 需要传输的客户端
   */
  async sendOutLogContent(filepath, wsClients) {
    try {
      // 获取日志所在路径
      let fullPath = path.join(__dirname, filepath)
      // 获取初始日志文件
      if (oldOutContent == "") {
        fs.readFile(fullPath, 'utf-8', (err, data) => {
          if (err) {
            return false
          }
          oldOutContent = data
        })
      }
      // 创建seq初始监听器
      if (outWathcher == null) {
        outWathcher = fs.watch(fullPath, (event, fiename) => {
          if (event == "change") { // 当为change时间时，进行传输
            fs.readFile(fullPath, 'utf-8', (err, data) => {
              if (err) {
                return false
              }
              // if (data == oldOutContent) {
              //   return
              // }
              let newErrLog = data.replace(oldOutContent, "")
              for (let i = 0; i < wsClients.length; i++) {
                if (clients[wsClients[i] + 's']) {
                  clients[wsClients[i] + 's'].send(JSON.stringify({
                    fromUId: 0,
                    toUId: wsClients[i],
                    type: 'seqlog',
                    data: newErrLog
                  }))
                }
              }
            })
          }
        })
      }
      return true
    } catch (err) {
      console.log(err);
      return false

    }

  }
  /**
   * 
   * @param {*} type 需要关闭的类型
   * @param {*} clients 现存的客户端数量
   * @returns 
   */
  async closeWatcher(type) {
    try{
      if (type == 'seq') {
        seqWatcher.close()
        console.log(seqWatcher);
        seqWatcher = null
      } else if (type == 'err') {
        errWatcher.close()
        errWatcher = null
      } else if (type == 'out') {
        outWathcher.close()
        outWathcher = null
      }
      return true
    }catch(err) {
      console.log(err);
      return false
    }
    
  }

}


module.exports = new WsService()