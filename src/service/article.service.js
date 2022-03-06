/*
 * @Author: cos
 * @Date: 2022-02-18 14:16:17
 * @LastEditTime: 2022-03-06 17:02:36
 * @LastEditors: cos
 * @Description: 文章相关服务 操纵model
 * @FilePath: \campus-community-backend\src\service\article.service.js
 */
const { Op } = require("sequelize");
const moment = require('moment');
const Article = require('../model/article.model');
const seq = require("../db/seq");
class ArticleService {
  /**
   * @description: 生成新文章插入数据库
   * @param {Article} newArticle
   * @return {Article} 创建成功后返回数据库中的Article 包括文章id 
   */
  async createArticle (newArticle) {
    newArticle.status = 3   // 置为待审核状态
    const res = await Article.create(newArticle)
    // console.log(res)
    return res.dataValues
  }

  /**
   * @description: 判断审核通过与否，置为相应状态
   * @param {number} id 文章id
   * @param {boolean} pass 通过为true，不通过为false 不通过置为被屏蔽 默认为true
   * @return {number} 恢复的实际数量 
   */
   async reviewArticleByID (id, pass = true) {
    let status = 0
    if(!pass) status = 1
    const res = await Article.update({ status }, { where: { id } })
    return res
  }

  /**
   * @description: 软删除/强制删除该文章 强制删除了就回不去了
   * @param {Article} article
   * @param {boolean} isForce or null 仅当为true时强制删除
   * @return {number} 删除的实际数量 
   */
  async deleteArticleSelf (article, isForce) {
    // console.log("article_id:", article_id);
    let foropt = isForce === true ? true : false;
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
  async deleteArticleByID (article_id, isForce = false) {
    // console.log("article_id:", article_id);
    let foropt = isForce ? true : false;
    // console.log("foropt: ", foropt)
    if (!foropt)
      await Article.update({ status: 2 }, { where: { id: article_id } })
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
  async restoreArticleByID (article_id, isDel = false) {
    // console.log("article_id:", article_id);
    let whereOpt = { id: article_id }
    if (isDel) await Article.restore({ where: whereOpt })
    const res = await Article.update({ status: 0 }, { where: whereOpt })
    // console.log("res", res)
    return res
  }

  /**
   * @description: 查询并返回所有文章
   * @return {Array<Article>} 查询所得结果 or null 
   */
  async getArticleList () {
    // console.log("article_id:", article_id);
    const attributes = ArticleService.prototype.getElseAttribute()
    const res = await Article.findAll({ attributes, raw: true })
    // console.log(res)
    return res
  }

  /**
   * @description: 根据文章id增加该文章的浏览量
   * @param {number} article_id
   */
  async incrementVisitsByID (article_id) {
    const res = await Article.increment({ visits: 1 }, { where: { id: article_id } }) // 增加浏览量
    // console.log(res)
    return res
  }

  /**
   * @description: 根据文章id增加该文章的点赞数量
   * @param {number} article_id
   * @param {number} nums 默认为1 
   */
  async incrementLikesByID (article_id, nums = 1) {
    await Article.increment({ likes: nums }, { where: { id: article_id } })
  }

  /**
   * @description: 根据文章id减少该文章的点赞数量
   * @param {number} article_id
   */
  async decrementLikesByID (article_id, nums = 1) {
    await Article.increment({ likes: -nums }, { where: { id: article_id } })
  }

  /**
   * @description: 根据id查询文章内容
   * @param {number} article_id
   * @param {boolean} showSheid 默认false,不包括被屏蔽的
   * @param {boolean} showDel 默认false,不包括软删除帖子
   * @param {boolean} showReview 默认false,不包括软删除帖子
   * @return {Article} 查询所得结果文章信息 or null 
   */
  async searchArticleByID (article_id, showSheid = false, showDel = false, showReview = false) {
    // console.log("article_id:", article_id);
    let whereOpt = { 
      id: article_id,
      status: {
        [Op.or]: [0]
      }
    }
    showSheid && whereOpt.status[Op.or].push(1)
    showReview && whereOpt.status[Op.or].push(3)
    // console.log(whereOpt)
    const attributes = ArticleService.prototype.getElseAttribute()
    const res = await Article.findOne({
      attributes,
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
  async updateArticleByID (id, newArticle) {
    if (!newArticle) return false;
    const whereOpt = { id }
    const res = await Article.update(newArticle, { where: whereOpt })
    // console.log("res", res)
    return res[0] > 0 ? true : false
  }

  /**
   * @param {number} status 过滤参数
   * @return {boolean} ParanoidOpt 偏执表选项
   * @description: 仅当status为2即被软删除时，偏执表选项为false使其可被查到
   */
  getParanoidOpt (status) {
    return status !== 2
  }

  /**
   * @param {FilterOption} filterOpt 过滤参数
   * @return {WhereOpt} 提取过滤参数到whereOpt
   * @description: 
   */
  getWhereOpt (filterOpt) {
    const whereOpt = {}
    const { partition_id, status, start_time, end_time, user_id } = filterOpt
    // console.log("status:", status)
    if(status in [0,1,2,3]) whereOpt.status = status
    partition_id && Object.assign(whereOpt, { partition_id })
    user_id && Object.assign(whereOpt, { user_id })
    if (start_time || end_time) whereOpt.createdAt = {}
    if (start_time) Object.assign(whereOpt.createdAt, {
      [Op.gt]: moment(start_time).toDate()
    })
    if (end_time) Object.assign(whereOpt.createdAt, {
      [Op.lt]: moment(end_time).toDate()
    })
    // console.log("whereOpt:",whereOpt)
    return whereOpt
  }

  /**
   * @description: 子查询 返回添加一些额外的属性 如通过用户id查询用户名
   * @return { Attributes } 额外属性 
   */
  getElseAttribute () {
    const attributes = {
      include: [
        [
          seq.literal(`( 
                    SELECT user_name 
                    FROM sc_Users as a 
                    WHERE  a.id = sc_Article.user_id 
                )`), 'user_name'
        ],
        [
          seq.literal(`( 
                    SELECT name 
                    FROM sc_Users as a 
                    WHERE  a.id = sc_Article.user_id 
                )`), 'name'
        ],
        [
          seq.literal(`( 
                    SELECT COUNT(*) 
                    FROM sc_Comments as a 
                    WHERE  a.article_id = sc_Article.id 
                )`), 'comments'
        ],
        [
          seq.literal(`( 
                    SELECT img 
                    FROM sc_Users as a 
                    WHERE  a.id = sc_Article.user_id 
                )`), 'avator'
        ],
        [
          seq.literal(`( 
                    SELECT partition_name 
                    FROM sc_Partitions as a 
                    WHERE  a.id = sc_Article.partition_id 
                )`), 'partition_name'
        ]
      ]
    }
    return attributes
  }

  /**
   * @param {FilterOption} filterOpt 过滤参数
   * @param {OrderOption} orderOpt 排序参数 
   * @return {FilterList} 返回{page_nums, count, rows} 总页数 查询所得总数 当前页列表
   * @description: 过滤文章 返回{page_nums, count, rows}
   */
  async filterArticle (filterOpt, orderOpt) {
    const current = filterOpt.current || 1
    const size = filterOpt.size || 10
    const whereOpt = ArticleService.prototype.getWhereOpt(filterOpt)
    const { status } = filterOpt
    const paranoidOpt = ArticleService.prototype.getParanoidOpt(status)
    const attributes = ArticleService.prototype.getElseAttribute()
    // console.log("whereOpt:", whereOpt, 'paranoidOpt:', paranoidOpt)
    // const start_time = filterOpt.start_time
    const { count, rows } = await Article.findAndCountAll({
      attributes,
      where: whereOpt,
      order: orderOpt,
      offset: (current - 1) * size,
      limit: size,
      paranoid: paranoidOpt,
      raw: true
    })
    const page_nums = Math.ceil(count / size)
    // console.log({ page_nums, count, rows })
    return { page_nums, count, rows }
  }

  /**
   * @param {FilterOption} filterOpt 过滤参数
   * @param {OrderOption} orderOpt 排序参数 
   * @return {Array<Article>} article_list or null
   * @description: filterOpt、
   */
  async countArticle (filterOpt) {
    const whereOpt = ArticleService.prototype.getWhereOpt(filterOpt)
    const { status } = filterOpt
    const paranoidOpt = ArticleService.prototype.getParanoidOpt(status)
    // console.log("whereOpt:",whereOpt)
    const count = await Article.count({
      paranoid: paranoidOpt,
      where: whereOpt
    })
    return count
  }
}

module.exports = new ArticleService()