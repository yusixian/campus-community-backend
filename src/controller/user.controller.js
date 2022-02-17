/*
 * @Author: 41
 * @Date: 2022-02-15 17:37:39
 * @LastEditors: 41
 * @LastEditTime: 2022-02-17 14:33:20
 * @Description: 
 */
const jwt = require('jsonwebtoken')
const { createUser, getUserInfo } = require('../service/user.service')
const { userRegisterError } = require('../constant/err.type')
const { JWT_SECRET } = require('../config/config.default')
class UserController {
  async register (ctx, next) {
    // 1.获取数据
    // console.log(ctx.request.body);
    const { user_name, password } = ctx.request.body
    // console.log(user_name, password);
    try {
      // 2.操作数据库
      const res = await createUser(user_name, password)
      // 3.返回结果
      ctx.body = {
        code: 0,
        message: "用户注册成功",
        result: {
          id: res.id,
          user_name: res.user_name
        }
      }
    } catch (err) {
      console.log(err);
      ctx.app.emit('error', userRegisterError, ctx)
    }

  }

  async login (ctx, next) {
    const { user_name } = ctx.request.body
    // 1.获取用户信息(在token的payload中，记录id,user_name,is_admin)
    try {
      // 从返回结果对象中剔除password属性，将剩下的属性放到res对象
      const { password, ...res } = await getUserInfo({ user_name })
      ctx.body = {
        code: 0,
        message: '用户登录成功',
        result: {
          token: jwt.sign(res, JWT_SECRET, { expiresIn: '1d' })
        }
      }
    } catch (err) {
      console.error('用户登录失败', err);

    }
    // ctx.body = `欢迎回来,${user_name}`
  }
}

module.exports = new UserController()