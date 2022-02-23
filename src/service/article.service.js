/*
 * @Author: cos
 * @Date: 2022-02-18 14:16:17
 * @LastEditTime: 2022-02-23 02:30:33
 * @LastEditors: cos
 * @Description: 文章相关服务 操纵model
 * @FilePath: \campus-community-backend\src\service\article.service.js
 */

const Article = require('../model/article.model')
class ArticleService {
  /**
   * @description: 生成新文章插入数据库
   * @param {Article} newArticle
   * @return {Article} 创建成功后返回数据库中的Article 包括文章id 
   */
  async createArticle(newArticle) {
      const res = await Article.create(newArticle)
      // console.log(res)
      return res.dataValues
  }

  /**
   * @description: 软删除/强制删除该文章 强制删除了就回不去了
   * @param {Article} article
   * @param {boolean} isForce or null 仅当为true时强制删除
   * @return {number} 删除的实际数量 
   */
   async deleteArticleSelf(article, isForce) {
    // console.log("article_id:", article_id);
    let foropt = isForce === true ? true: false;
    // console.log("foropt: ", foropt)
    const res = await article.destroy({ force: foropt })
    // console.log("res", res)
    return res
  }

  /**
   * @description: 根据id 软删除/强制删除该文章 强制删除了就回不去了
   * @param {number} article_id
   * @param {boolean} isForce or null 仅当为true时强制删除
   * @return {number} 删除的实际数量 
   */
  async deleteArticleByID(article_id, isForce) {
    // console.log("article_id:", article_id);
    let foropt = isForce === true ? true: false;
    // console.log("foropt: ", foropt)
    const res = await Article.destroy({
      where: {
        id: article_id
      },
      force: foropt
    })
    // console.log("res", res)
    return res
  }

  /**
   * @description: 根据id恢复被软删除的帖子
   * @param {number} article_id
   * @return {number} 恢复的实际数量 
   */
   async restoreArticleByID(article_id) {
    // console.log("article_id:", article_id);
    const res = await Article.restore({
      where: {
        id: article_id
      }
    })
    // console.log("res", res)
    return res
  }

  /**
   * @description: 查询并返回所有文章
   * @return {Array<Article>} 查询所得结果 or null 
   */
  async getArticleList() {
    // console.log("article_id:", article_id);
    const res = await Article.findAll({ raw: true })
    // console.log(res)
    return res
  }

  /**
   * @description: 根据id查询单个帖子是否存在 软删除的帖子会查不到
   * @param {number} article_id
   * @param {boolean} showSheid 默认false,不显示被屏蔽的
   * @return {number} 查询所得结果 or null 
   */
  async searchArticleByID(article_id, showSheid = false) {
    const statuopt = showSheid ? true : false;
    console.log("article_id:", article_id);
    let res
    if(showSheid === true) {
        res = await Article.findOne({
          where: {
            id: article_id
          }
        })
    } else {  // 只获取已发布
      res = await Article.findOne({
        where: {
          id: article_id,
          status: false
        }
      })
    }
    console.log(res)
    return res ? res.dataValues : null;
  }

  /**
   * @description: 
   * @param {number} id
   * @param {Article} newArticle
   * @return {boolean} 更新成功与否
   */
  async updateArticleByID(id, newArticle) {
    if(!newArticle) return false;
    const whereOpt = { id }
    const res = await Article.update(newArticle, { where: whereOpt })
    // console.log("res", res)
    return res[0] > 0 ? true : false
  }
}

module.exports = new ArticleService()