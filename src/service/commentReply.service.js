/*
 * @Author: lihao
 * @Date: 2022-02-24 16:17:34
 * @LastEditors: lihao
 * @LastEditTime: 2022-02-25 15:57:19
 * @FilePath: \campus-community-backend\src\service\commentReply.service.js
 * @Description: 评论回复服务层
 */


const CommentReply = require('../model/commentReply.model')

const { Op } = require("sequelize");

class CommentReplyService {
  /**
   * 回复的接口（注： 如果是回复评论，）
   * @param {*} comment_id 评论id
   * @param {*} comment_reply_id  父回复的id
   * @param {*} comment_reply_content 回复内容
   * @param {*} from_user_id 来自于谁的回复
   * @param {*} to_user_id 给谁的回复
   * @returns 
   */
  async createCommentReply(comment_id, comment_reply_id, comment_reply_content, from_user_id, to_user_id) {
    const res = CommentReply.create({
      comment_id,
      comment_reply_id,
      comment_reply_content,
      from_user_id,
      to_user_id
    })
    return res.dataValues
  }
  /**
   * 通过回复id删除回复（注：因数据库级联删除，会删除掉所有子回复）
   * @param {*} id 回复id
   * @returns 
   */
  async deleteCommentReply(id) {
    const res = CommentReply.destroy({
      where: {
        id
      }
    })
    return res
  }
  /**
   * 根据评论id获取相对用的回复数据
   * @param {*} id 评论id
   * @returns 
   */
  async selectCommentReplyByCommentId(id) {
    const res =await CommentReply.findAll({
      where: {
        comment_id: id
      }
    })
    return res
  }

}
module.exports = new CommentReplyService()