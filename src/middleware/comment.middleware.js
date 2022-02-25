/*
 * @Author: lihao
 * @Date: 2022-02-21 14:52:58
 * @LastEditors: lihao
 * @LastEditTime: 2022-02-25 10:56:30
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

  // 合法性
  if (!comment_content || !article_id) {
    ctx.app.emit('error', commentCreateInfoFormateError, ctx)
    return
  }
  await next()
}
/**
 * 判断是否传递id
 * @param {*} ctx 
 * @param {*} next 
 */
const commentDeleteValidator = async (ctx, next) => {
  const { id } = ctx.request.query
  let comment_id = Number.parseInt(id)
  if (!id) {
    ctx.app.emit('error', commentIdFormateError, ctx)
    return
  }
  ctx.request.query.id = comment_id
  await next()
}
/**
 * 判断批量的评论是否合法
 * @param {*} ctx 
 * @param {*} next 
 * @returns 
 */
const commentDeleteBatchValidator = async (ctx, next) => {
  const {ids} = ctx.request.query
  let comment_ids = ids.map(item => {
    return Number.parseInt(item)
  })
  if (!comment_ids.length) {
    ctx.app.emit('error', commentIdFormateError, ctx)
    return
  }
  ctx.request.query.ids = comment_ids
  await next()
}

module.exports = {
  commentValidator,
  commentDeleteValidator,
  commentDeleteBatchValidator
}


