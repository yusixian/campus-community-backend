/*
 * @Author: 41
 * @Date: 2022-02-15 17:18:24
 * @LastEditors: 41
 * @LastEditTime: 2022-02-23 22:28:35
 * @Description: 
 */
const Router = require('koa-router')

const router = new Router({ prefix: '/users' })

// 导入controller
const {
  register,
  login,
  changePassword,
  upload,
  updatetoken,
  findall,
  blockade } = require('../controller/user.controller')
// 导入中间件
const {
  userValidator,
  verifyUser,
  cryptPassword,
  verifyLogin,
  verifyAdmin } = require('../middleware/user.middleware')
const { auth } = require('../middleware/auth.middleware')
// GET /users/
// 注册接口
router.post('/register', userValidator, verifyUser, cryptPassword, register)
// 登录接口
router.post('/login', userValidator, verifyLogin, login)
// 修改密码接口
router.patch('/', auth, cryptPassword, changePassword)
// 上传头像接口
router.post('/upload', auth, upload)
// token更新接口
router.get('/updatetoken', updatetoken)
// 查询所有用户信息的接口
router.get('/info', auth, verifyAdmin, findall)
// 封号接口
router.post('/blockadeornot', blockade)
module.exports = router