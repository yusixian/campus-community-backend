/*
 * @Author: cos
 * @Date: 2022-02-18 15:10:21
 * @LastEditTime: 2022-03-05 20:40:51
 * @LastEditors: cos
 * @Description: 文章相关中间件
 * @FilePath: \campus-community-backend\src\middleware\article.middleware.js
 */
const { articleParamsError, articleIDError, articleDosNotExist, partitionIsNotExitedErr, articleFilterParamsError } = require('../constant/err.type');
const { searchArticleByID } = require('../service/article.service');
const { selectPartitionCountById } = require('../service/partition.service');
const moment = require('moment');
const { checkID } = require('../utils/checkUtil');


// 验证发表文章信息合法性(必须传递必选参数)
const articleInfoValidate = async (ctx, next) => {
  const { title, content, partition_id } = ctx.request.body;
  // console.log(title, content, partition_id)
  if(!title || !content) 
    return ctx.app.emit('error', articleParamsError, ctx);
  ctx.state.newArticle = { title, content } 
  if(partition_id) {
    // 根据分区id判断分区是否存在
    if(!await selectPartitionCountById(partition_id))
      return ctx.app.emit('error', partitionIsNotExitedErr, ctx)
    ctx.state.newArticle.partition_id = partition_id
  }
  // console.log("articleInfoValidate:",ctx.state.newArticle)
  await next()
}

// 验证文章id必须存在
const articleIDValidate = async (ctx, next) => {
  const article_id = ctx.request.body.article_id || ctx.request.query.article_id;
  // console.log("typeof: ",typeof article_id)
  if(!article_id) 
    return ctx.app.emit('error', articleIDError, ctx);
  let id = checkID(article_id)
  if(!id) return ctx.app.emit('error', articleIDError, ctx);
  ctx.state.article_id = id
  await next()
}

// 验证该文章必须存在 没问题则将找到的文章挂到ctx.state上
// 存在定义为没有被软删除, 屏蔽/待审核也算存在
const articleExistValidate = async (ctx, next) => {
  const article_id = ctx.state.article_id
  const res = await searchArticleByID(article_id, true, false, true)
  // console.log(`searchID ${article_id}:`, res);
  if(!res) {
    return ctx.app.emit('error', articleDosNotExist, ctx);
  }
  ctx.state.article = res
  await next()
}

// 验证文章过滤参数，将已传的参数判断合法性后挂到ctx.state.filterOpt上
// status、partition_id、开始结束时间等
const articleFilterValidate = async (ctx, next) => {
  // console.log(ctx.request.query)
  let { current, size, status, partition_id, start_time, end_time, user_id } = ctx.request.query
  ctx.state.filterOpt = {}
  const filterOpt = ctx.state.filterOpt
  try {
    if(current) filterOpt.current = parseInt(current)
    if(size) filterOpt.size = parseInt(size)
    if(partition_id) filterOpt.partition_id = parseInt(partition_id)
    if(user_id) filterOpt.user_id = parseInt(user_id)

    if(moment(start_time).isValid()) filterOpt.start_time = start_time
    if(moment(end_time).isValid()) filterOpt.end_time = end_time
    
    // console.log(`start_time:${start_time},end_time:${end_time}`)
    if(status) status = parseInt(status)
    if(status in [0,1,2,3]) Object.assign(filterOpt, { status });
    // console.log("filterOpt:", filterOpt)
  } catch(err) {
    console.error('error!', articleFilterParamsError)
    return ctx.app.emit('error', articleFilterParamsError, ctx);
  }
  await next()
}
module.exports = {
  articleInfoValidate,
  articleIDValidate,
  articleExistValidate,
  articleFilterValidate
}