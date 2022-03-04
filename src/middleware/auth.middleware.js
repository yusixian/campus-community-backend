/*
 * @Author: 41
 * @Date: 2022-02-17 15:04:08
 * @LastEditors: cos
 * @LastEditTime: 2022-03-04 16:56:43
 * @Description: 
 */
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/config.default')
const { tokenExpiredError, invalidToken } = require('../constant/err.type')
const auth = async (ctx, next) => {
  const { authorization } = ctx.request.header
  const token = authorization.replace('Bearer ', '')
  // console.log(token);
  try {
    // user中包含了payload的信息(id,user_name,is_admin)
    const user = jwt.verify(token, JWT_SECRET)
    // console.log(user);
    ctx.state.user = user
  } catch (err) {
    switch (err.name) {
      case 'TokenExpiredError':
        console.error('token已过期', err);
        return ctx.app.emit('error', tokenExpiredError, ctx)
      case 'JsonWebTokenError':
        console.error('无效token', err);
        return ctx.app.emit('error', invalidToken, ctx)
    }
  }
  await next()
}

/**
 * @description: 不抛错，验证授权与否挂到ctx.state.isAuth上
 */
const isAuth = async (ctx, next) => {
  const { authorization } = ctx.request.header
  if(!authorization) {
    ctx.state.isAuth = false
    await next()
    return
  }
  const token = authorization.replace('Bearer ', '')
  ctx.state.isAuth = false
  // console.log(token);
  try {
    // user中包含了payload的信息(id,user_name,is_admin)
    const user = jwt.verify(token, JWT_SECRET)
    // console.log(user);
    ctx.state.user = user
    ctx.state.isAuth = true
  } catch (err) {
    switch (err.name) {
      case 'TokenExpiredError':
        console.error('token已过期', err);
        break;
      case 'JsonWebTokenError':
        console.error('无效token', err);
        break;
    }
  }
  await next()
}

module.exports = {
  auth,
  isAuth
}