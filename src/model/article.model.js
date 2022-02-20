/*
 * @Author: cos
 * @Date: 2022-02-18 13:57:27
 * @LastEditTime: 2022-02-20 21:55:48
 * @LastEditors: 41
 * @Description: 文章类型 
 * @FilePath: \campus-community-backend\src\model\article.model.js
 */

const { DataTypes } = require('sequelize')

const seq = require('../db/seq')

// 创建模型(表名自动复数化)
// paranoid 表是一个被告知删除记录时不会真正删除它的表.反而一个名为 deletedAt 的特殊列会将其值设置为该删除请求的时间戳
const Article = seq.define('sc_Article', {
  // id会被sequelize自动创建，管理
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '发帖用户id'
  },
  user_name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '发帖用户名'
  },
  is_admin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: 0,
    comment: '是否为管理员,0:不是管理员(默认) 1:管理员'
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '文章标题'
  },
  summary: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '摘要，纯文本'
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: '发帖内容，可以是富文本'
  },
  partition_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    comment: '分区id，未选则默认为1，即无分区'
  },
  comments: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: '评论数， 初始为0'
  },
  likes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: '点赞数， 初始为0'
  },
  collections: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: '收藏数 初始为0'
  },
  visits: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: '浏览数， 初始为0'
  }
  // Sequelize 会自动创建and更新两个字段：createdAt和updateAt
}, {
  // 定义这个属性实现调用destroy时软删除 Sequelize自动管理字段deleteAt 
  // 通过destroy时的参数force: true实现硬删除
  paranoid: true,
})
// 强制同步数据库(创建数据表Ariticle，若存在则删除再建)
// Article.sync({ force: true })

module.exports = Article