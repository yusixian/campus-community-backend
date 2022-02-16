/*
 * @Author: 41
 * @Date: 2022-02-16 18:25:25
 * @LastEditors: 41
 * @LastEditTime: 2022-02-16 23:01:52
 * @Description: 
 */
const { getUserInfo } = require('../service/user.service')
const { userFormateError, userAlreadtExited, userRegisterError } = require('../constant/err.type')
const userValidator = async (ctx, next) => {
  const { user_name, password } = ctx.request.body
  // 合法性
  if (!user_name || !password) {
    console.error('用户名或密码为空', ctx.request.body);
    ctx.app.emit('error', userFormateError, ctx)
    return
  }
  await next()
}

const verifyUser = async (ctx, next) => {
  const { user_name, password } = ctx.request.body
  console.log(user_name);
  try {
    // 合理性 先在数据库中进行查询
    if (await getUserInfo({ user_name })) {
      console.error('用户名已经存在', { user_name })
      ctx.app.emit('error', userAlreadtExited, ctx)
      return
    }
  } catch (err) {
    console.error('获取用户信息错误', err)
    ctx.app.emit('error', userRegisterError, ctx)
    return
  }

  await next()
}
module.exports = {
  userValidator,
  verifyUser
}