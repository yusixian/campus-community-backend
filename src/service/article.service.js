/*
 * @Author: cos
 * @Date: 2022-02-18 14:16:17
 * @LastEditTime: 2022-02-19 23:40:07
 * @LastEditors: cos
 * @Description: 文章相关服务 操纵model
 * @FilePath: \campus-community-backend\src\service\article.service.js
 */

const seq = require('../db/seq');
const Article = require('../model/article.model')
class ArticleService {
  /**
   * @description: 生成新文章插入数据库
   * @param {number} user_id
   * @param {string} user_name
   * @param {boolean} is_admin
   * @param {string} title
   * @param {string} content
   * @param {string} summary 可为空
   * @return {Article} 创建成功后返回数据库中的Article 包括文章id 
   */
  async createArticle(user_id, user_name, is_admin, title, content, summary) {
      const res = await Article.create({
          user_id,
          user_name,
          is_admin,
          title,
          content,
          summary
      })
      // console.log(res)
      // console.log(typeof res);
      return res.dataValues
  }
  /**
   * @description: 根据id删除该文章
   * @param {number} article_id
   * @return {number} 删除的实际数量 
   */
  async deleteArticleByID(article_id) {
    // console.log("article_id:", article_id);
    const res = await Article.destroy({
      where: {
        id: article_id
      }
    })
    // console.log("res", res)
    // console.log("type res", typeof res)
    return res
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
    // console.log("type res", typeof res)
    return res[0] > 0 ? true : false
  }
}

module.exports = new ArticleService()