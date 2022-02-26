/*
 * @Author: lihao
 * @Date: 2022-02-21 14:47:31
 * @LastEditors: lihao
 * @LastEditTime: 2022-02-26 20:16:22
 * @FilePath: \campus-community-backend\src\service\comment.service.js
 * @Description: 评论的业务逻辑层
 * 
 */

const Comment = require('../model/comment.model')

const { Op } = require("sequelize");


class CommentService {

  /**
   * 
   * @param {*} comment_content 评论内容
   * @param {*} user_id 评论的用户
   * @param {*} article_id 评论的文章
   * @returns 
   */
  async createComment(comment_content, user_id, article_id) {
    const res = await Comment.create({
      comment_content,
      user_id, 
      article_id
    })
    return res.dataValues 
  }
  /**
   * 按照评论id删除评论
   * @param {*} id 被删除的评论的id
   * @returns 
   */
  async delCommentById(id) {
    const res = await Comment.destroy({
      where: {
        id: {
          [Op.eq]: id
        }
      }
    })
    return res
  }
  /**
   * 根据评论id恢复评论
   * @param {*} id 被恢复的评论id
   * @returns 
   */
  async restoreCommentById(id) {
    const res = await Comment.restore({
      where: {
        id: {
          [Op.eq]: id
        }
      }
    })
    return res
  }
  /**
   * 通过文章id批量删除评论
   * @param {*} ids 需要删除的评论列表
   * @returns 
   */
  async delCommentBatchByIds(ids) {
    const res = await Comment.destroy({
      where: {
        id: {
          [Op.in]: ids
        }
      }
    })
    return res
  }
  /**
   * 通过文章id查询评论
   * @param {*} id 
   * @returns 查询到的评论
   */
  async selectCommentByArticleId(id, pageNo, pageSize) {
    let start = (pageNo-1) * pageSize
    const res = await Comment.findAll({
      where:{
        article_id: id
      },
      offset: start,
      limit: pageSize
    })
    return res
  }
}

module.exports = new CommentService()