/*
 * @Author: cos
 * @Date: 2022-02-18 14:16:17
 * @LastEditTime: 2022-02-25 13:16:03
 * @LastEditors: cos
 * @Description: 文章相关服务 操纵model
 * @FilePath: \campus-community-backend\src\service\article.service.js
 */
const { Op } = require("sequelize");
const moment = require('moment');
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
   * @description: 根据文章id增加该文章的浏览量
   * @param {number} article_id
   */
  async incrementVisitsByID(article_id) {
    const res = await Article.increment({visits: 1}, { where: { id: article_id } }) // 增加浏览量
    console.log(res)
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

  /**
   * @param {number} status 过滤参数
   * @return {boolean} ParanoidOpt 偏执表选项
   * @description: 
   */
  async getParanoidOpt(status) {
    let paranoidOpt = true
    switch (status) {
      case 0: 
      case 1: 
        break
      case 2: paranoidOpt = false; break
      default: break
    }
    return paranoidOpt
  }

  /**
   * @param {FilterOption} filterOpt 过滤参数
   * @return {WhereOpt} 提取过滤参数到whereOpt
   * @description: 
   */
  async getWhereOpt(filterOpt) {
    const whereOpt = {}
    const { partition_id, status, start_time, end_time, user_id } = filterOpt
    // console.log("status:", status)
    switch (status) {
      case 0: whereOpt.status = 0; break
      case 1: whereOpt.status = 1; break
      case 2: whereOpt.status = 2; break
      default: break
    }
    partition_id && Object.assign(whereOpt, { partition_id })
    user_id && Object.assign(whereOpt, { user_id })
    if(start_time || end_time) whereOpt.createdAt = {}
    if(start_time) Object.assign(whereOpt.createdAt, { 
      [Op.gt]: moment(start_time).toDate()
    })
    if(end_time) Object.assign(whereOpt.createdAt, { 
      [Op.lt]: moment(end_time).toDate()
    })
    // console.log("whereOpt:",whereOpt)
    return whereOpt
  }

  /**
   * @param {FilterOption} filterOpt 过滤参数
   * @param {OrderOption} orderOpt 排序参数 
   * @return {Array<Article>} article_list or null
   * @description: filterOpt、
   */
  async filterArticle(filterOpt, orderOpt) {
    const current = filterOpt.current || 1
    const size = filterOpt.size || 10

    const whereOpt = await ArticleService.prototype.getWhereOpt(filterOpt)
    const { status } = filterOpt
    const paranoidOpt = await ArticleService.prototype.getParanoidOpt(status)

    console.log("whereOpt:",whereOpt, 'paranoidOpt:', paranoidOpt)
    // const start_time = filterOpt.start_time
    const { count, rows } = await Article.findAndCountAll({
      where: whereOpt,
      // order: orderOpt,
      offset: (current-1)*size,
      limit: size,
      paranoid: paranoidOpt,
      raw: true
    })
    const page_nums = Math.ceil(count/size)
    // console.log({ page_nums, count, rows })
    return { page_nums, count, rows }
  }
  
  /**
   * @param {FilterOption} filterOpt 过滤参数
   * @param {OrderOption} orderOpt 排序参数 
   * @return {Array<Article>} article_list or null
   * @description: filterOpt、
   */
  async countArticle(filterOpt) {
    const whereOpt = await ArticleService.prototype.getWhereOpt(filterOpt)
    const { status } = filterOpt
    const paranoidOpt = await ArticleService.prototype.getParanoidOpt(status)
    console.log("whereOpt:",whereOpt)
    // const start_time = filterOpt.start_time
    const count = await Article.count({
      paranoid: paranoidOpt,
      where: whereOpt
    })
    return count
  }
}

module.exports = new ArticleService()