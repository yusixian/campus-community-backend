/*
 * @Author: lihao
 * @Date: 2022-02-21 15:10:07
 * @LastEditors: lihao
 * @LastEditTime: 2022-02-27 16:38:43
 * @FilePath: \campus-community-backend\src\routers\comment.route.js
 * @Description: 评论的路由
 */

const Router = require('koa-router')

const router = new Router({ prefix: '/comment' })

// 导入 comment controller
const { inserComment, deleleComment, restoreComment, queryCommentByArticleId, delBatchCommentByIds } = require('../controller/comment.controller')

// 导入鉴权中间件
const { auth } = require('../middleware/auth.middleware')
const { commentValidator, commentDeleteValidator, commentDeleteBatchValidator, commentPageQuery, commentOwnValidate } = require('../middleware/comment.middleware')
const { verifyActive, verifyAdmin } = require('../middleware/user.middleware')
// 新增评论的接口
router.post('/createComment', auth, commentValidator, verifyActive, inserComment)

// 删除评论的接口
router.delete('/deleteComment', auth, commentDeleteValidator, verifyActive, commentOwnValidate, deleleComment)

// 恢复评论的接口
router.patch('/restoreComment', auth, commentDeleteValidator, verifyActive, restoreComment)

// 根据文章id查询评论的接口
router.get('/queryCommentByArticleId', auth, commentDeleteValidator, commentPageQuery, verifyActive, queryCommentByArticleId)

// 批量删除评论
router.delete('/delBatchCommentByIds', auth, commentDeleteBatchValidator, verifyActive, verifyAdmin, delBatchCommentByIds)

module.exports = router