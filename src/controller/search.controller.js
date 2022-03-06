/*
 * @Author: 41
 * @Date: 2022-02-24 11:14:28
 * @LastEditors: lihao
 * @LastEditTime: 2022-03-06 17:51:05
 * @Description: 
 */
const { searchError } = require('../constant/err.type');
const { filterArticle, countArticle, searchArticleByID } = require('../service/article.service');
const { selectCommentCountByAid, filterComment } = require('../service/comment.service');
const { filterLike } = require('../service/like.service');
const { searchLikeUser, searchLikeArticle } = require('../service/search.service')
const { getUserInfo, getAllInfo } = require('../service/user.service')
const { getFollowInfo, getfollowList } = require('../service/follow.service')
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
      // console.log({ user_id, page, type })
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
        const article_list = []
        for (let i = 0; i < rows.length; i++) {
          rows[i].article = await searchArticleByID(rows[i].id)
        }
        result = {
          current_page: page,
          page_nums,
          comment_total: count,
          comment_list: rows,
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

  async searchUserRank (ctx, next) {
    const sortmap = new Map()
    const ranks = []
    let users = await getAllInfo()
    for (let i = 0; i < users.length; i++) {
      let follow_id = users[i].id
      let temp = await getFollowInfo({ follow_id })
      // console.log(temp);
      sortmap.set(follow_id, temp.length)
    }
    let temparr = Array.from(sortmap)
    temparr.sort((a, b) => {
      if (a[1] != b[1]) {
        return b[1] - a[1]
      } else {
        return b[0] - b[1]
      }
    })
    for (let i = 0; i < temparr.length; i++) {
      let id = temparr[i][0]
      let temp = await getUserInfo({ id })
      temp['follows_cnt'] = temparr[i][1]
      ranks.push(temp)
      // console.log(temparr[i][0], temparr[i][1]);
    }
    ctx.body = {
      code: 0,
      message: '查询成功',
      ranks
    }
  }

  /**
   * @description: 获取社区热帖排行榜前十
   * 热帖排行根据点赞、评论、浏览数 三者结合排名即可， 
   * 优先级第一要素为点赞，第二要素为评论， 第三要素为浏览数
   */
  async searchPostRank (ctx, next) {
    try {
      const filterOpt = { status: 0 }
      const orderOpt = [
        ['likes', 'DESC'],
        ['visits', 'DESC'],
        ['collections', 'DESC']
      ]
      console.log('searchPostRank, filterOpt:', filterOpt, ' orderOpt:', orderOpt)
      const res = await filterArticle(filterOpt, orderOpt)
      return ctx.body = {
        code: 0,
        message: '查询社区热帖排行榜前十成功',
        result: {
          article_list: res.rows
        }
      }
    } catch (err) {
      console.error(err, searchError)
      return ctx.app.emit('error', searchError, ctx);
    }
  }

  /**
   * @description: 获取各状态文章数
   * 获取已发布文章数、违规被屏蔽文章数、回收站文章数、待审核文章数
   */
  async searchStatusCount(ctx, next) {
    const res = {}
    try {
      res.post_cnt = await countArticle({ status:0 })
      res.shield_cnt = await countArticle({ status:1 })
      res.deleted_cnt = await countArticle({ status:2 })
      res.pending_cnt = await countArticle({ status:3 })
      return ctx.body = {
        code: 0,
        message: '获取各状态文章数成功',
        result: res
      }
    } catch (err) {
      console.error('获取各状态文章数失败！', err, searchError)
      return ctx.app.emit('error', searchError, ctx);
    }
  }
}
module.exports = new searchController()