/*
 * @Author: cos
 * @Date: 2022-03-02 11:29:50
 * @LastEditTime: 2022-03-03 14:34:02
 * @LastEditors: lihao
 * @Description: 收藏
 * @FilePath: \campus-community-backend\src\model\collection.model.js
 */
const { DataTypes } = require('sequelize')

const seq = require('../db/seq')
const Article = require('./article.model')

const User = require('./user.model')

// 创建模型(表会自己加s)
const Collection = seq.define('sc_Collection', {
  // id会被sequelize自动创建，管理
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '进行收藏的用户id'
  },
  article_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '收藏文章的id'
  }
})
Collection.belongsTo(User, {
  foreignKey: 'user_id'
})
Collection.belongsTo(Article, {
  foreignKey: 'article_id'
})

// 轻质同步数据库(创建数据表)
// Collection.sync({ force: true })
module.exports = Collection