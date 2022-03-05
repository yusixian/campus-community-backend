/*
 * @Author: 41
 * @Date: 2022-02-15 17:37:39
 * @LastEditors: 41
 * @LastEditTime: 2022-03-05 21:30:42
 * @Description: 
 */
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const path = require('path')
const { createUser, getUserInfo, updateById, getAllInfo, getAllactiveInfo } = require('../service/user.service')
const { getFollowInfo } = require('../service/follow.service')

const {
  userRegisterError,
  userLoginError,
  changePasswordError,
  fileUploadError,
  tokenExpiredError,
  invalidToken,
  invalidPassword,
  adminError,
  findError,
  changeError,
  userChangeError,
  changeAdminError,
  changeNameError,
  changeCityError,
  changeSexError,
  resetError
} = require('../constant/err.type')
const { JWT_SECRET } = require('../config/config.default')
const { upToQiniu } = require('../utils/oss/ossUtils')
const { fop } = require('qiniu')
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
        message: 'token更新成功',
        result: {
          oldtoken: token,
          newtoken: jwt.sign(res, JWT_SECRET, { expiresIn: '1d' }),
          user: res
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
    // console.log(123);
    const { user_name, password, is_admin, img, is_active, name, city, sex } = ctx.request.body
    // console.log(user_name, password, is_admin, img, is_active, name, city, sex);
    try {
      // 2.操作数据库
      const res = await createUser(user_name, password, is_admin, img, is_active, name, city, sex)
      // 3.返回结果
      ctx.body = {
        code: 0,
        message: "用户注册成功",
        result: {
          id: res.id,
          user_name: res.user_name,
          is_admin: res.is_admin,
          img: res.img,
          is_active: res.is_active,
          name: res.name,
          city: res.city,
          sex: res.sex
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
          token: jwt.sign(res, JWT_SECRET, { expiresIn: '1d' }),
          user: res
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
    const { password, old } = ctx.request.body
    // console.log(id, password, old);
    // 2.判断旧密码是否正确
    let res = await getUserInfo({ id })
    // console.log(res);
    // 2.密码是否匹配(不匹配报错)
    if (!bcrypt.compareSync(old, res.password)) {
      ctx.app.emit('error', invalidPassword, ctx)
      return
    }
    // 3.操作数据库
    if (await updateById({ id, password })) {
      ctx.body = {
        code: 0,
        message: '修改密码成功',
        result: {
          password,
          old
        }
      }
    } else {
      ctx.app.emit('error', changePasswordError
        , ctx)
    }
    // 3.返回结果
  }
  async changeName (ctx, next) {
    // 1.获取数据
    const id = ctx.state.user.id
    const name = ctx.request.body.name
    // console.log(id, name);
    // 2.操作数据库
    if (await updateById({ id, name })) {
      ctx.body = {
        code: 0,
        message: '修改昵称成功',
        result: ''
      }
    } else {
      ctx.app.emit('error', changeNameError
        , ctx)
    }
    // 3.返回结果
  }
  async changeCity (ctx, next) {
    // 1.获取数据
    const id = ctx.state.user.id
    const city = ctx.request.body.city
    // console.log(id, city);
    // 2.操作数据库
    if (await updateById({ id, city })) {
      ctx.body = {
        code: 0,
        message: '修改城市成功',
        result: ''
      }
    } else {
      ctx.app.emit('error', changeCityError
        , ctx)
    }
    // 3.返回结果   
  }
  async changeSex (ctx, next) {
    // 1.获取数据
    const id = ctx.state.user.id
    const sex = ctx.request.body.sex
    // console.log(id, sex);
    // 2.操作数据库
    if (await updateById({ id, sex })) {
      ctx.body = {
        code: 0,
        message: '修改性别成功',
        result: ''
      }
    } else {
      ctx.app.emit('error', changeSexError
        , ctx)
    }
    // 3.返回结果       
  }
  async change (ctx, next) {
    const id = ctx.state.user.id
    let sex, city, name
    if (ctx.request.body.sex) {
      sex = ctx.request.body.sex
    }
    if (ctx.request.body.city) {
      city = ctx.request.body.city
    }
    if (ctx.request.body.name) {
      name = ctx.request.body.name
    }
    if (await updateById({ id, name, city, sex })) {
      let user = await getUserInfo({ id })
      ctx.body = {
        code: 0,
        message: '修改信息成功',
        user
      }
    } else {
      ctx.app.emit('error', changeError
        , ctx)
    }
  }
  async upload (ctx, next) {
    // console.log(ctx.request.files.file);
    const id = ctx.state.user.id
    const { file } = ctx.request.files
    // console.log(file)
    if (file) {
      const img = await upToQiniu(file)
      await updateById({ id, img });
      ctx.body = {
        code: 0,
        message: '头像上传成功',
        result: {
          img
        }
      }
    } else {
      return ctx.app.emit('error', fileUploadError, ctx)
    }
  }
  async findAllactive (ctx, next) {
    const { page, size, is_active } = ctx.request.query
    console.log(is_active);
    let users = await getAllactiveInfo(page, size, is_active)
    ctx.body = {
      code: 0,
      message: '查询成功',
      users
    }
  }
  async findall (ctx, next) {
    const { page, size } = ctx.request.query
    // console.log(page, size);
    try {
      let res = await getAllInfo(page, size)
      let users = []
      for (let i = 0; i < res.length; i++) {
        let { password, ...ans } = res[i]
        users.push(ans)
      }
      ctx.body = {
        code: 0,
        message: '查询成功',
        result: {
          users
        }
      }
    }
    catch (err) {
      return ctx.app.emit('error', adminError, err)
    }
  }
  async findone (ctx, next) {
    try {
      let { id } = ctx.request.query
      let res = await getUserInfo({ id })
      let { password, ...user } = res
      let user_id = id
      let follows = await getFollowInfo({ user_id })
      user_id = ctx.state.user.id
      let authfollows = await getFollowInfo({ user_id })
      let isfollow = false
      for (let i = 0; i < authfollows.length; i++) {
        // console.log(authfollows[i].follow_id, id);
        if (authfollows[i].follow_id == id) {
          isfollow = true
          break
        }
      }
      user['isfollow'] = isfollow
      ctx.body = {
        code: 0,
        message: '查询成功',
        result: {
          user,
          follows
        }
      }
    }
    catch (err) {
      return ctx.app.emit('error', findError, err)
    }

  }
  async blockade (ctx, next) {
    const { user_name, is_active } = ctx.request.body
    if (user_name === "") {
      ctx.app.emit('error', userDosNotExist, ctx)
      return;
    }
    try {
      const { id } = await getUserInfo({ user_name })
      await updateById({ id, is_active })
      // console.log(is_active);
      if (is_active) {
        ctx.body = {
          code: 0,
          message: `${user_name}用户已解封`,
          result: {
          }
        }
      } else {
        ctx.body = {
          code: 0,
          message: `${user_name}用户已封号`,
          result: {
          }
        }
      }

    } catch (err) {
      return ctx.app.emit('error', userChangeError, err)
    }
  }
  async changeAdmin (ctx, body) {
    const { user_name, is_admin } = ctx.request.body
    if (user_name === "") {
      ctx.app.emit('error', userDosNotExist, ctx)
      return;
    }
    try {
      const { id } = await getUserInfo({ user_name })
      await updateById({ id, is_admin })
      // console.log(is_admin);
      if (is_admin) {
        ctx.body = {
          code: 0,
          message: `${user_name}用户被提拔为管理员`,
          result: {
          }
        }
      } else {
        ctx.body = {
          code: 0,
          message: `${user_name}用户已被撤销管理员职位`,
          result: {
          }
        }
      }
    } catch (err) {
      return ctx.app.emit('error', changeAdminError, err)
    }
  }
  async reset (ctx, next) {
    const { user_name, password } = ctx.request.body
    // console.log(user_name, password);
    if (user_name === "") {
      ctx.app.emit('error', userDosNotExist, ctx)
      return;
    }
    try {
      const { id } = await getUserInfo({ user_name })
      await updateById({ id, password })
      ctx.body = {
        code: 0,
        message: `${user_name}用户密码被重置`,
        result: {
        }
      }

    } catch (err) {
      return ctx.app.emit('error', resetError, err)
    }
  }
}
module.exports = new UserController()