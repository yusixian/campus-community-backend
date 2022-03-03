/*
 * @Author: 41
 * @Date: 2022-03-03 16:34:59
 * @LastEditors: 41
 * @LastEditTime: 2022-03-03 18:18:51
 * @Description: 
 */
const { createFollow } = require('../service/follow.service')
class FollowController {
  async addfollow (ctx, next) {
    const user_id = ctx.state.user.id
    const { follow_id } = ctx.request.body
    try {
      let res = await createFollow(user_id, follow_id)
      // console.log(res);
      ctx.body = {
        code: 0,
        message: '添加关注成功！',
        res
      }
    } catch {
      return
    }
  }
  async findfollow (ctx, next) {
    try {
      ctx.body = {
        code: 0,
        message: '查询用户的关注成功！',
      }
    } catch {
      return
    }
  }
}




module.exports = new FollowController()