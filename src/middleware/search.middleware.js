/*
 * @Author: cos
 * @Date: 2022-03-03 23:01:37
 * @LastEditTime: 2022-03-03 23:09:50
 * @LastEditors: cos
 * @Description: 搜索相关中间件
 * @FilePath: \campus-community-backend\src\middleware\search.middleware.js
 */
const { searchError } = require("../constant/err.type");
const checkUtil = require("../utils/checkUtil");
const searchInfoValidate = async(ctx, next) => {
  const id = ctx.request.query.user_id
  const pnum = ctx.request.query.page || 1
  const type = ctx.request.query.type || 'article'
  try {
    const user_id = checkUtil.checkID(id)
    const page = checkUtil.checkID(pnum)
    if(!user_id) throw Error('user_id不合法！')
    if(!page) throw Error('page不合法！')
    ctx.state.searchInfo = { user_id, page, type }
    // console.log(ctx.state.searchInfo)
    await next()
  } catch (err) {
    console.error(err, searchError)
    return ctx.app.emit('error', searchError, ctx);
  }
}
module.exports = {
  searchInfoValidate
}