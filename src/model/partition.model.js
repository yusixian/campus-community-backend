/*
 * @Author: lihao
 * @Date: 2022-02-19 14:31:15
 * @LastEditTime: 2022-02-19 17:19:10
 * @LastEditors: lihao
 * @Description: 分区管理 partition
 * @FilePath: \campus-community-backend\src\model\partition.model.js
 */
const { DataTypes } = require('sequelize')

const seq = require('../db/seq')

// 创建模型(表会自己加s)
const Partition = seq.define('sc_Partition', {
  // id会被sequelize自动创建，管理
  partition_name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '分区的名称'
  },
  partition_desc: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '分区的描述'
  },
  cre_user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '创建分区的用户id'
  }
})
// 轻质同步数据库(创建数据表)
// Partition.sync({ force: true })
module.exports = Partition