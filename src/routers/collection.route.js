/*
 * @Author: cos
 * @Date: 2022-03-02 12:09:58
 * @LastEditTime: 2022-03-02 18:43:21
 * @LastEditors: cos
 * @Description: 收藏相关路由
 * @FilePath: \campus-community-backend\src\routers\collection.route.js
 */
const Router = require('koa-router')
const { addCollection, countCollection, cancelCollection, getCollentionList, deleteCollection } = require('../controller/collection.controller')
const { auth } = require('../middleware/auth.middleware')
const { collectionInfoValidate, collectionNoExistValidate, collectionIDValidate, collectionExistValidate, collectionOwnValidate } = require('../middleware/collection.middleware')
const { verifyAdmin, verifyActive } = require('../middleware/user.middleware')

const router = new Router({prefix: '/collections'})

router.get('/count', collectionInfoValidate, countCollection)
router.post('/add', auth, verifyActive, collectionInfoValidate, collectionNoExistValidate, addCollection)
router.delete('/cancel', auth, verifyActive, collectionInfoValidate, collectionOwnValidate, cancelCollection)  // 用户取消自己收藏记录 只能取消自己的
router.get('/getlist', auth, verifyActive, getCollentionList)
// 管理员权限 
router.delete('/deleteByID', auth, verifyActive, verifyAdmin, collectionIDValidate, deleteCollection) 

module.exports = router