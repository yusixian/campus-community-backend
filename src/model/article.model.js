/*
 * @Author: cos
 * @Date: 2022-02-18 13:57:27
 * @LastEditTime: 2022-03-05 22:49:02
 * @LastEditors: cos
 * @Description: 文章类型 
 * @FilePath: \campus-community-backend\src\model\article.model.js
 */

const { DataTypes } = require('sequelize')

const seq = require('../db/seq')

const User = require('./user.model')
const Partition = require('./partition.model')
// 创建模型(表名自动复数化)
// paranoid 表是一个被告知删除记录时不会真正删除它的表.反而一个名为 deletedAt 的特殊列会将其值设置为该删除请求的时间戳
const Article = seq.define('sc_Article', {
  // id会被sequelize自动创建，管理
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '发帖用户id'
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
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 3,
    comment: '0已发布 1被屏蔽 2为回收站 3为待审核 默认为3'
  },
  cover_url: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '',
    comment: '文章封面url，初始为空'
  }
  // Sequelize 会自动创建and更新两个字段：createdAt和updateAt
}, {
  // 定义这个属性实现调用destroy时软删除 Sequelize自动管理字段deleteAt 
  // 通过destroy时的参数force: true实现硬删除
  paranoid: true,
})
Article.belongsTo(User, {
  foreignKey: 'user_id'
})
Article.belongsTo(Partition, {
  foreignKey: 'partition_id'
})
// 强制同步数据库(创建数据表Ariticle，若存在则删除再建)
// Article.sync({ alter: true })
module.exports = Article