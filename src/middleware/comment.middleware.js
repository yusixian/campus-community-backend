/*
 * @Author: lihao
 * @Date: 2022-02-21 14:52:58
 * @LastEditors: lihao
 * @LastEditTime: 2022-02-21 17:09:51
 * @FilePath: \campus-community-backend\src\middleware\comment.middleware.js
 * @Description: 评论的中间件
 * 
 */

const { } = require('../service/comment.service')

const { commentCreateInfoFormateError, commentIdFormateError } = require('../constant/err.type')

/**
 * 判断评论是否合法
 * @param {*} ctx 
 * @param {*} next 
 * @returns 
 */
const commentValidator = async (ctx, next) => {
  const { comment_content, article_id } = ctx.request.body
  console.log(comment_content, article_id);

  // 合法性
  if (!comment_content || !article_id) {
    ctx.app.emit('error', commentCreateInfoFormateError, ctx)
    return
  }
  await next()
}
/**
 * 判断是否传递删除的id
 * @param {*} ctx 
 * @param {*} next 
 */
const commentDeleteValidator = async (ctx, next) => {
  const { id } = ctx.request.query
  if (!id) {
    ctx.app.emit('error', commentIdFormateError, ctx)
    return
  }
  await next()
}

module.exports = {
  commentValidator,
  commentDeleteValidator
}


