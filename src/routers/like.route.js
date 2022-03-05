/*
 * @Author: cos
 * @Date: 2022-02-25 13:55:42
 * @LastEditTime: 2022-03-05 09:25:39
 * @LastEditors: lihao
 * @Description: 点赞管理相关路由
 * @FilePath: \campus-community-backend\src\routers\like.route.js
 */

const Router = require('koa-router')
const { auth } = require('../middleware/auth.middleware')
const { likeInfoValidate, likeNoExistValidate, likeIDValidate, likeExistValidate, likeOwnValidate, likeCountParamsValidate } = require('../middleware/like.middleware')
const { addLike, countLike, cancelLike, countUserAllLikes } = require('../controller/like.controller')
const { verifyAdmin, verifyActive } = require('../middleware/user.middleware')

const router = new Router({prefix: '/likes'})

router.post('/add', auth, likeInfoValidate, likeNoExistValidate, addLike)
router.get('/count', likeCountParamsValidate, countLike)
// 管理员根据id取消点赞
router.delete('/deleteByID', auth, verifyAdmin, likeIDValidate, likeExistValidate, cancelLike)  
// 用户取消自己的点赞记录 只能取消自己的
router.delete('/delete', auth, likeInfoValidate, likeOwnValidate, cancelLike)  

// 根据用户id查询用户被点赞总数
router.get('/countUserAllLikes', auth, countUserAllLikes)

module.exports = router