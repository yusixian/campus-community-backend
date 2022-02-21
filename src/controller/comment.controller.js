/*
 * @Author: lihao
 * @Date: 2022-02-21 14:54:26
 * @LastEditors: lihao
 * @LastEditTime: 2022-02-21 18:05:32
 * @FilePath: \campus-community-backend\src\controller\comment.controller.js
 * @Description: 评论的控制器
 * 
 */

const { createComment, delCommentById, restoreCommentById, selectCommentByArticleId } = require('../service/comment.service')

const { commentCreateError, commentDeleteFailedError, unAuthorizedError, commentSelectByArticleIdFailedError } = require('../constant/err.type')
class CommentContrller {
  /**
   * 新增评论
   * @param {*} ctx 
   * @param {*} next 
   */
  async inserComment(ctx, next) {
    // TODO 
    const { comment_content, article_id } = ctx.request.body;
    console.log(comment_content, article_id, ctx.state.user.id);
    try {
      const res = await createComment(comment_content, ctx.state.user.id, article_id)
      ctx.body = {
        code: 0,
        message: "评论成功",
        result: ''
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
        result: ''
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
    console.log(ctx.state.user);
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
        result: ''
      }
    } catch {
      ctx.app.emit('error', commentDeleteFailedError, ctx)
    }
  }
  /**
   * 根据文章id查询评论
   * @param {*} ctx 
   * @param {*} next 
   */
  async queryCommentByArticleId(ctx, next) {
    const {id} = ctx.request.query
    try {
      const res = await selectCommentByArticleId(id)
      console.log(res);
      ctx.body = {
        code: 0,
        message: '查询评论成功',
        result: res
      }
    } catch {
      ctx.app.emit('error', commentSelectByArticleIdFailedError, ctx)
    }
  }

}

module.exports = new CommentContrller()

