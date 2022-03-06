/*
 * @Author: lihao
 * @Date: 2022-03-03 20:12:41
 * @LastEditors: lihao
 * @LastEditTime: 2022-03-06 11:50:50
 * @FilePath: \campus-community-backend\src\ws\wsController\ws.controller.js
 * @Description: 
 * 
 * Copyright (c) 2022 by 用户/公司名, All Rights Reserved. 
 */
const { getAllOnlineUser, sendPrivateMessage, sendGroupMessage, sendSeqLogContent, sendErrLogContent, sendOutLogContent, closeWatcher } = require('../service/ws.service')
const { wsGetOnlineUserError, wsSendMessageError } = require('../../constant/err.type')
let wsSeqLogClients = []
let wsErrLogClients = []
let wsOutLogClients = []
class wsController {
  /**
   * 查询在线用户人数的接口
   * @param {*} ctx 
   * @param {*} next 
   */
  async queryAllOnlineUser(ctx, next) {
    try {
      let res = await getAllOnlineUser();
      ctx.body = {
        code: 0,
        message: '获取在线用户成功',
        result: {
          res
        }
      }
    } catch (err) {
      console.error(err);
      ctx.app.emit('error', wsGetOnlineUserError, ctx)
    }
  }
  /**
   * 私发送消息
   * @param {*} ctx 
   * @param {*} next 
   */
  async sendMessageToUid(ctx, next) {
    const { toUId, data } = ctx.request.body
    try {
      if (await sendPrivateMessage(toUId, data)) {
        ctx.body = {
          code: 0,
          message: '发送消息成功'
        }
      } else {
        ctx.body = {
          code: 1,
          message: '发送消息失败'
        }
      }
    } catch (err) {
      console.error(err);
      ctx.app.emit('error', wsSendMessageError, ctx)
    }
  }
  /**
   * 群发消息  但只能发给在线用户
   * @param {*} ctx 
   * @param {*} next 
   */
  async sendMessageToAllOnline(ctx, next) {
    const { data } = ctx.request.body
    console.log(data);
    try {
      if (await sendGroupMessage(data)) {
        ctx.body = {
          code: 0,
          message: '发送消息成功'
        }
      } else {
        ctx.body = {
          code: 1,
          message: '发送消息失败'
        }
      }
    } catch (err) {
      console.error(err);
      ctx.app.emit('error', wsSendMessageError, ctx)
    }
  }
  /**
   * 开始监听日志
   * @param {*} ctx 
   * @param {*} next 
   */
  async beginSendLogContent(ctx, next) {
    let isSuccess = false
    try {
      const {type } = ctx.request.body
      let id = ctx.state.user.id
      if (type == "seq") {
        if (wsSeqLogClients.indexOf(id) == -1) {
          wsSeqLogClients.push(id)
        }
        isSuccess = await sendSeqLogContent('../../../logs/seq.log', wsSeqLogClients)
      } else if (type == "err") {
        if (wsErrLogClients.indexOf(id) == -1) {
          wsErrLogClients.push(id)
        }
        isSuccess = await sendErrLogContent('../../../logs/err.log', wsErrLogClients)
      } else if (type == "out") {
        if (wsOutLogClients.indexOf(id) == -1) {
          wsOutLogClients.push(id)
        }
        isSuccess = await sendOutLogContent('../../../logs/err.log', wsOutLogClients)
      }
      if (isSuccess) {
        ctx.body = {
          code: 0,
          message: "开始监听"
        }
      } else {
        ctx.body = {
          code: 0,
          message: "监听失败"
        }
      }

    } catch (err) {
      console.log(err);
    }
  }
  
  /**
   * 关闭传送
   * @param {*} ctx 
   * @param {*} next 
   */
  async endSendLog(ctx, next) {
    let {type} = ctx.request.body
    let id = ctx.state.user.id
    let isSuccess = true
    try{
      if (type == 'seq') {
        wsSeqLogClients.splice(wsSeqLogClients.indexOf(id), 1)
        if(wsSeqLogClients.length == 0) {
          isSuccess = closeWatcher(type)
        }
      } else if (type == 'err') {
        wsErrLogClients.splice(wsErrLogClients.indexOf(id), 1)
        if(wsErrLogClients.length == 0) {
          isSuccess = closeWatcher(type)
        }
      } else if (type == 'out') {
        wsOutLogClients.splice(wsOutLogClients.indexOf(id), 1)
        if(wsOutLogClients.length == 0) {
          isSuccess = closeWatcher(type)
        }
      }
      if (isSuccess) {
        ctx.body = {
          code: 0,
          message: "传输停止成功"
        }
      }else {
        ctx.body = {
          code: 0,
          message: "传输停止失败"
        }
      }
      
    }catch(err) {
      console.log(err);
    }
  }

}

module.exports = new wsController()
