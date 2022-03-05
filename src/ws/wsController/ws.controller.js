/*
 * @Author: lihao
 * @Date: 2022-03-03 20:12:41
 * @LastEditors: lihao
 * @LastEditTime: 2022-03-05 11:55:00
 * @FilePath: \campus-community-backend\src\ws\wsController\ws.controller.js
 * @Description: 
 * 
 * Copyright (c) 2022 by 用户/公司名, All Rights Reserved. 
 */
const { getAllOnlineUser, sendPrivateMessage, sendGroupMessage } = require('../service/ws.service')
const {wsGetOnlineUserError, wsSendMessageError} = require('../../constant/err.type')
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
    }catch(err) {
      console.log(err);
      ctx.app.emit('error', wsGetOnlineUserError,ctx)
    }
  }
  /**
   * 私发送消息
   * @param {*} ctx 
   * @param {*} next 
   */
  async sendMessageToUid(ctx, next) {
    const {toUId, data} = ctx.request.body
    try {
      if(await sendPrivateMessage(toUId, data)){
        ctx.body = {
          code: 0,
          message: '发送消息成功'
        }
      }else {
        ctx.body = {
          code: 1,
          message: '发送消息失败'
        }
      }
    }catch(err) {
      console.log(err);
      ctx.app.emit('error', wsSendMessageError,ctx)
    }
  }
  /**
   * 群发消息  但只能发给在线用户
   * @param {*} ctx 
   * @param {*} next 
   */
  async sendMessageToAllOnline(ctx, next) {
    const {data} = ctx.request.body
    console.log(data);
    try {
      if(await sendGroupMessage(data)){
        ctx.body = {
          code: 0,
          message: '发送消息成功'
        }
      }else {
        ctx.body = {
          code: 1,
          message: '发送消息失败'
        }
      }
    }catch(err) {
      console.log(err);
      ctx.app.emit('error', wsSendMessageError,ctx)
    }
  }
}

module.exports = new wsController()
