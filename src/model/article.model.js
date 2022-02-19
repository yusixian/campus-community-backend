/*
 * @Author: cos
 * @Date: 2022-02-18 13:57:27
 * @LastEditTime: 2022-02-18 15:37:04
 * @LastEditors: cos
 * @Description: 文章类型 
 * @FilePath: \campus-community-backend\src\model\article.model.js
 */

const { DataTypes } = require('sequelize')

const seq = require('../db/seq')

// 创建模型(表名自动复数化)
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
    }
})
// 强制同步数据库(创建数据表Article，若存在则删除再建)
// Article.sync({ force: true })

module.exports = Article