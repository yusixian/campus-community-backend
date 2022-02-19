/*
 * @Author: lihao
 * @Date: 2022-02-19 16:40:39
 * @LastEditors: lihao
 * @LastEditTime: 2022-02-19 17:38:09
 * @FilePath: \campus-community-backend\src\middleware\partition.middleware.js
 * @Description: partition 中间件
 */

const { partitionIsExited } = require('../service/partition.service')

const { partitionIsExitedErr, partitionFormateError, partitionIdError} = require('../constant/err.type')

// 判断分区名称是否合法
const partitionValidator = async (ctx, next) => {
  const { partition_name } = ctx.request.body
  // 合法性
  if (!partition_name) {
    ctx.app.emit('error', partitionFormateError, ctx)
    return
  }
  await next()
}
// 判断分区名称是否唯一
const partitionIsUni = async (ctx, next) => {
  const { partition_name } = ctx.request.body
  if (await partitionIsExited(partition_name)) {
    ctx.app.emit('error', partitionIsExitedErr, ctx)
    return
  }
  await next()
}
// 判断分区id是否合法
const partitionIdIsNull = async (ctx, next) => {
  const { id } = ctx.request.query
  if (!id) {
    ctx.app.emit('error', partitionIdError, ctx)
    return
  }
  await next()
}

module.exports = {
  partitionValidator,
  partitionIsUni,
  partitionIdIsNull
}

