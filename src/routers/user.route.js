/*
 * @Author: 41
 * @Date: 2022-02-15 17:18:24
 * @LastEditors: 41
 * @LastEditTime: 2022-02-15 19:09:06
 * @Description: 
 */
const Router = require('koa-router')

const router = new Router({ prefix: '/users' })

// 导入controller
const { register, login } = require('../controller/user.controller')
// GET /users/
// 注册接口
router.post('/register', register)
router.post('/login', login)
module.exports = router