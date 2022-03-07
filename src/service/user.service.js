/*
 * @Author: 41
 * @Date: 2022-02-15 21:18:52
 * @LastEditors: 41
 * @LastEditTime: 2022-03-07 10:18:43
 * @Description: 用户相关的数据库操作
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
  async createUser (user_name, password, is_admin = 0, img = '', is_active = true, name, city = '', sex = '保密') {
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
  /**
   * @description: 分页查询用户信息
   * @param1 {*}
   * @return {*}
   * @detail: 
   * @param {*} page 第几页
   * @param {*} size 每页多少个
   */
  async getAllInfo (page, size) {
    // console.log(page, size);
    let res
    if (!page || !size) {
      res = await User.findAll({
        raw: true
      })
    } else {
      let start = (page - 1) * size
      res = await User.findAll({
        offset: start,
        limit: +size,
        raw: true
      })
      // console.log(res);
    }

    return res
  }
  /**
   * @description: 分页查询(正常/封禁)的用户信息
   * @param1 {*}
   * @return {*}
   * @detail: 
   * @param {*} page
   * @param {*} size
   * @param {*} is_active
   */
  async getAllactiveInfo (page, size, is_active) {
    console.log(page, size, is_active);
    let res
    if (!page || !size) {
      res = await User.findAll({
        raw: true
      })
    } else {
      let start = (page - 1) * size
      res = await User.findAll({
        where: {
          is_active
        },
        offset: start,
        limit: +size,
        raw: true
      })
      // console.log(res);
    }

    return res
  }
  /**
   * @description: 更新数据库
   * @param1 {*}
   * @return {*}
   * @detail: 
   * @param {*} id
   * @param {*} user_name
   * @param {*} password
   * @param {*} is_admin
   * @param {*} img
   * @param {*} is_active
   * @param {*} name
   * @param {*} city
   * @param {*} sex
   */
  async updateById ({ id, user_name, password, is_admin, img, is_active, name, city, sex }) {
    const whereOpt = { id }
    // console.log(whereOpt, is_active);
    const newUser = {}
    user_name && Object.assign(newUser, { user_name })
    password && Object.assign(newUser, { password })
    is_admin && Object.assign(newUser, { is_admin })
    img && Object.assign(newUser, { img })
    name && Object.assign(newUser, { name })
    city && Object.assign(newUser, { city })
    sex && Object.assign(newUser, { sex })
    newUser['is_active'] = is_active
    console.log(newUser);
    const res = await User.update(newUser, { where: whereOpt })
    // console.log(res);
    return res[0] > 0 ? true : false
  }
  /**
   * @description: 正常用户总人数
   * @param1 {*}
   * @return {*}
   * @detail: 
   */
  async count_active () {
    return await User.count({
      where: {
        is_active: 1
      }
    })
  }
  /**
   * @description: 封禁用户总人数
   * @param1 {*}
   * @return {*}
   * @detail: 
   */
  async count_not_active () {
    return await User.count({
      where: {
        is_active: 0
      }
    })
  }
}

module.exports = new UserService()