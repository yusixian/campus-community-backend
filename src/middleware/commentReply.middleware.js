/*
 * @Author: lihao
 * @Date: 2022-02-24 17:05:34
 * @LastEditors: lihao
 * @LastEditTime: 2022-03-04 15:26:29
 * @FilePath: \campus-community-backend\src\middleware\commentReply.middleware.js
 * @Description: 评论回复的中间件
 */

const { commentReplyValidatorError, commentReplyIdFormateError, commentReplyDataTypeError } = require('../constant/err.type')

/**
 * 进行回复数据验证的中间件（除回复目标id）
 * @param {*} ctx 
 * @param {*} next 
 * @returns 
 */
const commentReplyValidator = async (ctx, next) => {
  const {comment_id, comment_reply_content, to_user_id, } = ctx.request.body
  // 数据合法性
  if (!comment_id || !comment_reply_content || !to_user_id) {
    ctx.app.emit('error', commentReplyValidatorError, ctx)
    return
  }
  if (typeof(comment_id) == "number" && typeof(to_user_id) == "number") {
    await next()
  }else {
    ctx.app.emit('error', commentReplyDataTypeError, ctx)
    return
  }
}

/**
 * 判断是否传递id
 * @param {*} ctx 
 * @param {*} next 
 */
 const commentReplyDeleteValidator = async (ctx, next) => {
  const { id } = ctx.request.query
  let comment_reply_id = Number.parseInt(id)
  if (!id) {
    ctx.app.emit('error', commentReplyIdFormateError, ctx)
    return
  }
  ctx.request.query.id = comment_reply_id
  await next()
}

module.exports = {
  commentReplyValidator,
  commentReplyDeleteValidator
}