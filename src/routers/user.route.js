/*
 * @Author: 41
 * @Date: 2022-02-15 17:18:24
 * @LastEditors: 41
 * @LastEditTime: 2022-02-17 15:36:56
 * @Description: 
 */
const Router = require('koa-router')

const router = new Router({ prefix: '/users' })

// 导入controller
const { register, login } = require('../controller/user.controller')
// 导入中间件
const {
  userValidator,
  verifyUser,
  cryptPassword,
  verifyLogin } = require('../middleware/user.middleware')
const { auth } = require('../middleware/auth.middleware')
// GET /users/
// 注册接口
router.post('/register', userValidator, verifyUser, cryptPassword, register)
// 登录接口
router.post('/login', userValidator, verifyLogin, login)
// 修改密码接口
router.patch('/', auth, (ctx, next) => {
  console.log(ctx.state.user);
  ctx.body = "修改密码成功"
})
module.exports = router