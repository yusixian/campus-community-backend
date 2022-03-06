/*
 * @Author: 41
 * @Date: 2022-03-03 16:26:23
 * @LastEditors: 41
 * @LastEditTime: 2022-03-06 21:20:50
 * @Description: 
 */
const Router = require('koa-router')

const router = new Router({ prefix: '/follows' })

// 导入controller
const { addfollow, findfollow, delfollow, ornot, getfollowList } = require('../controller/follow.controller')
const { auth } = require('../middleware/auth.middleware')
const { iffollow } = require('../middleware/follow.middleware')
// GET 
// 查询是否关注的接口
router.get('/ornot', auth, ornot)
// 获得关注列表的接口
router.get('/findfollow', findfollow)
// 获得粉丝列表的接口
router.get('/allfollow', getfollowList)
// 取消关注的接口
router.post('/delfollow', auth, delfollow)
// 添加关注的接口
router.post('/addfollow', auth, iffollow, addfollow)

module.exports = router