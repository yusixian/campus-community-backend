/*
 * @Author: cos
 * @Date: 2022-02-18 15:10:21
 * @LastEditTime: 2022-02-24 15:49:15
 * @LastEditors: cos
 * @Description: 文章相关中间件
 * @FilePath: \campus-community-backend\src\middleware\article.middleware.js
 */
const { articleParamsError, articleIDError, articleDosNotExist, partitionIsNotExitedErr } = require('../constant/err.type');
const { searchArticleByID } = require('../service/article.service');
const { selectPartitionCountById } = require('../service/partition.service');


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
  if(!article_id) 
    return ctx.app.emit('error', articleIDError, ctx);

  let id = parseInt(article_id) // 转换为数字
  if(id !== id)   // 判断NaN
    return ctx.app.emit('error', articleIDError, ctx);
  ctx.state.article_id = id
  await next()
}

// 验证该文章必须存在 没问题则将找到的文章挂到ctx.state上
// 存在定义为没有被软删除, 屏蔽也算存在
const articleExistValidate = async (ctx, next) => {
  const article_id = ctx.state.article_id
  const res = await searchArticleByID(article_id, true)
  // console.log(`searchID ${article_id}:`, res);
  if(!res) {
    return ctx.app.emit('error', articleDosNotExist, ctx);
  }
  ctx.state.article = res
  await next()
}

module.exports = {
  articleInfoValidate,
  articleIDValidate,
  articleExistValidate
}