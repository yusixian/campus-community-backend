/*
 * @Author: 41
 * @Date: 2022-03-03 16:34:59
 * @LastEditors: cos
 * @LastEditTime: 2022-03-05 20:38:21
 * @Description: 
 */
const { getUserInfo } = require('../service/user.service')
const { createFollow, getFollowInfo, delFollow } = require('../service/follow.service')
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
    const { user_id } = ctx.request.query
    // console.log(user_id);
    try {
      let res = await getFollowInfo({ user_id })
      ctx.body = {
        code: 0,
        message: '查询用户的关注成功！',
        res
      }
    } catch {
      return
    }
  }
  async delfollow (ctx, next) {
    const user_id = ctx.state.user.id
    const { follow_id } = ctx.request.body
    // console.log(user_id, follow_id);
    try {
      let message = await delFollow({ user_id, follow_id }) ? '取消关注成功' : '本来就没有关注'
      ctx.body = {
        code: 0,
        message
      }
    } catch {
      return
    }
  }
  async ornot (ctx, next) {
    const user_id = ctx.state.user.id
    const { follow_id } = ctx.request.query
    // console.log(user_id, '****', follow_id);
    try {
      let res = await getFollowInfo({ user_id })
      for (let i = 0; i < res.length; i++) {
        if (res[i].follow_id == follow_id) {
          ctx.body = {
            code: 0,
            message: '查询成功',
            res: true
          }
          return
        }
      }
      ctx.body = {
        code: 0,
        message: '查询成功',
        res: false
      }
    } catch (err) {
      return
    }

  }
  async getfollowList (ctx, next) {
    const { follow_id } = ctx.request.query
    // console.log(follow_id);
    let user = await getFollowInfo({ follow_id })
    let res = []
    for (let i = 0; i < user.length; i++) {
      let id = user[i].user_id
      let temp = await getUserInfo({ id })
      res[i] = {}
      res[i]['id'] = temp.id
      res[i]['name'] = temp.name
      res[i]['user_name'] = temp.user_name
      res[i]['img'] = temp.img
      // console.log(res);
    }
    ctx.body = {
      code: 0,
      message: '查询成功',
      res
    }
  }
}




module.exports = new FollowController()