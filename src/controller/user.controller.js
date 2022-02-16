/*
 * @Author: 41
 * @Date: 2022-02-15 17:37:39
 * @LastEditors: 41
 * @LastEditTime: 2022-02-16 22:55:57
 * @Description: 
 */
const { createUser } = require('../service/user.service')
const { userRegisterError } = require('../constant/err.type')
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
    ctx.body = '登录成功'
  }
}

module.exports = new UserController()