/*
 * @Author: 41
 * @Date: 2022-02-16 18:25:25
 * @LastEditors: cos
 * @LastEditTime: 2022-02-19 19:32:20
 * @Description: 
 */
const bcrypt = require('bcryptjs')
const { getUserInfo } = require('../service/user.service')
const {
  userFormateError, userAlreadtExited,
  userRegisterError, userDosNotExist,
  userLoginError, invalidPassword, unAuthorizedError} = require('../constant/err.type')
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


const cryptPassword = async (ctx, next) => {
  const { password } = ctx.request.body
  const salt = bcrypt.genSaltSync(10)
  // hash保存的是密文
  const hash = bcrypt.hashSync(password, salt)
  ctx.request.body.password = hash

  await next()
}

const verifyLogin = async (ctx, next) => {
  // 1.判断用户是否存在(不存在报错)
  const { user_name, password } = ctx.request.body
  try {
    const res = await getUserInfo({ user_name })
    if (!res) {
      console.error('用户名不存在', { user_name });
      ctx.app.emit('error', userDosNotExist, ctx)
      return
    }
    // 2.密码是否匹配(不匹配报错)
    if (!bcrypt.compareSync(password, res.password)) {
      ctx.app.emit('error', invalidPassword, ctx)
      return
    }
  } catch (error) {
    console.error(err);
    return ctx.app.emit('error', userLoginError, ctx)
  }
  await next()
}
const verifyAdmin = async (ctx, next) => {
  const { is_admin } = ctx.state.user
  if(!is_admin) {
    console.log('用户无权限，请使用管理员账号', err)
    ctx.app.emit('error', unAuthorizedError, ctx)
  }
  await next()
}
module.exports = {
  userValidator,
  verifyUser,
  cryptPassword,
  verifyLogin
}