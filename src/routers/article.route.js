/*
 * @Author: cos
 * @Date: 2022-02-18 14:09:32
 * @LastEditTime: 2022-02-18 14:42:32
 * @LastEditors: cos
 * @Description: 文章管理相关路由
 * @FilePath: \campus-community-backend\src\routers\article.route.js
 */
const Router = require('koa-router')

const { postArticle } = require('../controller/article.controller')

const router = new Router({ prefix: '/articles' })

router.post('/create', postArticle)

module.exports = router