/*
 * @Author: cos
 * @Date: 2022-02-18 14:16:17
 * @LastEditTime: 2022-02-24 19:30:44
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
   * @description: 根据id 软删除/强制删除该文章 软删除则置status为2 强制删除则在数据库中删除
   * @param {number} article_id
   * @param {boolean} isForce or null 仅当为true时强制删除
   * @return {number} 删除的实际数量 
   */
  async deleteArticleByID(article_id, isForce = false) {
    // console.log("article_id:", article_id);
    let foropt = isForce ? true: false;
    // console.log("foropt: ", foropt)
    if(!foropt) 
      await Article.update({status: 2}, { where: { id: article_id}})
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
   * @description: 根据id恢复被屏蔽/被软删除的帖子 status重新变为0
   * @param {number} article_id
   * @param {boolean} isDel 是否为被软删除帖子 默认为false即恢复被屏蔽帖子
   * @return {number} 恢复的实际数量 
   */
   async restoreArticleByID(article_id, isDel = false) {
    // console.log("article_id:", article_id);
    let whereOpt = { id: article_id }
    if(isDel) await Article.restore({ where: whereOpt })
    const res = await Article.update({status: 0}, { where: whereOpt })
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
   * @param {boolean} showSheid 默认false,不包括被屏蔽的
   * @param {boolean} showDel 默认false,不包括软删除帖子
   * @return {number} 查询所得结果 or null 
   */
  async searchArticleByID(article_id, showSheid = false, showDel = false) {
    console.log("article_id:", article_id);
    let whereOpt = { id: article_id }
    if(!showSheid) whereOpt.status = 0
    const res = await Article.findOne({
        where: whereOpt,
        paranoid: !showDel   // paranoid为false则会检索到被软删除的
      })
    // console.log(res)
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