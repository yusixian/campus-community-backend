/*
 * @Author: 41
 * @Date: 2022-02-15 21:18:52
 * @LastEditors: 41
 * @LastEditTime: 2022-02-23 21:20:48
 * @Description: 
 */
const User = require('../model/user.model')
class UserService {
  /**
   * @description: 插入数据库
   * @param1 {*}
   * @return {*}
   * @detail: 
   * @param {*} user_name
   * @param {*} password
   */
  async createUser (user_name, password, is_admin = 0, img = '', is_active = 1) {
    // await表达式:promise对象的值
    const res = await User.create({
      // 表的字段 这里用了简写，属性名 属性值相同！
      user_name,
      password,
      is_admin,
      img,
      is_active
    })
    // console.log(res);
    return res.dataValues
  }
  /**
   * @description: 查询数据库
   * @param1 {*}
   * @return {*}
   * @detail: 
   * @param {*} id
   * @param {*} user_name
   * @param {*} password
   * @param {*} is_admin
   */
  async getUserInfo ({ id, user_name, password, is_admin }) {
    const whereOpt = {}
    id && Object.assign(whereOpt, { id })
    user_name && Object.assign(whereOpt, { user_name })
    password && Object.assign(whereOpt, { password })
    is_admin && Object.assign(whereOpt, { is_admin })

    const res = await User.findOne({
      attributes: ['id', 'user_name', 'password', 'is_admin'],
      where: whereOpt
    })
    return res ? res.dataValues : null
  }

  async getAllInfo () {
    return await User.findAll({
      raw: true
    })
  }

  async updateById ({ id, user_name, password, is_admin, img, is_active }) {
    const whereOpt = { id }
    const newUser = {}
    user_name && Object.assign(newUser, { user_name })
    password && Object.assign(newUser, { password })
    is_admin && Object.assign(newUser, { is_admin })
    img && Object.assign(newUser, { img })
    is_active && Object.assign(newUser, { is_active })
    const res = await User.update(newUser, { where: whereOpt })
    // console.log(res);
    return res[0] > 0 ? true : false
  }
}

module.exports = new UserService()