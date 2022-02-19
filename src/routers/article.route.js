/*
 * @Author: cos
 * @Date: 2022-02-18 14:09:32
 * @LastEditTime: 2022-02-18 20:50:45
 * @LastEditors: cos
 * @Description: 文章管理相关路由
 * @FilePath: \campus-community-backend\src\routers\article.route.js
 */
const Router = require('koa-router')

const { postArticle } = require('../controller/article.controller')

const { auth } = require('../middleware/auth.middleware')

const router = new Router({ prefix: '/articles' })

router.post('/create', auth, postArticle)

module.exports = router