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
const { verifyActive } = require('../middleware/user.middleware')
const { auth } = require('../middleware/auth.middleware')
const { verifyAdmin } = require('../middleware/user.middleware')

const router = new Router({ prefix: '/articles' })

router.post('/create', auth, articleInfoValidate,verifyActive, postArticle)
router.post('/uploads', auth,verifyActive, upload)
router.post('/restore', auth, verifyAdmin, articleIDValidate, verifyActive,restoreArticle)
router.delete('/delete', auth, articleIDValidate, articleExistValidate, verifyActive,deleteArticle)
router.delete('/shield', auth, verifyAdmin, articleIDValidate, articleExistValidate, verifyActive,shieldArticle)
router.patch('/update', auth, articleInfoValidate, articleIDValidate,articleExistValidate,verifyActive, updateArticle)
router.get('/getlist', auth, verifyAdmin, verifyActive,getAllArticle)
router.get('/getbyid', auth, articleIDValidate, articleExistValidate, verifyActive,getByID)
router.get('/count', auth, articleFilterValidate, verifyActive,countByFilter)
router.get('/page', auth, articleFilterValidate, verifyActive,getByPages)

module.exports = router