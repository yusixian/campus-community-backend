/*
 * @Author: 41
 * @Date: 2022-02-24 11:14:28
 * @LastEditors: 41
 * @LastEditTime: 2022-03-02 14:08:59
 * @Description: 
 */
const { searchError } = require('../constant/err.type');
const { searchLikeUser, searchLikeArticle } = require('../service/search.service')
const { getUserInfo } = require('../service/user.service')

class searchController {
  async searchUser (ctx, next) {
    try {
      // console.log(ctx.request.query);
      let { like_name } = ctx.request.query
      console.log(like_name);
      let res = await searchLikeUser(like_name)
      let users = []
      for (let i = 0; i < res.length; i++) {
        let { password, ...ans } = res[i]
        users.push(ans)
        // console.log(ans);
      }
      ctx.body = {
        code: 0,
        message: '查询成功',
        result: {
          users
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
      let { rows } = res
      for (let i = 0; i < rows.length; i++) {
        let { user_id } = rows[0]
        let id = user_id
        let tempinfo = await getUserInfo({ id })
        let { user_name } = tempinfo
        // console.log(user_name);
        rows[i]['user_name'] = user_name
      }
      // console.log(rows);
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