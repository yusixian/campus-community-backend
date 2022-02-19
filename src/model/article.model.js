/*
 * @Author: cos
 * @Date: 2022-02-18 13:57:27
 * @LastEditTime: 2022-02-19 22:56:16
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
    }
})
// 强制同步数据库(创建数据表Ariticle，若存在则删除再建)
// Article.sync({ force: true })

module.exports = Article