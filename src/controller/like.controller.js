/*
 * @Author: cos
 * @Date: 2022-02-25 14:10:28
 * @LastEditTime: 2022-03-04 23:25:28
 * @LastEditors: cos
 * @Description: 点赞相关控制器
 * @FilePath: \campus-community-backend\src\controller\like.controller.js
 */
const { likeCreateError, likeOperationError } = require("../constant/err.type");
const { createLike, countLike, deleteLike, getTarget } = require("../service/like.service")
class LikeController {
  async addLike(ctx, next) {
    try {
      const newLike = ctx.state.newLike
      console.log('addLike:', ctx.state.newLike)
      const res = await createLike(newLike)
      const targrtLike = getTarget(res)
      const { user_id } = newLike
      const { type, target_id } = targrtLike
      ctx.body = {
          code: 0,
          message: "点赞成功！",
          result: {
              like_id: res.id,
              user_id,
              type,
              target_id
          }
      }
    } catch (err) {
      console.error('点赞失败！', err);
      ctx.app.emit('error', likeCreateError, ctx)
    }
  }
  async countLike(ctx, next) {
    try {
      const filterOpt = ctx.state.filterOpt
      // console.log('filterOpt:',filterOpt)
      const cnt = await countLike(filterOpt)
      ctx.body = {
        code: 0,
        message: "获取点赞记录数成功！",
        result: {
          filterOpt,
          cnt
        }
    }
    } catch (err) {
      console.error('点赞失败！', err);
      ctx.app.emit('error', likeOperationError, ctx)
    }
  }
  async cancelLike(ctx, next) {
    try {
      const existLike = ctx.state.existLike
      const { id } = existLike
      // console.log(existLike)
      const targrtLike = getTarget(existLike)
      const { type, target_id } = targrtLike
      if(type === 'article') await deleteLike(id, target_id)
      else await deleteLike(id)
      // console.log('cancel!')
      ctx.body = {
        code: 0,
        message: "取消点赞成功！"
      }
    } catch (err) {
      console.error('取消点赞失败！数据库中可能没有该条记录', err);
      ctx.app.emit('error', likeOperationError, ctx)
    }
  }
}
module.exports = new LikeController()