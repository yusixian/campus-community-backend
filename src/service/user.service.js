/*
 * @Author: 41
 * @Date: 2022-02-15 21:18:52
 * @LastEditors: 41
 * @LastEditTime: 2022-02-25 15:20:32
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
  async createUser (user_name, password, is_admin = 0, img = '', is_active = false, name, city = '', sex = '保密') {
    // await表达式:promise对象的值
    if (!name) name = user_name
    const res = await User.create({
      // 表的字段 这里用了简写，属性名 属性值相同！
      user_name,
      password,
      is_admin,
      img,
      is_active,
      name,
      city,
      sex
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
  async getUserInfo ({ id, user_name, password, is_admin, img, is_active, name, city, sex }) {
    const whereOpt = {}
    id && Object.assign(whereOpt, { id })
    user_name && Object.assign(whereOpt, { user_name })
    password && Object.assign(whereOpt, { password })
    is_admin && Object.assign(whereOpt, { is_admin })
    img && Object.assign(whereOpt, { img })
    is_active && Object.assign(whereOpt, { is_active })
    name && Object.assign(whereOpt, { name })
    city && Object.assign(whereOpt, { city })
    sex && Object.assign(whereOpt, { sex })
    const res = await User.findOne({
      attributes: ['id', 'user_name', 'password', 'is_admin', 'img', 'is_active', 'name', 'city', 'sex'],
      where: whereOpt
    })
    return res ? res.dataValues : null
  }

  async getAllInfo () {
    return await User.findAll({
      raw: true
    })
  }

  async updateById ({ id, user_name, password, is_admin, img, is_active, name, city, sex }) {
    const whereOpt = { id }
    const newUser = {}
    user_name && Object.assign(newUser, { user_name })
    password && Object.assign(newUser, { password })
    is_admin && Object.assign(newUser, { is_admin })
    img && Object.assign(newUser, { img })
    is_active && Object.assign(newUser, { is_active })
    name && Object.assign(newUser, { name })
    city && Object.assign(newUser, { city })
    sex && Object.assign(newUser, { sex })
    const res = await User.update(newUser, { where: whereOpt })
    // console.log(res);
    return res[0] > 0 ? true : false
  }
}

module.exports = new UserService()