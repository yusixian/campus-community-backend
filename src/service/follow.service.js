/*
 * @Author: 41
 * @Date: 2022-03-03 16:16:24
 * @LastEditors: 41
 * @LastEditTime: 2022-03-04 15:34:12
 * @Description: 
 */
const { Op } = require("sequelize");
const Follow = require('../model/follow.model')
const { getUserInfo } = require('./user.service')
class FollowService {
  async createFollow (user_id, follow_id) {
    console.log(user_id, follow_id);
    let id = follow_id
    let follower = await getUserInfo({ id })
    console.log(follower);
    let follow_name = follower.name
    let follow_pic = follower.img
    // console.log(follower);
    // await表达式:promise对象的值
    const res = await Follow.create({
      // 表的字段 这里用了简写，属性名 属性值相同！
      user_id, follow_id, follow_name, follow_pic
    })
    return res.dataValues
  }
  async getFollowInfo ({ user_id, follow_id }) {
    const whereOpt = {}
    user_id && Object.assign(whereOpt, { user_id })
    follow_id && Object.assign(whereOpt, { follow_id })
    return Follow.findAll({
      where: whereOpt,
      raw: true
    })
  }
  async delFollow ({ user_id, follow_id }) {
    return Follow.destroy({
      where: {
        user_id,
        follow_id
      }
    })
  }
}

module.exports = new FollowService()