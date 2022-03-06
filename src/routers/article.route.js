/*
 * @Author: cos
 * @Date: 2022-02-18 14:09:32
 * @LastEditTime: 2022-03-06 21:18:35
 * @LastEditors: cos
 * @Description: 文章管理相关路由
 * @FilePath: \campus-community-backend\src\routers\article.route.js
 */
const Router = require('koa-router')

const { postArticle, deleteArticle, updateArticle,shieldArticle, restoreArticle, getAllArticle, 
  getByID, getByPages, countByFilter, upload, getByPublicPages, reviewArticle, clearArticleList, deleteArticleList, getMyArticle } = require('../controller/article.controller')
const { articleInfoValidate, articleIDValidate, articleExistValidate, articleFilterValidate, articleIDListValidate } = require('../middleware/article.middleware')
const { verifyActive, verifyAdmin } = require('../middleware/user.middleware')
const { auth, isAuth } = require('../middleware/auth.middleware')

const router = new Router({ prefix: '/articles' })

// 不需要登录
router.get('/getbyid', isAuth, 
  articleIDValidate, articleExistValidate, 
  getByID)
router.get('/public/page',
  articleFilterValidate, 
  getByPublicPages)
// 需要token
router.post('/create', auth, verifyActive, 
  articleInfoValidate, 
  postArticle)

router.post('/uploads', auth, verifyActive, 
  upload)

router.delete('/delete', auth, verifyActive, 
  articleIDValidate, articleExistValidate, 
  deleteArticle)

router.patch('/update', auth, verifyActive, 
  articleInfoValidate, articleIDValidate, articleExistValidate, 
  updateArticle)

router.get('/own/page', auth, verifyActive,
  articleFilterValidate, 
  getMyArticle)

router.get('/count', auth, verifyActive, 
  articleFilterValidate, 
  countByFilter)

// 管理员权限
router.post('/review', auth, verifyAdmin, verifyActive,
  articleIDValidate, articleExistValidate, reviewArticle)

router.get('/getlist', auth, verifyAdmin, verifyActive,
  getAllArticle)

router.get('/page', auth, verifyAdmin, verifyActive, 
  articleFilterValidate, 
  getByPages)

router.delete('/shield', auth, verifyAdmin, verifyActive, 
  articleIDValidate, articleExistValidate, 
  shieldArticle)

router.post('/restore', auth, verifyAdmin, verifyActive, 
  articleIDValidate, 
  restoreArticle)

router.delete('/delete/list', auth, verifyAdmin, verifyActive, 
  articleIDListValidate,
  deleteArticleList)

router.delete('/clear/list', auth, verifyAdmin, verifyActive, 
  articleIDListValidate,
  clearArticleList)

module.exports = router