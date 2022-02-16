/*
 * @Author: 41
 * @Date: 2022-02-15 17:18:24
 * @LastEditors: 41
 * @LastEditTime: 2022-02-16 22:50:09
 * @Description: 
 */
const Router = require('koa-router')

const router = new Router({ prefix: '/users' })

// 导入controller
const { register, login } = require('../controller/user.controller')
// 导入中间件
const { userValidator, verifyUser } = require('../middleware/user.middleware')
// GET /users/
// 注册接口
router.post('/register', userValidator, verifyUser, register)
router.post('/login', login)
module.exports = router