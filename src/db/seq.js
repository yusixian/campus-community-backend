/*
 * @Author: 41
 * @Date: 2022-02-16 00:04:26
 * @LastEditors: cos
 * @LastEditTime: 2022-02-18 13:03:30
 * @Description: 
 */
const { Sequelize } = require('sequelize')
const {
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USER,
  MYSQL_PWD,
  MYSQL_DB } = require('../config/config.default')


const seq = new Sequelize(MYSQL_DB, MYSQL_USER, MYSQL_PWD, {
  host: MYSQL_HOST,
  dialect: 'mysql',
  port: MYSQL_PORT
})

// seq.authenticate().then(() => {
//   console.log('数据库连接成功');
// }).catch(err => {
//   console.log('数据库连接失败', err);
// })
module.exports = seq