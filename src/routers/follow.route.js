/*
 * @Author: 41
 * @Date: 2022-03-03 16:26:23
 * @LastEditors: 41
 * @LastEditTime: 2022-03-03 17:28:23
 * @Description: 
 */
const Router = require('koa-router')

const router = new Router({ prefix: '/follows' })

// 导入controller
const { addfollow, findfollow, delfollow } = require('../controller/follow.controller')
const { auth } = require('../middleware/auth.middleware')
const { iffollow } = require('../middleware/follow.middleware')
// GET 
router.post('/addfollow', auth, iffollow, addfollow)
router.get('/findfollow', findfollow)
router.post('/delfollow', auth, delfollow)
module.exports = router