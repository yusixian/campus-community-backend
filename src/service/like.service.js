/*
 * @Author: cos
 * @Date: 2022-02-25 14:53:45
 * @LastEditTime: 2022-02-25 17:25:22
 * @LastEditors: cos
 * @Description: 
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
    if(type !== 'comment') 
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
    console.log('res:',res)
    return res ? res.dataValues : null;
  }

  /**
   * @description: 根据文章/评论id 查询并返回所有点赞
   * @param {number} target_id 目标id
   * @param {'article' | 'comment'} type 不填则为article
   * @return {number} cnt 查询所得数量
   */
   async countLikeByTargetID(target_id, type) {
    const whereOpt = { type: 'article'}

    if(type === 'comment') {
      whereOpt.type = 'comment'
      whereOpt.comment_id = target_id
    } else whereOpt.article_id = target_id

    // console.log("article_id:", article_id);
    const cnt = await Like.count({ where: whereOpt, raw: true })
    // console.log(res)
    return cnt
  }

  /**
   * @description: 根据文章/评论id 查询并返回所有点赞
   * @param {number} target_id 目标id
   * @param {'article' | 'comment'} type 不填则为article
   * @return {Array<Like> | null} 查询所得结果 or null 
   */
  async getAllLikeByTargetID(target_id, type = 'article') {
    const whereOpt = { type: 'article'}
    if(type === 'comment') {
      whereOpt.type = 'comment'
      whereOpt.comment_id = target_id
    } else whereOpt.article_id = target_id
    // console.log("article_id:", article_id);
    const res = await Like.findAll({ where: whereOpt, raw: true })
    // console.log(res)
    return res
  }

  /**
   * @description: 验证点赞是否重复
   * @param {Like} newLike
   * @return {Boolean} 是否重复
   */
  async validateLike(newLike) {
    let isValid = true
    const { user_id, type } = newLike
    const whereOpt = { user_id, type }
    if(type === 'comment') whereOpt.comment_id = newLike.comment_id
    else { 
      whereOpt.type = 'article'
      whereOpt.article_id = newLike.article_id
    }
    const res = await Like.findAll({ where: whereOpt, raw: true })
    // console.log("res: ",res)
    console.log("whereOpt: ",whereOpt)
    isValid = !(res && res.length > 0)
    console.log("res: ", res)
    console.log("isValid: ", isValid)
    return isValid
  } 

  /**
   * @description: 根据点赞记录id 删除点赞 同时减少该点赞对应文章/评论相应点赞数
   * @param {number} like_id 点赞记录id
   * @param {number} target_id 对应文章/评论id
   * @param {'article' | 'comment'} type 不填则为article
   * @return {number} 删除的实际数量 
   */
  async deleteLike(like_id, target_id, type = 'article') {
    await Like.destroy({ where: { id: like_id } })
    if(type !== 'comment') 
      await decrementLikesByID(target_id)
  }
}
module.exports = new LikeService()