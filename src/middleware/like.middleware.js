const { likeParamsError, likeRepeatError, likeIdError, likeDosNotExistError } = require("../constant/err.type");
const { validateLike, getLikeRecordByID } = require("../service/like.service");

/*
 * @Author: cos
 * @Date: 2022-02-25 14:08:14
 * @LastEditTime: 2022-02-25 17:12:55
 * @LastEditors: cos
 * @Description: 点赞管理中间件
 * @FilePath: \campus-community-backend\src\middleware\like.middleware.js
 */
const likeInfoValidate = async(ctx, next) => {
  console.log(ctx.request.body)

  const target_id = ctx.request.body.target_id || ctx.request.query.target_id;
  const type = ctx.request.body.type || ctx.request.query.type;

  ctx.state.newLike = {}
  const newLike = ctx.state.newLike
  try {
    if(!target_id) throw Error('target_id不存在！')
    let id = parseInt(target_id) // 转换为数字
    if(id !== id) // id为NaN
      throw Error('target_id为NaN!')

    if(type === "comment") 
      Object.assign(newLike, { 
        type: "comment", 
        comment_id:target_id 
      })
    else 
      Object.assign(newLike, { article_id: target_id })
      
    newLike.user_id = ctx.state.user.id
    // console.log("newLike:", newLike)
    await next()
  } catch(err) {
    console.error(err, likeParamsError)
    return ctx.app.emit('error', likeParamsError, ctx);
  }
}

/**
 * @description: 验证点赞记录是否重复
 */
const likeNoExistValidate = async(ctx, next) => {
  const newLike = ctx.state.newLike
  try {
    const isValid = await validateLike(newLike)
    if(!isValid) throw Error()
    await next()
  } catch(err) {
    console.error('无法重复点赞！', likeRepeatError);
    return ctx.app.emit('error', likeRepeatError, ctx)
  }
}
const likeIDValidate = async(ctx, next) => {
  const like_id = ctx.request.body.like_id || ctx.request.query.like_id;
  try {
    if(!like_id) 
      throw Error('like_id不存在')
    let id = parseInt(like_id) // 转换为数字
    if(id !== id)   // 判断NaN
      throw Error('like_id为NaN！')
    ctx.state.like_id = id
    await next()
    // console.log(ctx.state)
  } catch(err) {
    console.log(err, likeIdError)
    return ctx.app.emit('error', likeIdError, ctx)
  }
}

// 验证该点赞记录必须存在 将存在的点赞记录挂到ctx.state上
const likeExistValidate = async (ctx, next) => {
  const like_id = ctx.state.like_id
  try {
    const res = await getLikeRecordByID(like_id)
    // console.log(`searchID ${article_id}:`, res);
    if(!res) throw Error('数据库中不存在该点赞记录')
    ctx.state.newLike = res
    await next()
  } catch(err) {
    console.log(err, likeDosNotExistError)
    return ctx.app.emit('error', likeDosNotExistError, ctx);
  }
}
module.exports = {
  likeInfoValidate,
  likeNoExistValidate,
  likeIDValidate,
  likeExistValidate
}