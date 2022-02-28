/*
 * @Author: 41
 * @Date: 2022-02-24 10:53:43
 * @LastEditors: cos
 * @LastEditTime: 2022-02-28 13:27:46
 * @Description: 
 */
const Router = require('koa-router')
const router = new Router({ prefix: '/search' })

// 导入controller
const { searchUser, searchArticle } = require('../controller/search.controller')
// 导入中间件
const { verifyAdmin } = require('../middleware/user.middleware')
const { auth } = require('../middleware/auth.middleware')
const { articleFilterValidate } = require('../middleware/article.middleware')
// GET /users/
// 用户模糊查询
router.get('/byname', auth, verifyAdmin, searchUser)
router.get('/byword', auth, articleFilterValidate, searchArticle)

module.exports = router