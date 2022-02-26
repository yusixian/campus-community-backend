/*
 * @Author: cos
 * @Date: 2022-02-25 13:55:42
 * @LastEditTime: 2022-02-26 16:45:39
 * @LastEditors: cos
 * @Description: 点赞管理相关路由
 * @FilePath: \campus-community-backend\src\routers\like.route.js
 */

const Router = require('koa-router')
const { auth } = require('../middleware/auth.middleware')
const { likeInfoValidate, likeNoExistValidate, likeIDValidate, likeExistValidate, likeOwnValidate } = require('../middleware/like.middleware')
const { addLike, countLike, cancelLike } = require('../controller/like.controller')
const { verifyAdmin } = require('../middleware/user.middleware')

const router = new Router({prefix: '/likes'})

router.post('/add', auth, likeInfoValidate, likeNoExistValidate, addLike)
router.get('/count', auth, likeInfoValidate, countLike)
// 管理员根据id取消点赞
router.delete('/deleteByID', auth, verifyAdmin, likeIDValidate, likeExistValidate, cancelLike)  
// 用户取消自己的点赞记录 只能取消自己的
router.delete('/delete', auth, likeInfoValidate, likeOwnValidate, cancelLike)  

module.exports = router