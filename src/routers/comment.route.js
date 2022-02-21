/*
 * @Author: lihao
 * @Date: 2022-02-21 15:10:07
 * @LastEditors: lihao
 * @LastEditTime: 2022-02-21 18:03:07
 * @FilePath: \campus-community-backend\src\routers\comment.route.js
 * @Description: 评论的路由
 */

const Router = require('koa-router')

const router = new Router({ prefix: '/comment' })

// 导入 comment controller
const { inserComment, deleleComment, restoreComment, queryCommentByArticleId } = require('../controller/comment.controller')

// 导入鉴权中间件
const { auth } = require('../middleware/auth.middleware')
const { commentValidator, commentDeleteValidator } = require('../middleware/comment.middleware')

// 新增评论的接口
router.post('/createComment', auth, commentValidator, inserComment)

// 软删除评论的接口
router.delete('/deleteComment', auth, commentDeleteValidator, deleleComment)

// 恢复评论的接口
router.patch('/restoreComment', auth, commentDeleteValidator, restoreComment)

// 根据文章id查询评论的接口
router.get('/queryCommentByArticleId', auth, commentDeleteValidator, queryCommentByArticleId)

module.exports = router