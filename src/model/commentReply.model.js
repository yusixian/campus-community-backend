/*
 * @Author: lihao
 * @Date: 2022-02-23 18:57:38
 * @LastEditors: lihao
 * @LastEditTime: 2022-02-25 10:40:47
 * @FilePath: \campus-community-backend\src\model\commentReply.model.js
 * @Description: 评论回复表
 */

const { DataTypes } = require('sequelize')

const seq = require('../db/seq')

const User = require('./user.model')

const Comment = require('./comment.model')

const CommentReply = seq.define('sc_comment_reply', {
  comment_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '评论id'
  },
  comment_reply_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: '回复目标id'
  },
  comment_reply_content: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: '回复内容'
  },
  from_user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '回复用户id'
  },
  to_user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '目标用户id'
  }
})

CommentReply.belongsTo(Comment, {
  foreignKey: 'comment_id',
  onDelete: "CASCADE"
})

CommentReply.belongsTo(User, {
  foreignKey: 'from_user_id',
  onDelete: "CASCADE"
})

CommentReply.belongsTo(User, {
  foreignKey: 'to_user_id',
  onDelete: "NO ACTION"
})

CommentReply.belongsTo(CommentReply, {
  foreignKey: 'comment_reply_id',
  onDelete: "CASCADE"
})


// 轻质同步数据库(创建数据表)
// CommentReply.sync({ force: true })
module.exports = CommentReply