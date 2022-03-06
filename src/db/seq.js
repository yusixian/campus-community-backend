/*
 * @Author: 41
 * @Date: 2022-02-16 00:04:26
 * @LastEditors: lihao
 * @LastEditTime: 2022-03-06 23:07:29
 * @Description: 
 */
const { Sequelize } = require('sequelize')
const fs = require('fs')
const path = require('path')

const {
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USER,
  MYSQL_PWD,
  MYSQL_DB } = require('../config/config.default')

const myLogFunc = function(msg) {
  try {
    const logPath = path.join(__dirname, '../../logs/seq.log')
    const data = fs.writeFileSync(logPath, '\n'+msg, { flag: 'a+' })
    //文件写入成功。
  } catch (err) {
    console.error(err)
  }
}
const seq = new Sequelize(MYSQL_DB, MYSQL_USER, MYSQL_PWD, {
  host: MYSQL_HOST,
  dialect: 'mysql',
  port: MYSQL_PORT,
  timezone: '+08:00',
  logging: myLogFunc,
  dialectOptions: {
    dateStrings: true,
    typeCast: true
  }
})

// seq.authenticate().then(() => {
//   console.log('数据库连接成功');
// }).catch(err => {
//   console.log('数据库连接失败', err);
// })
module.exports = seq