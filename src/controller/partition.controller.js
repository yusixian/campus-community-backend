/*
 * @Author: lihao
 * @Date: 2022-02-19 15:26:12
 * @LastEditors: lihao
 * @LastEditTime: 2022-02-25 10:58:41
 * @FilePath: \campus-community-backend\src\controller\partition.controller.js
 * @Description:分区管理 partition
 */

const { createPartition, delPartitionById, selectAllPartition } = require('../service/partition.service')
const { partitionCreateErr, partitionDeleteError, partitionQueryALLError } = require('../constant/err.type')

class PartitionController {
  /**
   * 创建分区
   * @param {*} ctx 上下文
   * @param {*} next 
   */
  async insertPartition(ctx, next) {
    const { partition_name, partition_desc } = ctx.request.body;
    try {
      const res = await createPartition(partition_name, partition_desc, ctx.state.user.id)
      ctx.body = {
        code: 0,
        message: "分区创建成功"
      }
    } catch (err) {
      console.log(err);
      ctx.app.emit('error', partitionCreateErr, ctx)
    }
  }
  /**
   * 删除分区
   * @param {*} ctx 
   * @param {*} next 
   */
  async deletePartition(ctx, next) {
    const { id } = ctx.request.query;
    try {
      const res = await delPartitionById(id)
      ctx.body = {
        code: 0,
        message: "分区删除成功",
        
      }
    } catch (err) {
      console.log(err);
      ctx.app.emit('error', partitionDeleteError, ctx)
    }
  }
  /**
   * 查询所有的分区
   * @param {*} ctx 
   * @param {*} next 
   */
  async queryAllPartition(ctx, next) {
    try {
      const res = await selectAllPartition()
      ctx.body = {
        code: 0,
        message: "查询所有分区成功",
        result: res
      }
    } catch (err) {
      console.log(err);
      ctx.app.emit('error', partitionQueryALLError, ctx)
    }
  }
}

module.exports = new PartitionController()