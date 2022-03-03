/*
 * @Author: 41
 * @Date: 2022-02-24 11:14:28
 * @LastEditors: cos
 * @LastEditTime: 2022-03-03 22:45:09
 * @Description: 
 */
const { searchError } = require('../constant/err.type');
const { selectCommentCountByAid } = require('../service/comment.service');
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
      let res = await searchLikeArticle(wd, filterOpt)
      let { rows } = res
      for (let i = 0; i < rows.length; i++) {
        // console.log(`rows[${i}]`,rows[i])
        let { user_id, id } = rows[i]
        // console.log(id)
        let tempinfo = await getUserInfo({ id:user_id })
        let { user_name } = tempinfo
        // console.log(user_name);
        rows[i]['user_name'] = user_name
        rows[i]['comments'] = await selectCommentCountByAid(id);
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