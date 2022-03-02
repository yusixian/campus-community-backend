/*
 * @Author: lihao
 * @Date: 2022-02-19 15:26:12
 * @LastEditors: lihao
 * @LastEditTime: 2022-03-02 17:52:40
 * @FilePath: \campus-community-backend\src\controller\partition.controller.js
 * @Description:分区管理 partition
 */
const path = require("path")
const { createPartition, delPartitionById, selectAllPartition, updatePartitionById } = require('../service/partition.service')
const { partitionCreateErr, partitionDeleteError, partitionQueryALLError, fileUploadError, updatePartitionByIdError } = require('../constant/err.type')
const { upToQiniu } = require('../utils/oos/oosUtils')
class PartitionController {
  /**
   * 创建分区
   * @param {*} ctx 上下文
   * @param {*} next 
   */
  async insertPartition(ctx, next) {
    let { partition_name, partition_desc, icon } = ctx.request.body;
    if (!icon) {
      icon = "http://dummyimage.com/100x100"
    }
    try {
      const res = await createPartition(partition_name, partition_desc, ctx.state.user.id, icon)
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
  /**
   * 上传分区图片
   * @param {*} ctx 
   * @param {*} next 
   * @returns 
   */
  async uploadPartitionIcon(ctx, next) {
    const { file } = ctx.request.files
    console.log(file.name);
    try {
      const res = await upToQiniu(file)
      ctx.body = {
        code: 0,
        message: "分区图片上传成功！",
        result: {
          imgPath: res
        }
      }
    } catch (err) {
      console.log(err);
      return ctx.app.emit('error', fileUploadError, ctx)
    }
  }

  async updatePartitionByPid(ctx, next) {
    const { id, partition_name, partition_desc, icon } = ctx.request.body
    let cre_user_id = ctx.state.user.id
    const newPartition = { cre_user_id }
    partition_name && Object.assign(newPartition, { partition_name })
    partition_desc && Object.assign(newPartition, { partition_desc })
    icon && Object.assign(newPartition, { icon })
    try {
      const res = await updatePartitionById(id, newPartition)
      ctx.body = {
        code: 0,
        message: "修改分区成功"
      }
    } catch (err) {
      console.log(err);
      ctx.app.emit('error', updatePartitionByIdError, ctx)
    }
  }
}

module.exports = new PartitionController()