/*
 * @Author: lihao
 * @Date: 2022-02-24 17:05:34
 * @LastEditors: lihao
 * @LastEditTime: 2022-02-25 15:11:10
 * @FilePath: \campus-community-backend\src\middleware\commentReply.middleware.js
 * @Description: 评论回复的中间件
 */

const { commentReplyValidatorError, commentReplyIdFormateError } = require('../constant/err.type')

/**
 * 进行回复数据验证的中间件（除回复目标id）
 * @param {*} ctx 
 * @param {*} next 
 * @returns 
 */
const commentReplyValidator = async (ctx, next) => {
  const {comment_id, comment_reply_content, to_user_id} = ctx.request.body
  // 数据合法性
  if (!comment_id || !comment_reply_content || !to_user_id) {
    ctx.app.emit('error', commentReplyValidatorError, ctx)
    return
  }
  await next()
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