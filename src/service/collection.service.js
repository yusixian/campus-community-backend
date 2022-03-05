/*
 * @Author: cos
 * @Date: 2022-03-02 11:45:08
 * @LastEditTime: 2022-03-05 20:42:23
 * @LastEditors: cos
 * @Description: 收藏相关服务 操纵model
 * @FilePath: \campus-community-backend\src\service\collection.service.js
 */
const Collection = require('../model/collection.model')
const seq = require("../db/seq")
const User = require('../model/user.model')
const Article = require('../model/article.model')
class CollectionService {
  /**
   * 添加收藏
   * @param {number} user_id 添加收藏的用户id 
   * @param {number} article_id 收藏的文章id 
   */
  async createCollection(user_id, article_id) {
    const res = await Collection.create({ user_id, article_id })
    await Article.increment({collections: 1}, { where: { id: article_id } })
    return res.dataValues 
  } 

  /**
   * @description: 验证收藏是否重复
   * @param {number} user_id 添加收藏的用户id 
   * @param {number} article_id 收藏的文章id 
   * @return {Boolean} 是否重复 true 不重复 false重复
   */
   async isRepeatCollection(user_id, article_id) {
    const res = await Collection.findAll({ where: { user_id, article_id }, raw: true })
    const isRepeat = res && res.length > 0
    return isRepeat
  } 

  /**
   * @description: 根据文章id与用户id取消收藏
   * @param {number} user_id 添加收藏的用户id 
   * @param {number} article_id 收藏的文章id 
   * @return {number} 删除的实际数量 
   */
   async deleteCollectionByInfo(user_id, article_id) {
    // console.log("delete:", like_id, article_id)
    const res = await Collection.destroy({ where: { user_id, article_id } })
    await Article.decrement({collections: 1}, { where: { id: article_id } })
    return res
  }

  /**
   * @description: 根据收藏记录id删除收藏 减少相应文章收藏数
   * @param {number} id 收藏记录的id
   */
  async deleteCollectionByID(id) {
    // console.log("id:", id)
    const record = await CollectionService.prototype.getCollectionRecordByID(id)
    // console.log(record)
    const { article_id } = record
    const res = await Collection.destroy({ where: { id } })
    await Article.decrement({collections: 1}, { where: { id: article_id } })
    return res
  }
  
  /**
   * @description: 根据收藏记录id获取收藏记录
   * @param {number} id 收藏记录的id
   */
  async getCollectionRecordByID(id) {
    const res = await Collection.findOne({ where: { id } })
    return res ? res.dataValues : null;
  }

  /**
   * @description: 根据用户id和文章id获取收藏记录
   * @param {number} user_id 添加收藏的用户id 
   * @param {number} article_id 收藏的文章id 
   */
  async getCollectionRecordByInfo(user_id, article_id) {
    const res = await Collection.findOne({ where: { user_id, article_id } })
    return res ? res.dataValues : null;
  }

  /**
   * @description: 根据文章id获取收藏数
   * @param {number} article_id 文章id 
   * @return {number} cnt 该文章收藏数
   */
  async countCollections(article_id) {
    const cnt = await Collection.count({ where: { article_id } })
    return cnt;
  }
  
  /**
   * @description: 根据用户id获取收藏记录
   * @param {number} user_id 用户id 
   * @return {CollectionList}  收藏记录
   */
  async getCollectionsByUser(user_id) {
    let temp
    const res = await Collection.findAll({ where: { user_id }, raw: true})
    if(res) {
      temp = await Promise.all( res.map(async(val) => {
        // console.log("val:", val)
        const { user_id, article_id } = val
        const userInfo = await User.findOne({ attributes: [['img', 'avator'], 'user_name'], where: { id:user_id }, raw: true})
        const articleInfo = await Article.findOne({ attributes: { exclude: ['status', 'deletedAt'] }, where: { id:article_id }, raw: true})
        userInfo && Object.assign(val, { userInfo })
        articleInfo && Object.assign(val, { articleInfo })
        return val
      }) ) 
    }
    // console.log(temp)
    return temp;
  }
}

module.exports = new CollectionService()