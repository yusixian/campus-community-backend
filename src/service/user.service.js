/*
 * @Author: 41
 * @Date: 2022-02-15 21:18:52
 * @LastEditors: 41
 * @LastEditTime: 2022-02-16 16:05:50
 * @Description: 
 */
const User = require('../model/user.model')
class UserService {
  async createUser (user_name, password) {
    // 插入数据
    // await表达式:promise对象的值
    const res = await User.create({
      // 表的字段 这里用了简写，属性名 属性值相同！
      user_name,
      password
    })
    console.log(res);
    return res.dataValues
  }
}

module.exports = new UserService()