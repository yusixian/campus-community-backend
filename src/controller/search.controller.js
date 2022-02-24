/*
 * @Author: 41
 * @Date: 2022-02-24 11:14:28
 * @LastEditors: 41
 * @LastEditTime: 2022-02-24 12:47:07
 * @Description: 
 */
const { searchLikeUser } = require('../service/search.service')
class searchController {
  async searchUser (ctx, next) {
    try {
      let { like_name } = ctx.request.header
      let res = await searchLikeUser(like_name)
      ctx.body = {
        code: 0,
        message: '查询成功',
        result: {
          res
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
}



module.exports = new searchController()