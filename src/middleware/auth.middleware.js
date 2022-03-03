/*
 * @Author: 41
 * @Date: 2022-02-17 15:04:08
 * @LastEditors: 41
 * @LastEditTime: 2022-03-03 18:07:05
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

module.exports = {
  auth
}