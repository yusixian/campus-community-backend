/*
 * @Author: cos
 * @Date: 2022-02-25 14:08:14
 * @LastEditTime: 2022-03-05 20:41:26
 * @LastEditors: cos
 * @Description: 点赞管理中间件
 * @FilePath: \campus-community-backend\src\middleware\like.middleware.js
 */
const { likeParamsError, likeRepeatError, likeIdError, likeDosNotExistError, likeOwnError } = require("../constant/err.type");
const { isRepeatLike: isRepeatLike, getLikeRecordByID, getLikeRecordByInfo, getNewLike } = require("../service/like.service");
const checkUtil = require("../utils/checkUtil");

// 验证点赞信息target_id、type有效性，并进行相应处理后挂上ctx.state.newLike
const likeInfoValidate = async(ctx, next) => {
  // console.log(ctx.request.body)

  const t_id = ctx.request.body.target_id || ctx.request.query.target_id;
  const type = ctx.request.body.type || ctx.request.query.type;
  try {
    const target_id = checkUtil.checkID(t_id)
    if(!target_id) 
      throw Error("target_id不合法！")
    const targetLike = { type, target_id }
    ctx.state.newLike = getNewLike(targetLike)
    const newLike = ctx.state.newLike
    if(ctx.state.user) newLike.user_id = ctx.state.user.id
    // console.log("newLike:", newLike)
    await next()
  } catch(err) {
    console.error(err, likeParamsError)
    return ctx.app.emit('error', likeParamsError, ctx);
  }
}

// 验证点赞记录是否重复
const likeNoExistValidate = async(ctx, next) => {
  const newLike = ctx.state.newLike
  try {
    const isRepeat = await isRepeatLike(newLike)
    if(isRepeat) throw Error()
    await next()
  } catch(err) {
    console.error('无法重复点赞！', likeRepeatError);
    return ctx.app.emit('error', likeRepeatError, ctx)
  }
}

// 验证点赞记录的id有效性并挂到ctx.state.like_id上
const likeIDValidate = async(ctx, next) => {
  const l_id = ctx.request.body.like_id || ctx.request.query.like_id;
  // console.log("likeIDValidate:", like_id)
  try {
    const like_id = checkUtil.checkID(l_id)
    if(!like_id) 
      throw Error("like_id不合法！")
    ctx.state.like_id = like_id
    await next()
  } catch(err) {
    console.error('id不合法！', likeIdError);
    return ctx.app.emit('error', likeIdError, ctx)
  }
}

// 验证该点赞记录必须存在 并将存在的点赞记录挂到ctx.state.existLike上
const likeExistValidate = async (ctx, next) => {
  const like_id = ctx.state.like_id
  // console.log(like_id)
  try {
    const res = await getLikeRecordByID(like_id)
    // console.log(`searchID ${article_id}:`, res);
    if(!res) throw Error('数据库中不存在该点赞记录')
    ctx.state.existLike = res
    await next()
  } catch(err) {
    console.error(err, likeDosNotExistError)
    return ctx.app.emit('error', likeDosNotExistError, ctx);
  }
}

// 验证该点赞记录必须为当前用户的，不会取消别人的，并将待取消点赞记录挂到ctx.state.existLike上
const likeOwnValidate = async (ctx, next) => {
  const newLike = ctx.state.newLike
  try {
    ctx.state.existLike = await getLikeRecordByInfo(newLike)
    // console.log(ctx.state.existLike)
    if(!ctx.state.existLike)  {
      // console.log(likeDosNotExistError)
      return ctx.app.emit('error', likeDosNotExistError, ctx);
    }
    // console.log('验证成功！', ctx.state.existLike)
    await next()
  } catch(err) {
    console.error('操作失败！不是自己的点赞！', likeOwnError);
    return ctx.app.emit('error', likeOwnError, ctx)
  }
}

// 验证统计点赞数信息target_id、type、user_id，都为可选参数，并进行相应处理后挂上ctx.state.filterOpt
const likeCountParamsValidate = async(ctx, next) => {
  // console.log(ctx.request.body)

  const t_id = ctx.request.body.target_id || ctx.request.query.target_id;
  const u_id = ctx.request.body.user_id || ctx.request.query.user_id;
  const type = ctx.request.body.type || ctx.request.query.type;
  try {
    ctx.state.filterOpt = {}
    const filterOpt = ctx.state.filterOpt
    filterOpt.type = type || 'article';
    if(t_id) {
      const target_id = checkUtil.checkID(t_id)
      if(!target_id) 
        throw Error("target_id不合法！")
        filterOpt.target_id = target_id
    }
    if(u_id) {
      const user_id = checkUtil.checkID(u_id)
      if(!user_id) 
        throw Error("user_id不合法！")
        filterOpt.user_id = user_id
    }
    await next()
  } catch(err) {
    console.error(err, likeParamsError)
    return ctx.app.emit('error', likeParamsError, ctx);
  }
}
module.exports = {
  likeInfoValidate,
  likeNoExistValidate,
  likeIDValidate,
  likeExistValidate,
  likeOwnValidate,
  likeCountParamsValidate
}