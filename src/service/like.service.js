/*
 * @Author: cos
 * @Date: 2022-02-25 14:53:45
 * @LastEditTime: 2022-02-27 22:09:35
 * @LastEditors: cos
 * @Description:  点赞相关服务 操纵model
 * @FilePath: \campus-community-backend\src\service\like.service.js
 */

const Comment = require('../model/comment.model')
const Like = require('../model/like.model')
const { incrementLikesByID, decrementLikesByID } = require('./article.service')
class LikeService {
  /**
   * @description: 生成新的点赞记录插入数据库
   * @param {Like} newLike
   * @return {Like | null} 创建成功后返回数据库中的点赞记录 
   */
  async createLike(newLike) {
    const res = await Like.create(newLike)
    // console.log(res.dataValues)
    const { type } = newLike
    if(type !== 'comment' && type !== 'comment_reply' ) 
      await incrementLikesByID(newLike.article_id)
    return res.dataValues
  }

  /**
   * @description: 根据id查询单个点赞记录是否存在
   * @param {number} like_id
   * @return {number} 查询所得结果 or null 
   */
   async getLikeRecordByID(like_id) {
    const res = await Like.findOne({ where: { id: like_id } })
    // console.log('res:',res)
    return res ? res.dataValues : null;
  }

  /**
   * @description: 
   * @param {Like} nowLike 完整的点赞记录
   * @return {TargetLike} 包括target_id和type
   */
  getTarget(nowLike) {
    const { type} = nowLike
    const targrtLike = { type }
    switch (type) {
      case 'comment':
        targrtLike.target_id = nowLike.comment_id;
        break;
      case 'comment_reply':
        targrtLike.target_id = nowLike.comment_reply_id;
        break;
      default:
        targrtLike.type = 'article'
        targrtLike.target_id = nowLike.article_id;
        break;
    }
    console.log('target_like:', targrtLike)
    return targrtLike
  }

  /**
   * @description: 根据target_id和type返回完整的点赞记录
   * @param {TargetLike} targetLike 包括target_id和type
   * @return {Like} nowLike 完整的点赞记录
   */
   getNewLike(targetLike) {
    const { type } = targetLike
    const nowLike = { type }
    switch (type) {
      case 'comment':
        nowLike.comment_id = targetLike.target_id;
        break;
      case 'comment_reply':
        nowLike.comment_reply_id = targetLike.target_id;
        break;
      default:
        nowLike.type = 'article'
        nowLike.article_id = targetLike.target_id;
        break;
    }
    console.log('nowLike:', nowLike)
    return nowLike
  }
  
  /**
   * @description: 根据target_id和type返回whereOpt
   * @param {TargetLike} targetLike 包括target_id和type
   * @return {LikeWhereOpt} whereOpt 
   */
  getWhereOpt(targetLike) {
    const { type, target_id } = targetLike
    const whereOpt = { type }
    switch (type) {
      case 'comment':
        whereOpt.type = 'comment';
        whereOpt.comment_id = target_id;
        break;
      case 'comment_reply':
        whereOpt.type = 'comment_reply';
        whereOpt.comment_reply_id = target_id;
        break;
      default:
        whereOpt.type = 'article';
        whereOpt.article_id = target_id
        break;
    }
    return whereOpt
  }

  /**
   * @description: 根据文章/评论id 查询并返回所有点赞
   * @param {number} target_id 目标id
   * @param {'article' | 'comment'} type 不填则为article
   * @return {number} cnt 查询所得数量
   */
   async countLikeByTargetID(target_id, type) {
    const whereOpt = LikeService.prototype.getWhereOpt({ target_id, type })
    // console.log("article_id:", article_id);
    const cnt = await Like.count({ where: whereOpt, raw: true })
    // console.log(res)
    return cnt
  }

  /**
   * @description: 根据文章/评论/评论回复id 查询并返回所有点赞
   * @param {number} target_id 目标id
   * @param {'article' | 'comment'} type 不填则为article
   * @return {Array<Like> | null} 查询所得结果 or null 
   */
  async getAllLikeByTargetID(target_id, type = 'article') {
    const whereOpt = LikeService.prototype.getWhereOpt({ target_id, type })
    // console.log("article_id:", article_id);
    const res = await Like.findAll({ where: whereOpt, raw: true })
    // console.log(res)
    return res
  }

  /**
   * @description: 验证点赞是否重复
   * @param {Like} newLike
   * @return {Boolean} 是否重复 true 不重复 false重复
   */
  async isRepeatLike(newLike) {
    let isRepeat = false
    const { user_id, type } = newLike
    const target_id = newLike.comment_id || newLike.comment_reply_id || newLike.article_id
    const targetLike = { type, target_id }

    const whereOpt = LikeService.prototype.getWhereOpt(targetLike)
    whereOpt.user_id = user_id

    const res = await Like.findAll({ where: whereOpt, raw: true })
    // console.log("res: ",res)
    // console.log("whereOpt: ",whereOpt)
    isRepeat = res && res.length > 0
    return isRepeat
  } 

  /**
   * @description: 获取点赞记录，根据user_id、type和target_id
   * @param {Like} newLike
   * @return {Like | null} 所得点赞记录 | null
   */
   async getLikeRecordByInfo(newLike) {
    let isRepeat = false
    const { user_id, type } = newLike
    const target_id = newLike.comment_id || newLike.comment_reply_id || newLike.article_id
    const targetLike = { type, target_id }

    const whereOpt = LikeService.prototype.getWhereOpt(targetLike)
    whereOpt.user_id = user_id
    
    const res = await Like.findAll({ where: whereOpt, raw: true })
    // console.log("res: ",res)
    // console.log("whereOpt: ",whereOpt)
    isRepeat = res && res.length > 0
    if(isRepeat) return res[0];
    else return null
  } 

  /**
   * @description: 根据点赞记录id 删除点赞 同时减少该点赞对应文章相应点赞数
   * @param {number} like_id 点赞记录id
   * @param {number} article_id 对应文章id
   * @param {'article' | 'comment'} type 不填则为article
   * @return {number} 删除的实际数量 
   */
  async deleteLike(like_id, article_id) {
    await Like.destroy({ where: { id: like_id } })
    await decrementLikesByID(article_id)
  }
}
module.exports = new LikeService()