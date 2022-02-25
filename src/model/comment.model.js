/*
 * @Author: lihao
 * @Date: 2022-02-21 13:29:28
 * @LastEditors: lihao
 * @LastEditTime: 2022-02-25 16:50:26
 * @FilePath: \campus-community-backend\src\model\comment.model.js
 * @Description: 评论的model
 */

const { DataTypes } = require('sequelize')

const seq = require('../db/seq')

const User = require('./user.model')

const Article = require('./article.model')

// 创建模型(表会自己加s)
const Comment = seq.define('sc_Comment', {
  // id会被sequelize自动创建，管理
  comment_content: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: '评论的内容'
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '发出评论的用户id'
  },
  article_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '被评论的文章id'
  }
},
//  {
//   // 软删除
//   paranoid: true,
// }
)

Comment.belongsTo(User, {
  foreignKey: 'user_id'
})

Comment.belongsTo(Article, {
  foreignKey: 'article_id'
})

// 轻质同步数据库(创建数据表)
// Comment.sync({ force: true })
module.exports = Comment

