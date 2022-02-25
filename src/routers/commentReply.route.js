/*
 * @Author: lihao
 * @Date: 2022-02-24 20:05:09
 * @LastEditors: lihao
 * @LastEditTime: 2022-02-25 14:57:39
 * @FilePath: \campus-community-backend\src\routers\commentReply.route.js
 * @Description: 评论回复路由
 */

const Router = require('koa-router')

const router = new Router({ prefix: '/commentReply' })

// 导入 comment controller
const { insertCommentReply, deleteCommentReply } = require('../controller/commentReply.controller')

// 导入鉴权中间件
const { auth } = require('../middleware/auth.middleware')
const { commentReplyValidator, commentReplyDeleteValidator } = require('../middleware/commentReply.middleware')

// 新增评论回复
router.post('/insertCommentReply', auth, commentReplyValidator, insertCommentReply)
// 删除评论回复
router.delete('/deleteCommentReply', auth, commentReplyDeleteValidator, deleteCommentReply)

module.exports = router
