/*
 * @Author: 41
 * @Date: 2022-03-03 17:36:00
 * @LastEditors: 41
 * @LastEditTime: 2022-03-06 21:17:11
 * @Description: 
 */
const { followedError } = require('../constant/err.type')
const { getFollowInfo } = require('../service/follow.service')
/**
 * @description: 是否关注的中间件
 * @param1 {*}
 * @return {*}
 * @detail: 
 * @param {*} ctx
 * @param {*} next
 */
const iffollow = async (ctx, next) => {
  const user_id = ctx.state.user.id
  const { follow_id } = ctx.request.body
  // const { follow_id } = ctx.request.body
  let res = await getFollowInfo({ user_id })
  // console.log(res);
  for (let i = 0; i < res.length; i++) {
    if (res[i].follow_id == follow_id) {
      return ctx.app.emit('error', followedError, ctx)
    }
  }
  await next()
}
module.exports = {
  iffollow
}