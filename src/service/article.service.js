/*
 * @Author: cos
 * @Date: 2022-02-18 14:16:17
 * @LastEditTime: 2022-02-18 14:35:40
 * @LastEditors: cos
 * @Description: 文章相关服务 操纵model
 * @FilePath: \campus-community-backend\src\service\article.service.js
 */

const Article = require('../model/ariticle.model')
class ArticleService {
    /**
     * @description: 插入数据库
     * @detail: 
     * @param {number} user_id
     * @param {string} title
     * @param {string} content
     * @param {string} summary 可为空
     */
    async createArticle(user_id, title, content, summary) {
        const res = await Article.create({
            user_id,
            title,
            content,
            summary
        })
        console.log(res)
        return res.dataValues
    }
}

module.exports = new ArticleService()