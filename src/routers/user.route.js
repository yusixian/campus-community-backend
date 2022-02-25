/*
 * @Author: 41
 * @Date: 2022-02-15 17:18:24
 * @LastEditors: 41
 * @LastEditTime: 2022-02-25 17:25:08
 * @Description: 
 */
const Router = require('koa-router')

const router = new Router({ prefix: '/users' })

// 导入controller
const {
  register,
  login,
  changePassword,
  changeAdmin,
  changeName,
  changeCity,
  changeSex,
  upload,
  updatetoken,
  findall,
  findone,
  reset,
  blockade } = require('../controller/user.controller')
// 导入中间件
const {
  userValidator,
  verifyUser,
  cryptPassword,
  verifyLogin,
  verifySex,
  verifyAdmin } = require('../middleware/user.middleware')
const { auth } = require('../middleware/auth.middleware')
// GET /users/
// 注册接口
router.post('/register', userValidator, verifyUser, cryptPassword, register)
// 登录接口
router.post('/login', userValidator, verifyLogin, login)
// 上传头像接口
router.post('/upload', auth, upload)
// 封号接口
router.post('/blockadeornot', auth, verifyAdmin, blockade)
// 切换管理员接口
router.post('/admin', auth, verifyAdmin, changeAdmin)
// 用户密码一键重置接口
router.post('/reset', auth, verifyAdmin, cryptPassword, reset)
// 修改密码接口
router.patch('/password', auth, cryptPassword, changePassword)
// 修改昵称接口
router.patch('/name', auth, changeName)
// 修改昵称接口
router.patch('/city', auth, changeCity)
// 修改性别接口
router.patch('/sex', auth, verifySex, changeSex)
// token更新接口
router.get('/updatetoken', updatetoken)
// 查询所有用户信息的接口
router.get('/info', auth, verifyAdmin, findall)
// 根据id查询用户信息的接口
router.get('/searchbyid', auth, verifyAdmin, findone)

module.exports = router