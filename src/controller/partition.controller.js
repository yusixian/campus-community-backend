/*
 * @Author: lihao
 * @Date: 2022-02-19 15:26:12
 * @LastEditors: lihao
 * @LastEditTime: 2022-02-28 20:46:40
 * @FilePath: \campus-community-backend\src\controller\partition.controller.js
 * @Description:分区管理 partition
 */
const path = require("path")
const { createPartition, delPartitionById, selectAllPartition } = require('../service/partition.service')
const { partitionCreateErr, partitionDeleteError, partitionQueryALLError, fileUploadError } = require('../constant/err.type')

class PartitionController {
  /**
   * 创建分区
   * @param {*} ctx 上下文
   * @param {*} next 
   */
  async insertPartition(ctx, next) {
    let { partition_name, partition_desc, icon } = ctx.request.body;
    if (!icon) {
      icon = "apps-o"
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
    const {file} = ctx.request.files
    console.log(file);
    try{
      let imgPath =  '/uploads/' + path.basename(file.path)
      ctx.body = {
        code: 0,
        message: "分区图片上传成功！",
        result: {
          imgPath
        }
      }
    }catch(err) {
      console.log(err);
      return ctx.app.emit('error', fileUploadError, ctx)
    }
  }
}

module.exports = new PartitionController()