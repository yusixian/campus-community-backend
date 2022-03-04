/*
 * @Author: cos
 * @Date: 2022-02-25 14:53:45
 * @LastEditTime: 2022-03-05 01:03:01
 * @LastEditors: cos
 * @Description:  点赞相关服务 操纵model
 * @FilePath: \campus-community-backend\src\service\like.service.js
 */

const Article = require('../model/article.model')
const Comment = require('../model/comment.model')
const Like = require('../model/like.model')
const { incrementLikesByID, decrementLikesByID, searchArticleByID } = require('./article.service')
const seq = require("../db/seq");
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
   * @param {number} user_id 过滤参数 用户
   * @param {number | null} target_id 过滤参数 文章id
   * @return {number | null} cnt 总点赞数
   * @description: 获取该用户文章总点赞数 或者全部（都不传）
   */
  async getLikesByUser(user_id, target_id, type = 'article') {
    const whereOpt = {}
    user_id && Object.assign(whereOpt, { user_id })
    // Sequelize中的聚合函数 https://itbilu.com/nodejs/npm/EJcKjQWfM.html
    if(type == 'article') {
      target_id && Object.assign(whereOpt, { id: target_id })
      return await Article.sum('likes', { where: whereOpt });
    } else if(type == 'comment'){
      // TODO:获取该用户所有评论被点赞数 包括评论回复？@陈桑
      const cnt = 0;
      return cnt;
    } 
  }

  /**
   * @description: 根据文章id 评论id 用户id 查询并返回所有点赞数
   * 若有用户id 且类型type为文章 则根据用户id找到其所有文章返回总点赞数
   * @param filterOpt
   * @param {'article' | 'comment'} type 可选 不填则为article
   * @param {number} target_id 可选 目标id
   * @param {number} user_id 可选 用户id 不填则没有用户限制
   * @return {number} cnt 查询所得数量
   */
  async countLike(filterOpt) {
    const { target_id, type = 'article', user_id } = filterOpt
    if(user_id) {
      return await LikeService.prototype.getLikesByUser(user_id, target_id, type)
    } else { // 普普通通获取文章/评论等的点赞数，有对应id
      if(!target_id) return 0;
      const whereOpt = LikeService.prototype.getWhereOpt( { target_id, type } )
      console.log('whereOpt:',whereOpt)
      return await Like.count({ where: whereOpt })
    }
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
    // console.log("delete:", like_id, article_id)
    await Like.destroy({ where: { id: like_id } })
    if(article_id) await decrementLikesByID(article_id)
  }
  
  /**
   * @param {FilterOption} filterOpt 过滤参数
   * @return {FilterList} 返回{page_nums, count, rows} 总页数 查询所得总数 当前页列表
   * @description: 过滤点赞记录 返回{page_nums, count, rows}, row包括所点赞的文章列表
   */
   async filterLike(filterOpt, orderOpt) {
    const { current = 1, size = 10, user_id } = filterOpt
    const whereOpt = { user_id, type: 'article',  }
    let { count, rows } = await Like.findAndCountAll({
        attributes: ['article_id', ['createdAt', 'releaseAt']],
        where: whereOpt,
        // order: orderOpt,
        offset: (current-1)*size,
        limit: size,
        raw: true
    })
    rows = await Promise.all(rows.map(async(val) => {
      const articleInfo = await Article.findOne({
        attributes: [
          ['user_id', 'author_id'],
          [ seq.literal(`( 
                SELECT user_name 
                FROM sc_Users as a 
                WHERE  a.id = sc_Article.user_id 
            )`), 'author_name'
          ],
          'title',
          'summary',
          'cover_url',
          'likes',
          [ seq.literal(`( 
                SELECT COUNT(*) 
                FROM sc_Comments as a 
                WHERE  a.article_id = sc_Article.id 
            )`), 'comments'
          ], 
          'visits'
        ],
        where: { id: val.article_id },
        raw: true
      })
      Object.assign(val, articleInfo)
      return val
    }))
    console.log('row:', rows)
    const page_nums = Math.ceil(count/size)
    // console.log({ page_nums, count, rows })
    return { page_nums, count, rows }
  }
  
}
module.exports = new LikeService()