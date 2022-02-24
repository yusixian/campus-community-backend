/*
 * @Author: 41
 * @Date: 2022-02-24 10:53:43
 * @LastEditors: 41
 * @LastEditTime: 2022-02-24 11:47:17
 * @Description: 
 */
const Router = require('koa-router')
const router = new Router({ prefix: '/search' })

// 导入controller
const { searchUser } = require('../controller/search.controller')
// 导入中间件
const { verifyAdmin } = require('../middleware/user.middleware')
const { auth } = require('../middleware/auth.middleware')
// GET /users/
// 模糊查询
router.get('/', auth, verifyAdmin, searchUser)

module.exports = router