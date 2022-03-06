/*
 * @Author: 41
 * @Date: 2022-02-24 10:53:43
 * @LastEditors: cos
 * @LastEditTime: 2022-03-05 22:26:06
 * @Description: 
 */
const Router = require('koa-router')
const router = new Router({ prefix: '/search' })

// 导入controller
const { searchUser, searchArticle, searchByUser, searchPostRank, searchUserRank, searchStatusCount } = require('../controller/search.controller')
// 导入中间件
const { auth } = require('../middleware/auth.middleware')
const { articleFilterValidate } = require('../middleware/article.middleware')
const { searchInfoValidate } = require('../middleware/search.middleware')
// GET /users/
// 用户模糊查询
router.get('/byname', auth, searchUser)
router.get('/byword', articleFilterValidate, searchArticle)
router.get('/byuser', searchInfoValidate, searchByUser)
router.get('/post_rank', searchPostRank)
router.get('/user_rank', searchUserRank)
router.get('/status_count', searchStatusCount)

module.exports = router