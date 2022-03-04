/*
 * @Author: 41
 * @Date: 2022-02-24 11:51:17
 * @LastEditors: 41
 * @LastEditTime: 2022-03-04 12:02:58
 * @Description: 搜索相关服务
 */
const User = require('../model/user.model')
const Article = require('../model/article.model')
const Sequelize = require('sequelize');
const { getWhereOpt, getParanoidOpt } = require('./article.service');
const Op = Sequelize.Op;
class SearchService {
  async searchLikeUser (clue) {
    return await User.findAll({
      where: {
        [Op.or]: [
          {
            user_name: {
              [Op.like]: `%${clue}%`
            },
          },
          {
            name: {
              [Op.like]: `%${clue}%`
            }
          }]
      },
      raw: true
    })
  }
  async searchLikeArticle (word, filterOpt) {
    const current = filterOpt.current || 1
    const size = filterOpt.size || 10
    console.log("filterOpt:", filterOpt)
    const { status } = filterOpt
    const whereOpt = getWhereOpt(filterOpt)
    Object.assign(whereOpt, {
      [Op.or]: [
        { title: { [Op.like]: `%${word || ' '}%` } },
        { content: { [Op.like]: `${word || ' '}` } },
        { summary: { [Op.like]: `${word || ' '}` } },
      ]
    })

    const paranoidOpt = getParanoidOpt(status)
    if (!status) whereOpt.status = 0 // 文章搜索默认搜索到已发布
    console.log("whereOpt:", whereOpt)
    console.log("paranoidOpt:", paranoidOpt)
    const { count, rows } = await Article.findAndCountAll({
      where: whereOpt,
      // order: orderOpt,
      offset: (current - 1) * size,
      limit: size,
      paranoid: paranoidOpt,
      raw: true
    })
    const page_nums = Math.ceil(count / size)
    console.log({ page_nums, count, rows })
    return { page_nums, count, rows }
  }
}


module.exports = new SearchService()