/*
 * @Author: lihao
 * @Date: 2022-02-24 19:19:57
 * @LastEditors: lihao
 * @LastEditTime: 2022-03-04 15:35:47
 * @FilePath: \campus-community-backend\src\controller\commentReply.controller.js
 * @Description: 评论回复控制器
 */
const { createCommentReply, deleteCommentReply } = require('../service/commentReply.service')

const { commentReplyAddError, commentReplyDelError } = require('../constant/err.type')

class CommentReply {
  /**
   * 新增评论回复
   * @param {*} ctx 
   * @param {*} next 
   */
  async insertCommentReply(ctx, next) {
    let { comment_id, comment_reply_id, comment_reply_content, to_user_id } = ctx.request.body
    console.log(comment_id, comment_reply_id, comment_reply_content, ctx.state.user.id, to_user_id)
    
    try {
      const res = await createCommentReply(comment_id, comment_reply_id, comment_reply_content, ctx.state.user.id, to_user_id)
      ctx.body = {
        code: 0,
        message: "评论回复成功"
      }
    } catch (err) {
      // console.log(err);
      ctx.app.emit('error', commentReplyAddError, ctx)
    }
  }
  /**
   * 删除评论回复
   * @param {*} ctx 
   * @param {*} next 
   */
  async deleteCommentReply(ctx, next) {
    const {id} = ctx.request.query
    try {
      const res = await deleteCommentReply(id)
      ctx.body = {
        code: 0,
        message: '评论回复删除成功'
      }
    } catch (err) {
      console.log(err);
      ctx.app.emit('error', commentReplyDelError, ctx)
    }
  }
}

module.exports = new CommentReply()