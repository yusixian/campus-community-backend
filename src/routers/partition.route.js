/*
 * @Author: lihao
 * @Date: 2022-02-19 15:49:46
 * @LastEditors: lihao
 * @LastEditTime: 2022-03-01 23:03:40
 * @FilePath: \campus-community-backend\src\routers\partition.route.js
 * @Description: 分区 partition
 */

const Router = require('koa-router')

const router = new Router({ prefix: '/partition' })

// 导入 partition controller
const {insertPartition, deletePartition, queryAllPartition, uploadPartitionIcon} = require('../controller/partition.controller');

// 导入鉴权中间件
const { auth } = require('../middleware/auth.middleware')
const {partitionValidator, partitionIsUni, partitionIdIsNull} = require('../middleware/partition.middleware')
const {verifyAdmin} = require('../middleware/user.middleware')

// 创建分区的接口
router.post('/insertPartition', auth, verifyAdmin, partitionValidator, partitionIsUni, insertPartition)

// 删除分区的接口
router.delete('/deletePartition', auth, verifyAdmin, partitionIdIsNull, deletePartition)

// 查询所有分区的接口
router.get('/queryAllPartition', queryAllPartition)

// 上传分区图片
router.post('/uploadIcon', auth, verifyAdmin, uploadPartitionIcon)

module.exports = router

