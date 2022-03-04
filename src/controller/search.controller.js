/*
 * @Author: 41
 * @Date: 2022-02-24 11:14:28
 * @LastEditors: 41
 * @LastEditTime: 2022-03-04 19:12:15
 * @Description: 
 */
const { searchError } = require('../constant/err.type');
const { filterArticle } = require('../service/article.service');
const { selectCommentCountByAid, filterComment } = require('../service/comment.service');
const { filterLike } = require('../service/like.service');
const { searchLikeUser, searchLikeArticle } = require('../service/search.service')
const { getUserInfo } = require('../service/user.service')
const { getFollowInfo } = require('../service/follow.service')
class searchController {
  async searchUser (ctx, next) {
    try {
      // console.log(ctx.request.query);
      const { id } = ctx.state.user
      let user_id = id
      let f_ids = []
      let follows = await getFollowInfo({ user_id })
      for (let i = 0; i < follows.length; i++) {
        // console.log(follows[i].follow_id);
        f_ids.push(+follows[i].follow_id)
      }
      // console.log(f_ids);
      // console.log(follows);
      let { like_name } = ctx.request.query
      // console.log(like_name);
      let res = await searchLikeUser(like_name)
      let users = []
      for (let i = 0; i < res.length; i++) {
        let { password, ...ans } = res[i]
        users.push(ans)
        // console.log(ans);
      }
      for (let i = 0; i < users.length; i++) {
        // console.log(users[i].id);
        if (f_ids.indexOf(users[i].id) != -1) {
          users[i]['follow'] = true
        } else {
          users[i]['follow'] = false
        }
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
        let tempinfo = await getUserInfo({ id: user_id })
        let { user_name, name } = tempinfo
        // console.log(user_name);
        rows[i]['name'] = name
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
  async searchByUser (ctx, next) {
    try {
      const { user_id, page, type } = ctx.state.searchInfo
      console.log({ user_id, page, type })
      let result
      if (type === 'article') {
        const { page_nums, count, rows } = await filterArticle({ current: page, user_id })
        result = {
          current_page: page,
          page_nums,
          article_total: count,
          article_list: rows
        }
      } else if (type === 'comment') {
        // 返回用户评论文章列表
        const { page_nums, count, rows } = await filterComment({ current: page, user_id })
        result = {
          current_page: page,
          page_nums,
          comment_total: count,
          comment_list: rows

        }
      } else if (type === 'like') {
        const { page_nums, count, rows } = await filterLike({ current: page, user_id })
        result = {
          current_page: page,
          page_nums,
          article_total: count,
          article_list: rows
        }
      }
      return ctx.body = {
        code: 0,
        message: '查询成功',
        result
      }
    } catch (err) {
      console.error(err, searchError)
      return ctx.app.emit('error', searchError, ctx);
    }
  }
}



module.exports = new searchController()