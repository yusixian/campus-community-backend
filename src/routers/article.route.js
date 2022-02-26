/*
 * @Author: cos
 * @Date: 2022-02-18 14:09:32
 * @LastEditTime: 2022-02-26 19:03:24
 * @LastEditors: cos
 * @Description: 文章管理相关路由
 * @FilePath: \campus-community-backend\src\routers\article.route.js
 */
const Router = require('koa-router')

const { postArticle, deleteArticle, updateArticle, shieldArticle, restoreArticle, getAllArticle, getByID, getByPages, countByFilter, upload } = require('../controller/article.controller')
const { articleInfoValidate, articleIDValidate, articleExistValidate, articleFilterValidate } = require('../middleware/article.middleware')

const { auth } = require('../middleware/auth.middleware')
const { verifyAdmin } = require('../middleware/user.middleware')

const router = new Router({ prefix: '/articles' })

router.post('/create', auth, articleInfoValidate, postArticle)
router.post('/uploads', auth, upload)
router.post('/restore', auth, verifyAdmin, articleIDValidate, restoreArticle)
router.delete('/delete', auth, articleIDValidate, articleExistValidate, deleteArticle)
router.delete('/shield', auth, verifyAdmin, articleIDValidate, articleExistValidate, shieldArticle)
router.patch('/update', auth, articleInfoValidate, articleIDValidate,articleExistValidate, updateArticle)
router.get('/getlist', auth, verifyAdmin, getAllArticle)
router.get('/getbyid', auth, articleIDValidate, articleExistValidate, getByID)
router.get('/count', auth, articleFilterValidate, countByFilter)
router.get('/page', auth, articleFilterValidate, getByPages)

module.exports = router