/*
 * @Author: cos
 * @Date: 2022-02-25 13:27:01
 * @LastEditTime: 2022-02-25 17:55:17
 * @LastEditors: cos
 * @Description: 文章点赞数据模型
 * @FilePath: \campus-community-backend\src\model\like.model.js
 */
const { DataTypes } = require('sequelize')

const seq = require('../db/seq')
const Article = require('./article.model')
const Comment = require('./comment.model')
const User = require('./user.model')
// 创建模型(表名自动复数化)
const Like = seq.define('sc_Like', {
  // id会被sequelize自动创建，管理
  user_id:{
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '发起点赞的用户id'
  },
  type: {
    type: DataTypes.CHAR(20),
    allowNull: false,
    defaultValue: "article",
    comment: '点赞对象：article文章 comment评论'
  },
  article_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
    comment: '点赞文章id, type为article时存在'
  },
  comment_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
    comment: '点赞评论id, type为comment时存在'
  }
  // Sequelize 会自动创建and更新两个字段：createdAt和updateAt
})
Like.belongsTo(User, {
  foreignKey: 'user_id'
})
Like.belongsTo(Article, {
  foreignKey: 'article_id'
})
Like.belongsTo(Comment, {
  foreignKey: 'comment_id'
})
// 强制同步数据库(创建数据表)
// Like.sync({ force: true })
module.exports = Like