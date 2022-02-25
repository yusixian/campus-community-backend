/*
 * @Author: 41
 * @Date: 2022-02-24 11:51:17
 * @LastEditors: 41
 * @LastEditTime: 2022-02-24 11:57:45
 * @Description: 
 */
const User = require('../model/user.model')
const Sequelize = require('sequelize')
const Op = Sequelize.Op;
class SearchService {
  async searchLikeUser (clue) {
    return await User.findAll({
      where: {
        user_name: {
          [Op.like]: `%${clue}%`
        }
      },
      raw: true
    })
  }
}


module.exports = new SearchService()