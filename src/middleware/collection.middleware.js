/*
 * @Author: cos
 * @Date: 2022-03-02 11:56:43
 * @LastEditTime: 2022-03-05 20:41:03
 * @LastEditors: cos
 * @Description: 收藏相关中间件
 * @FilePath: \campus-community-backend\src\middleware\collection.middleware.js
 */
const { collectionParamsError, collectionRepeatError, collectionIdError, collectionDosNotExistError, collectionOwnError } = require("../constant/err.type");
const { isRepeatCollection, getCollectionRecordByID, getCollectionRecordByInfo } = require("../service/collection.service");
const checkUtil = require("../utils/checkUtil");

// 验证收藏信息user_id, article_id有效性，并进行相应处理后挂上ctx.state.newCollection
const collectionInfoValidate = async(ctx, next) => {
  // console.log("body:", ctx.request.body)
  const user_id = ctx.state.user && ctx.state.user.id;
  // console.log("user_id：", user_id)
  const a_id = ctx.request.body.article_id || ctx.request.query.article_id;
  try {
    const article_id = checkUtil.checkID(a_id)
    if(!article_id) 
      throw Error("article_id不合法！")
    ctx.state.newCollection = {}
    const newCollection =  ctx.state.newCollection
    user_id && Object.assign(newCollection, { user_id })
    article_id && Object.assign(newCollection, { article_id })
    await next()
  } catch(err) {
    console.error(err, collectionParamsError)
    return ctx.app.emit('error', collectionParamsError, ctx);
  }
}

// 验证收藏记录是否重复
const collectionNoExistValidate = async(ctx, next) => {
  const newCollection = ctx.state.newCollection
  const { user_id, article_id } = newCollection
  try {
    const isRepeat = await isRepeatCollection(user_id, article_id)
    if(isRepeat) throw Error()
    await next()
  } catch(err) {
    console.error('无法重复收藏！', collectionRepeatError);
    return ctx.app.emit('error', collectionRepeatError, ctx)
  }
}

// 验证收藏记录的id有效性并挂到ctx.state.collection_id上
const collectionIDValidate = async(ctx, next) => {
  const collection_id = ctx.request.body.collection_id || ctx.request.query.collection_id;
  // console.log("collectionIDValidate:", collection_id)
  try {
    const id = checkUtil.checkID(collection_id)
    if(!id) 
      throw Error("collection_id不合法！")
    ctx.state.collection_id = id
    await next()
  } catch(err) {
    console.error('collection_id不合法！', collectionIdError);
    return ctx.app.emit('error', collectionIdError, ctx)
  }
}

// 验证该收藏记录必须存在 并将存在的收藏记录挂到ctx.state.existCollection上
const collectionExistValidate = async (ctx, next) => {
  const collection_id = ctx.state.collection_id
  // console.log(collection_id)
  try {
    const res = await getCollectionRecordByID(collection_id)
    if(!res) throw Error('数据库中不存在该收藏记录')
    ctx.state.existCollection = res
    await next()
  } catch(err) {
    console.error(err, collectionDosNotExistError)
    return ctx.app.emit('error', collectionDosNotExistError, ctx);
  }
}

// 验证该收藏记录必须为当前用户的，不会取消别人的，并将待取消收藏记录挂到ctx.state.existCollection上
const collectionOwnValidate = async (ctx, next) => {
  const newCollection = ctx.state.newCollection
  const { user_id, article_id } = newCollection
  try {
    ctx.state.existCollection = await getCollectionRecordByInfo(user_id, article_id)
    // console.log("exist:", ctx.state.existCollection)
    if(!ctx.state.existCollection)  {
      console.error(collectionDosNotExistError)
      return ctx.app.emit('error', collectionDosNotExistError, ctx);
    }
    // console.log('验证成功！', ctx.state.existCollection)
    await next()
  } catch(err) {
    console.error('操作失败！不是自己的收藏！', collectionOwnError);
    return ctx.app.emit('error', collectionOwnError, ctx)
  }
}
module.exports = {
  collectionInfoValidate,
  collectionNoExistValidate,
  collectionIDValidate,
  collectionExistValidate,
  collectionOwnValidate
}