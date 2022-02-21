/*
 * @Author: lihao
 * @Date: 2022-02-19 15:49:46
 * @LastEditors: lihao
 * @LastEditTime: 2022-02-21 18:23:34
 * @FilePath: \campus-community-backend\src\routers\partition.route.js
 * @Description: 分区 partition
 */

const Router = require('koa-router')

const router = new Router({ prefix: '/partition' })

// 导入 partition controller
const {insertPartition, deletePartition, queryAllPartition} = require('../controller/partition.controller');

// 导入鉴权中间件
const { auth } = require('../middleware/auth.middleware')
const {partitionValidator, partitionIsUni, partitionIdIsNull} = require('../middleware/partition.middleware')

// 创建分区的接口
router.post('/insertPartition', auth, partitionValidator, partitionIsUni, insertPartition)

// 删除分区的接口
router.delete('/deletePartition', auth, partitionIdIsNull, deletePartition)

// 查询所有分区的接口
router.get('/queryAllPartition', auth, queryAllPartition)

module.exports = router

