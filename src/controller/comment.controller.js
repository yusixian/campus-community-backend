/*
 * @Author: lihao
 * @Date: 2022-02-21 14:54:26
 * @LastEditors: lihao
 * @LastEditTime: 2022-02-25 16:13:06
 * @FilePath: \campus-community-backend\src\controller\comment.controller.js
 * @Description: 评论的控制器
 * 
 */

const { createComment, delCommentById, restoreCommentById, selectCommentByArticleId, delCommentBatchByIds } = require('../service/comment.service')

const { commentCreateError, commentDeleteFailedError, unAuthorizedError, commentSelectByArticleIdFailedError } = require('../constant/err.type')

const { selectCommentReplyByCommentId } = require('../service/commentReply.service')
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
   * 根据文章id查询评论
   * @param {*} ctx 
   * @param {*} next 
   */
  async queryCommentByArticleId(ctx, next) {
    const { id } = ctx.request.query
    try {
      let comment_res = await selectCommentByArticleId(id)
      for (let index = 0; index < comment_res.length; index++) {
        let comment_reply_res = await selectCommentReplyByCommentId(comment_res[index].id)
        console.log(comment_res[index]);
        comment_res[index].dataValues.reply = comment_reply_res
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

}

module.exports = new CommentContrller()

