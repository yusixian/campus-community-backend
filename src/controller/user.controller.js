/*
 * @Author: 41
 * @Date: 2022-02-15 17:37:39
 * @LastEditors: 41
 * @LastEditTime: 2022-02-15 19:09:46
 * @Description: 
 */
class UserController {
  async register (ctx, next) {
    ctx.body = '用户注册成功'
  }

  async login (ctx, next) {
    ctx.body = '登录成功'
  }
}

module.exports = new UserController()