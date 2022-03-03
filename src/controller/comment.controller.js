/*
 * @Author: lihao
 * @Date: 2022-02-21 14:54:26
 * @LastEditors: lihao
 * @LastEditTime: 2022-03-03 16:26:03
 * @FilePath: \campus-community-backend\src\controller\comment.controller.js
 * @Description: 评论的控制器
 * 
 */

const { createComment, delCommentById, restoreCommentById, selectCommentByArticleId, delCommentBatchByIds, selectCommentCountByAid } = require('../service/comment.service')

const { commentCreateError, commentDeleteFailedError, unAuthorizedError, commentSelectByArticleIdFailedError, commentSelectCountError, commentSelectFailedByArticleError } = require('../constant/err.type')

const { getUserInfo } = require('../service/user.service')

const { searchArticleByID } = require('../service/article.service')

const { selectCommentReplyByCommentId } = require('../service/commentReply.service')

const { getLikeRecordByInfo, countLikeByTargetID } = require('../service/like.service')

class CommentContrller {
  /**
   * 新增评论
   * @param {*} ctx 
   * @param {*} next 
   */
  async inserComment(ctx, next) {
    // TODO 
    const { comment_content, article_id } = ctx.request.body;
    try {
      const res = await createComment(comment_content, ctx.state.user.id, article_id)
      ctx.body = {
        code: 0,
        message: "评论成功",

      }
    } catch (err) {
      ctx.app.emit('error', commentCreateError, ctx)
    }
  }
  /**
   * 软删除评论
   * @param {*} ctx 
   * @param {*} next 
   */
  async deleleComment(ctx, next) {

    const { id } = ctx.request.query
    try {
      const res = await delCommentById(id)
      ctx.body = {
        code: 0,
        message: '删除评论成功',

      }
    } catch {
      ctx.app.emit('error', commentDeleteFailedError, ctx)
    }
  }
  /**
   * 恢复评论
   * @param {*} ctx 
   * @param {*} next 
   */
  async restoreComment(ctx, next) {
    if (!ctx.state.user.is_admin) { //管理员权限可以恢复评论
      ctx.app.emit('error', unAuthorizedError, ctx)
      return
    }
    const { id } = ctx.request.query
    try {
      const res = await restoreCommentById(id)
      ctx.body = {
        code: 0,
        message: '恢复评论成功',

      }
    } catch (err) {
      console.log(err);
      ctx.app.emit('error', commentDeleteFailedError, ctx)
    }
  }
  /**
   * 根据文章id查询评论(需要登录)
   * @param {*} ctx 
   * @param {*} next 
   */
  async queryCommentByArticleId(ctx, next) {
    let { id, pageNo, pageSize } = ctx.request.query
    if (!pageNo) {
      pageNo = 1
    }
    if (!pageSize) {
      pageSize = 10
    }
    try {
      if (!ctx.state.user.is_admin) {
        let article = await searchArticleByID(id, true, true)
        if (article.status != 0 || article.deletedAt != null) {
          ctx.app.emit('error', commentSelectFailedByArticleError, ctx)
          return
        }
      }
      let comment_res = await selectCommentByArticleId(id, pageNo, pageSize)
      const userList = new Array()
      for (let index = 0; index < comment_res.length; index++) { // 遍历文章评论数组
        let comment_reply_res = await selectCommentReplyByCommentId(comment_res[index].id)
        let c_uid = comment_res[index].user_id // 获取评论者的id
        let c_userinfo = await getUserInfo({ c_uid })
        if (!userList[`${c_uid}s`]) { // 做用户信息的缓存处理减少数据库的查询次数
          c_userinfo = await getUserInfo({ c_uid })
          userList[`${c_uid}s`] = c_userinfo
        } else {
          c_userinfo = userList[`${c_uid}s`]
        }
        let comment_isGood = await getLikeRecordByInfo({ user_id: ctx.state.user.id, type: 'comment', comment_id: comment_res[index].id })

        let comment_good = await countLikeByTargetID(comment_res[index].id, 'comment')

        for (let j = 0; j < comment_reply_res.length; j++) { // 遍历评论回复数组
          let f_uid = comment_reply_res[j].from_user_id // 获取回复者的id
          let t_uid = comment_reply_res[j].to_user_id  // 获取目标用户的id
          let f_userinfo = null // 回复者的信息
          let t_userinfo = null // 目标用户的信息
          if (!userList[`${f_uid}s`]) { // 做用户信息的缓存处理减少数据库的查询次数
            f_userinfo = await getUserInfo({ f_uid })
            userList[`${f_uid}s`] = f_userinfo
          } else {
            f_userinfo = userList[`${f_uid}s`]
          }
          if (!userList[`${t_uid}s`]) { //同理
            t_userinfo = await getUserInfo({ t_uid })
            userList[`${t_uid}s`] = t_userinfo
          } else {
            t_userinfo = userList[`${t_uid}s`]
          }
          let comment_reply_isGood = await getLikeRecordByInfo({ user_id: ctx.state.user.id, type: 'comment_reply', comment_reply_id: comment_reply_res[j].id })

          let comment_reply_good = await countLikeByTargetID(comment_reply_res[j].id, 'comment_reply')

          comment_reply_res[j].dataValues.from_user = { // 回复者信息
            avatar: f_userinfo.img,
            name: f_userinfo.user_name
          }
          comment_reply_res[j].dataValues.to_user = { // 目标用户信息
            avatar: t_userinfo.img,
            name: t_userinfo.user_name
          }
          comment_reply_res[j].dataValues.reply_good = comment_reply_good
          if (comment_reply_isGood != null) {
            comment_reply_res[j].dataValues.reply_isGood = Object.keys(comment_reply_isGood).length > 0
          } else {
            comment_reply_res[j].dataValues.reply_isGood = false
          }
        }
        comment_res[index].dataValues.comment_good = comment_good
        if (comment_isGood != null) {
          comment_res[index].dataValues.comment_isGood = Object.keys(comment_isGood).length > 0
        } else {
          comment_res[index].dataValues.comment_isGood = false
        }
        comment_res[index].dataValues.comment_user = { // 评论者信息
          avatar: c_userinfo.img,
          name: c_userinfo.user_name
        }
        comment_res[index].dataValues.reply_list = comment_reply_res
      }
      ctx.body = {
        code: 0,
        message: '查询评论成功',
        result: comment_res
      }
    } catch (err) {
      console.log(err);
      ctx.app.emit('error', commentSelectByArticleIdFailedError, ctx)
    }
  }
  /**
   * 未登录用户查询评论结果的接口
   * @param {*} id 文章id
   * @param {*} pageNo 页数
   * @param {*} pageSize 数据条数
   */
  async queryCommentByArticleIdNoAuth(ctx, next) {
    let { id, pageNo, pageSize } = ctx.request.query
    if (!pageNo) {
      pageNo = 1
    }
    if (!pageSize) {
      pageSize = 10
    }
    try {
      let article = await searchArticleByID(id, true, true)
      if (article.status != 0 || article.deletedAt != null) {
        ctx.app.emit('error', commentSelectFailedByArticleError, ctx)
        return
      }
      let comment_res = await selectCommentByArticleId(id, pageNo, pageSize)
      const userList = new Array()
      for (let index = 0; index < comment_res.length; index++) { // 遍历文章评论数组
        let comment_reply_res = await selectCommentReplyByCommentId(comment_res[index].id)
        let c_uid = comment_res[index].user_id // 获取评论者的id
        let c_userinfo = await getUserInfo({ c_uid })
        if (!userList[`${c_uid}s`]) { // 做用户信息的缓存处理减少数据库的查询次数
          c_userinfo = await getUserInfo({ c_uid })
          userList[`${c_uid}s`] = c_userinfo
        } else {
          c_userinfo = userList[`${c_uid}s`]
        }
        let comment_isGood = null
        let comment_good = await countLikeByTargetID(comment_res[index].id, 'comment')

        for (let j = 0; j < comment_reply_res.length; j++) { // 遍历评论回复数组
          let f_uid = comment_reply_res[j].from_user_id // 获取回复者的id
          let t_uid = comment_reply_res[j].to_user_id  // 获取目标用户的id
          let f_userinfo = null // 回复者的信息
          let t_userinfo = null // 目标用户的信息
          if (!userList[`${f_uid}s`]) { // 做用户信息的缓存处理减少数据库的查询次数
            f_userinfo = await getUserInfo({ f_uid })
            userList[`${f_uid}s`] = f_userinfo
          } else {
            f_userinfo = userList[`${f_uid}s`]
          }
          if (!userList[`${t_uid}s`]) { //同理
            t_userinfo = await getUserInfo({ t_uid })
            userList[`${t_uid}s`] = t_userinfo
          } else {
            t_userinfo = userList[`${t_uid}s`]
          }
          let comment_reply_isGood = null
          let comment_reply_good = await countLikeByTargetID(comment_reply_res[j].id, 'comment_reply')

          comment_reply_res[j].dataValues.from_user = { // 回复者信息
            avatar: f_userinfo.img,
            name: f_userinfo.user_name
          }
          comment_reply_res[j].dataValues.to_user = { // 目标用户信息
            avatar: t_userinfo.img,
            name: t_userinfo.user_name
          }
          comment_reply_res[j].dataValues.reply_good = comment_reply_good
          if (comment_reply_isGood != null) {
            comment_reply_res[j].dataValues.reply_isGood = Object.keys(comment_reply_isGood).length > 0
          } else {
            comment_reply_res[j].dataValues.reply_isGood = false
          }
        }
        comment_res[index].dataValues.comment_good = comment_good
        if (comment_isGood != null) {
          comment_res[index].dataValues.comment_isGood = Object.keys(comment_isGood).length > 0
        } else {
          comment_res[index].dataValues.comment_isGood = false
        }
        comment_res[index].dataValues.comment_user = { // 评论者信息
          avatar: c_userinfo.img,
          name: c_userinfo.user_name
        }
        comment_res[index].dataValues.reply_list = comment_reply_res
      }
      ctx.body = {
        code: 0,
        message: '查询评论成功',
        result: comment_res
      }

    } catch (err) {
      console.log(err);
      ctx.app.emit('error', commentSelectByArticleIdFailedError, ctx)
    }
  }
  /**
   * 通过文章id批量删除评论
   * @param {*} ctx 
   * @param {*} next 
   */
  async delBatchCommentByIds(ctx, next) {
    const { ids } = ctx.request.query
    try {
      const res = await delCommentBatchByIds(ids)
      ctx.body = {
        code: 0,
        message: '删除评论成功',
        result: res //被删除的评论数量
      }
    } catch (err) {
      console.log(err);
      ctx.app.emit('error', commentDeleteFailedError, ctx)
    }
  }
  /**
   * 通过文章id查询评论数量
   * @param {*} ctx 
   * @param {*} next 
   */
  async queryCommentCountByAid(ctx, next) {
    const { id } = ctx.request.query
    try {
      const res = await selectCommentCountByAid(id)
      ctx.body = {
        code: 0,
        message: '文章评论数量查询成功',
        result: {
          commentCount: res
        }
      }
    } catch (err) {
      console.log(err);
      ctx.app.emit('error', commentSelectCountError, ctx)
    }
  }

}

module.exports = new CommentContrller()

