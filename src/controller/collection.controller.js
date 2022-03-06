/*
 * @Author: cos
 * @Date: 2022-03-02 12:11:30
 * @LastEditTime: 2022-03-06 20:00:46
 * @LastEditors: cos
 * @Description: 收藏相关控制器
 * @FilePath: \campus-community-backend\src\controller\collection.controller.js
 */
const { collectionCreateError, articleDosNotExist, collectionOperationError } = require("../constant/err.type")
const { searchArticleByID } = require("../service/article.service")
const { createCollection, countCollections, getCollectionsByUser, deleteCollectionByInfo, deleteCollectionByID } = require("../service/collection.service")
class CollectionController {
  async addCollection(ctx, next) {
    const newCollection = ctx.state.newCollection
    const { user_id, article_id } = newCollection
    try {
      console.log(`addCollection: ${ctx.state.newLike}`)
      const res = await createCollection(user_id, article_id)
      ctx.body = {
          code: 0,
          message: "收藏成功！",
          result: {
              collection_id: res.id,
              user_id,
              article_id
          }
      }
    } catch (err) {
      console.error('收藏失败！', err);
      ctx.app.emit('error', collectionCreateError, ctx)
    }
  }
  async countCollection(ctx, next) { 
    const newCollection = ctx.state.newCollection
    const { article_id } = newCollection
    // console.log("newCollection:", newCollection)
    try {
      if(!await searchArticleByID(article_id)) throw Error('该文章不存在！')
      const cnt = await countCollections(article_id)
      ctx.body = {
        code: 0,
        message: "获取收藏数成功！",
        result: {
            article_id,
            cnt
        }
      }
    } catch(err) {
      console.error(err, articleDosNotExist)
      return ctx.app.emit('error', articleDosNotExist, ctx)
    }
  }
  async getCollentionList(ctx, next) {
    const { id } = ctx.state.user
    try {
      const res = await getCollectionsByUser(id)
      // console.log(res)
      ctx.body = {
        code: 0,
        message: "获取收藏列表成功！",
        result: res
      }
    } catch(err) {
      console.error(err, articleDosNotExist)
      return ctx.app.emit('error', articleDosNotExist, ctx)
    }
  }
  async cancelCollection(ctx, next) {
    const newCollection = ctx.state.newCollection
    const { user_id, article_id } = newCollection
    try {
      const res = await deleteCollectionByInfo(user_id, article_id)
      if(!res) throw Error()
      // console.log('cancel!')
      ctx.body = {
        code: 0,
        message: "取消收藏成功！"
      }
    } catch (err) {
      console.error('取消收藏失败！数据库中可能没有该条记录', err);
      ctx.app.emit('error', collectionOperationError, ctx)
    }
  }
  async deleteCollection(ctx, next) {
    const collection_id = ctx.state.collection_id
    try {
      const res = await deleteCollectionByID(collection_id)
      if(!res) throw Error()
      // console.log('cancel!')
      ctx.body = {
        code: 0,
        message: "删除收藏记录成功！"
      }
    } catch (err) {
      console.error('删除收藏记录失败！数据库中可能没有该条记录', err);
      ctx.app.emit('error', collectionOperationError, ctx)
    }
  }
}
module.exports = new CollectionController()