/*
 * @Author: 41
 * @Date: 2022-03-03 15:53:37
 * @LastEditors: 41
 * @LastEditTime: 2022-03-03 17:24:17
 * @Description: 
 */
const { DataTypes } = require('sequelize')

const seq = require('../db/seq')

const User = require('./user.model')
// 创建模型(表名自动复数化)
// paranoid 表是一个被告知删除记录时不会真正删除它的表.反而一个名为 deletedAt 的特殊列会将其值设置为该删除请求的时间戳
const Follow = seq.define('sc_follow', {
  // id会被sequelize自动创建，管理
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '发帖用户id'
  },
  follow_id: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '文章标题'
  },
  follow_name: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '摘要，纯文本'
  },
  follow_pic: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: '发帖内容，可以是富文本'
  }
  // Sequelize 会自动创建and更新两个字段：createdAt和updateAt
})
Follow.belongsTo(User, {
  foreignKey: 'user_id'
})
// 强制同步数据库(创建数据表，若存在则删除再建)
// Article.sync({ alter: true })
module.exports = Follow