/*
 * @Author: 41
 * @Date: 2022-02-15 17:37:39
 * @LastEditors: 41
 * @LastEditTime: 2022-02-16 16:55:36
 * @Description: 
 */
const { createUser, getUserInfo } = require('../service/user.service')
class UserController {
  async register (ctx, next) {
    // 1.获取数据
    // console.log(ctx.request.body);
    const { user_name, password } = ctx.request.body
    // console.log(user_name, password);
    // 合法性
    if (!user_name || !password) {
      console.error('用户名或密码为空', ctx.request.body);
      ctx.status = 400
      ctx.body = {
        code: '10001',
        message: '用户名或者密码为空',
        result: ''
      }
      return
    }
    // 合理性 先在数据库中进行查询
    if (getUserInfo({ user_name })) {
      ctx.status = 409
      ctx.body = {
        code: '10002',
        message: '用户已经存在',
        result: ''
      }
      return
    }
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
  }

  async login (ctx, next) {
    ctx.body = '登录成功'
  }
}

module.exports = new UserController()