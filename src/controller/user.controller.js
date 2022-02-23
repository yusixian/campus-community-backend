/*
 * @Author: 41
 * @Date: 2022-02-15 17:37:39
 * @LastEditors: 41
 * @LastEditTime: 2022-02-23 14:52:20
 * @Description: 
 */
const jwt = require('jsonwebtoken')
const path = require('path')
const { createUser, getUserInfo, updateById } = require('../service/user.service')
const {
  userRegisterError,
  userLoginError,
  changePasswordError,
  fileUploadError,
  tokenExpiredError,
  invalidToken
} = require('../constant/err.type')
const { JWT_SECRET } = require('../config/config.default')
class UserController {
  async updatetoken (ctx, next) {
    const { authorization } = ctx.request.header
    const token = authorization.replace('Bearer ', '')
    try {
      const user = jwt.verify(token, JWT_SECRET)
      const user_name = user.user_name
      const { password, ...res } = await getUserInfo({ user_name })
      res['sessionid'] = new Date().getTime()
      ctx.body = {
        code: 0,
        message: '用户登录成功',
        result: {
          oldtoken: token,
          newtoken: jwt.sign(res, JWT_SECRET, { expiresIn: '1d' })
        }
      }
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
  }
  async register (ctx, next) {
    // 1.获取数据
    // console.log(ctx.request.body);
    const { user_name, password, is_admin, img } = ctx.request.body
    console.log(user_name, password, is_admin, img);
    try {
      // 2.操作数据库
      const res = await createUser(user_name, password, is_admin, img)
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
      console.error('用户注册失败', err);
      ctx.app.emit('error', userRegisterError, ctx)
    }
  }
  async login (ctx, next) {
    const { user_name } = ctx.request.body
    // 1.获取用户信息(在token的payload中，记录id,user_name,is_admin)
    try {
      // 从返回结果对象中剔除password属性，将剩下的属性放到res对象
      const { password, ...res } = await getUserInfo({ user_name })
      res['sessionid'] = new Date().getTime()  // 给token添加sessionid配置,可以避免多token同时生效！
      ctx.body = {
        code: 0,
        message: '用户登录成功',
        result: {
          token: jwt.sign(res, JWT_SECRET, { expiresIn: '1d' })
        }
      }
    } catch (err) {
      console.error('用户登录失败', err);
      ctx.app.emit('error', userLoginError, ctx)
    }
  }
  async changePassword (ctx, next) {
    // 1.获取数据
    const id = ctx.state.user.id
    const password = ctx.request.body.password
    console.log(id, password);
    // 2.操作数据库
    if (await updateById({ id, password })) {
      ctx.body = {
        code: 0,
        message: '修改密码成功',
        result: ''
      }
    } else {
      ctx.app.emit('error', changePasswordError
        , ctx)
    }
    // 3.返回结果
  }

  async upload (ctx, next) {
    // console.log(ctx.request.files.file);
    const id = ctx.state.user.id
    const { file } = ctx.request.files
    const img = '/uploads/' + path.basename(file.path)
    console.log(id, img);

    if (await updateById({ id, img })) {
      if (file) {
        ctx.body = {
          code: 0,
          message: '头像上传成功',
          result: {
            img: path.basename(file.path)
          }
        }
      }
    } else {
      return ctx.app.emit('error', fileUploadError, ctx)
    }
  }
}

module.exports = new UserController()