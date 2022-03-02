/*
 * @Author: cos
 * @Date: 2022-02-18 14:09:32
 * @LastEditTime: 2022-03-02 17:05:43
 * @LastEditors: cos
 * @Description: 文章管理相关路由
 * @FilePath: \campus-community-backend\src\routers\article.route.js
 */
const Router = require('koa-router')

const { postArticle, deleteArticle, updateArticle, shieldArticle, restoreArticle, getAllArticle, getByID, getByPages, countByFilter, upload, getByPublicPages } = require('../controller/article.controller')
const { articleInfoValidate, articleIDValidate, articleExistValidate, articleFilterValidate } = require('../middleware/article.middleware')
const { verifyActive } = require('../middleware/user.middleware')
const { auth } = require('../middleware/auth.middleware')
const { verifyAdmin } = require('../middleware/user.middleware')

const router = new Router({ prefix: '/articles' })

// 不需要登录
router.get('/getbyid', articleIDValidate, articleExistValidate, getByID)
router.get('/public/page', articleFilterValidate, getByPublicPages)
// 需要token
router.post('/create', auth, articleInfoValidate,verifyActive, postArticle)
router.post('/uploads', auth,verifyActive, upload)
router.delete('/delete', auth, articleIDValidate, articleExistValidate, verifyActive,deleteArticle)
router.patch('/update', auth, articleInfoValidate, articleIDValidate,articleExistValidate,verifyActive, updateArticle)
router.get('/count', auth, articleFilterValidate, verifyActive,countByFilter)
// 管理员权限
router.get('/getlist', auth, verifyAdmin, verifyActive,getAllArticle)
router.get('/page', auth, verifyAdmin, articleFilterValidate, verifyActive,getByPages)
router.delete('/shield', auth, verifyAdmin, articleIDValidate, articleExistValidate, verifyActive,shieldArticle)
router.post('/restore', auth, verifyAdmin, articleIDValidate, verifyActive,restoreArticle)

module.exports = router