/*
 * @Author: 41
 * @Date: 2022-02-25 09:50:54
 * @LastEditors: 41
 * @LastEditTime: 2022-02-25 10:54:26
 * @Description: 
 */
const User = require('./user.model')
const Partition = require('./partition.model')
const Article = require('./article.model')
const Comment = require('./comment.model')
const init = async () => {
  await User.sync({ alter: true })
  await Partition.sync({ alter: true })
  await Article.sync({ alter: true })
  await Comment.sync({ alter: true })
}
const drop = async () => {
  await Comment.drop()
  await Article.drop()
  await Partition.drop()
  await User.drop()
}
const forceInit = async () => {
  await drop()
  await init()
}
// init() // 软更新
// forceInit() // 硬更新
