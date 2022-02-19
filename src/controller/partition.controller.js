/*
 * @Author: lihao
 * @Date: 2022-02-19 15:26:12
 * @LastEditors: lihao
 * @LastEditTime: 2022-02-19 17:38:53
 * @FilePath: \campus-community-backend\src\controller\partition.controller.js
 * @Description:分区管理 partition
 */

const { createPartition, delPartitionById } = require('../service/partition.service')
const { partitionCreateErr, partitionDeleteError } = require('../constant/err.type')

class PartitionController {
  /**
   * 创建分区
   * @param {*} ctx 上下文
   * @param {*} next 
   */
  async insertPartition(ctx, next) {
    console.log(ctx.request.body);
    const { partition_name, partition_desc } = ctx.request.body;
    try {
      const res = await createPartition(partition_name, partition_desc, ctx.state.user.id)
      ctx.body = {
        code: 0,
        message: "分区创建成功",
        result: ''
      }
    } catch (err) {
      ctx.app.emit('error', partitionCreateErr, ctx)
    }
  }
  /**
   * 删除分区
   * @param {*} ctx 
   * @param {*} next 
   */
  async deletePartition(ctx, next) {
    console.log(ctx.request.body);
    const { id } = ctx.request.query;
    try {
      const res = await delPartitionById(id)
      ctx.body = {
        code: 0,
        message: "分区删除成功",
        result: ''
      }
    } catch (err) {
      ctx.app.emit('error', partitionDeleteError, ctx)
    }
  }
}

module.exports = new PartitionController()