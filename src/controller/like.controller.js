/*
 * @Author: cos
 * @Date: 2022-02-25 14:10:28
 * @LastEditTime: 2022-02-26 17:22:14
 * @LastEditors: cos
 * @Description: 点赞相关控制器
 * @FilePath: \campus-community-backend\src\controller\like.controller.js
 */
const { likeCreateError, likeOperationError } = require("../constant/err.type");
const { createLike, countLikeByTargetID, deleteLike } = require("../service/like.service")
class LikeController {
  async addLike(ctx, next) {
    try {
      const res = await createLike(ctx.state.newLike)
      const { user_id, type } = res
      let target_id
      if(type === 'comment') target_id = res.comment_id
      else target_id = res.article_id
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
      const newLike = ctx.state.newLike
      let { type } = newLike
      let target_id
      if(type === 'comment') target_id = newLike.comment_id
      else {
        type = 'article'
        target_id = newLike.article_id
      }
      const cnt = await countLikeByTargetID(target_id, type)
      ctx.body = {
        code: 0,
        message: "获取点赞记录数成功！",
        result: {
            type,
            target_id,
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
      // console.log(existLike)
      const { id, type } = existLike
      const target_id = (type === 'comment') ? existLike.comment_id: existLike.article_id
      await deleteLike(id, target_id)
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