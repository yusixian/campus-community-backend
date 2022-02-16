/*
 * @Author: 41
 * @Date: 2022-02-15 17:18:24
 * @LastEditors: 41
 * @LastEditTime: 2022-02-17 00:34:28
 * @Description: 
 */
const Router = require('koa-router')

const router = new Router({ prefix: '/users' })

// 导入controller
const { register, login } = require('../controller/user.controller')
// 导入中间件
const { userValidator, verifyUser, cryptPassword, verifyLogin } = require('../middleware/user.middleware')
// GET /users/
// 注册接口
router.post('/register', userValidator, verifyUser, cryptPassword, register)
router.post('/login', userValidator, verifyLogin, login)
module.exports = router