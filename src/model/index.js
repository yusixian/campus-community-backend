/*
 * @Author: 41
 * @Date: 2022-02-25 09:50:54
 * @LastEditors: 41
 * @LastEditTime: 2022-02-25 10:20:04
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
// init()
