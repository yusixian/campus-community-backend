/*
 * @Author: 41
 * @Date: 2022-02-24 11:14:28
 * @LastEditors: cos
 * @LastEditTime: 2022-02-28 13:35:28
 * @Description: 
 */
const { searchError } = require('../constant/err.type');
const { searchLikeUser, searchLikeArticle } = require('../service/search.service')
class searchController {
  async searchUser (ctx, next) {
    try {
      // console.log(ctx.request.query);
      let { like_name } = ctx.request.query
      console.log(like_name);
      let res = await searchLikeUser(like_name)
      ctx.body = {
        code: 0,
        message: '查询成功',
        result: {
          res
        }
      }
    } catch (err) {
      console.error(err, searchError)
      return ctx.app.emit('error', searchError, ctx);
    }
  }
  async searchArticle (ctx, next) {
    try {
      const filterOpt = ctx.state.filterOpt
      let { wd } = ctx.request.query
      console.log("wd:", wd);
      let res = await searchLikeArticle(wd, filterOpt)
      ctx.body = {
        code: 0,
        message: '查询成功',
        result: {
          res
        }
      }
    } catch (err) {
      console.error(err, searchError)
      return ctx.app.emit('error', searchError, ctx);
    }
  }
}



module.exports = new searchController()