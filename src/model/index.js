/*
 * @Author: 41
 * @Date: 2022-02-25 09:50:54
 * @LastEditors: 41
 * @LastEditTime: 2022-03-04 09:23:57
 * @Description: 
 */
const User = require('./user.model')
const Partition = require('./partition.model')
const Article = require('./article.model')
const Comment = require('./comment.model')
const CommentReply = require('./commentReply.model')
const Like = require('./like.model')
const Collection = require('./collection.model')
const Follow = require('./follow.model')
const init = async () => {
  await User.sync({ alter: true })
  await Partition.sync({ alter: true })
  await Article.sync({ alter: true })
  await Collection.sync({ alter: true })
  await Comment.sync({ alter: true })
  await CommentReply.sync({ alter: true })
  await Like.sync({ alter: true })
  await Follow.sync({ alter: true })
}
const drop = async () => {
  await Like.drop()
  await CommentReply.drop()
  await Comment.drop()
  await Collection.drop()
  await Article.drop()
  await Partition.drop()
  await Follow.drop()
  await User.drop()

}
const forceInit = async () => {
  await drop()
  await init()
}
init() // 软更新
// forceInit() // 硬更新
