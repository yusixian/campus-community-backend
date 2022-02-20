/*
 * @Author: cos
 * @Date: 2022-02-18 14:09:32
 * @LastEditTime: 2022-02-20 20:52:27
 * @LastEditors: cos
 * @Description: 文章管理相关路由
 * @FilePath: \campus-community-backend\src\routers\article.route.js
 */
const Router = require('koa-router')

const { postArticle, deleteArticle, updateArticle, shieldArticle, restoreArticle, getAllArticle } = require('../controller/article.controller')

const { auth } = require('../middleware/auth.middleware')
const { verifyAdmin } = require('../middleware/user.middleware')

const router = new Router({ prefix: '/articles' })

router.post('/create', auth, postArticle)
router.post('/restore', auth, verifyAdmin, restoreArticle)
router.delete('/delete', auth, deleteArticle)
router.delete('/shield', auth, verifyAdmin, shieldArticle)
router.patch('/update', auth, updateArticle)
router.get('/search', auth, verifyAdmin, getAllArticle)

module.exports = router