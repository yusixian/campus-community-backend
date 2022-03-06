/*
 * @Author: lihao
 * @Date: 2022-03-03 20:21:10
 * @LastEditors: lihao
 * @LastEditTime: 2022-03-06 11:36:06
 * @FilePath: \campus-community-backend\src\ws\wsRoute\ws.route.js
 * @Description: 
 * 
 * Copyright (c) 2022 by 用户/公司名, All Rights Reserved. 
 */

const Router = require('koa-router')

const router = new Router({ prefix: '/ws' })

const {queryAllOnlineUser, sendMessageToUid, sendMessageToAllOnline, beginSendLogContent, endSendLog} =require('../wsController/ws.controller')
const {verifyAdmin} = require('../../middleware/user.middleware')
const { auth } = require('../../middleware/auth.middleware')
// 获取在线用户
router.get('/getAllOnlineUser', auth, queryAllOnlineUser)
// 私发消息
router.post('/sendMessageToUid', auth, verifyAdmin, sendMessageToUid)
// 群发给在线用户
router.post('/sendMessageToAllOnline', auth, verifyAdmin, sendMessageToAllOnline)
// 开始传输日志
router.post('/beginGetLog', auth, verifyAdmin, beginSendLogContent)
// 结束传输日志
router.post('/endGetLog', auth, verifyAdmin, endSendLog)

module.exports = router