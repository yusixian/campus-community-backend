/*
 * @Author: lihao
 * @Date: 2022-02-19 15:02:42
 * @LastEditors: lihao
 * @LastEditTime: 2022-02-28 19:48:00
 * @FilePath: \campus-community-backend\src\service\partition.service.js
 * @Description: 分区管理 partition
 */
const Partition = require('../model/partition.model')
const { Op } = require("sequelize");
class PartitionService {
  /**
   * 添加分区
   * @param {*} partition_name 分区名称 
   * @param {*} partition_desc 分区描述
   * @param {*} cre_user_id 创建分区的用户id
   * @returns 
   */
  async createPartition(partition_name, partition_desc, cre_user_id, icon) {
    const res = await Partition.create({
      partition_name,
      partition_desc, 
      cre_user_id,
      icon
    })
    return res.dataValues 
  }
  /**
   * 分区是否存在
   * @param {*} partition_name 分区名称
   * @returns 
   */
  async partitionIsExited(partition_name) {
    const res = await Partition.count({
      where: {
        partition_name: {
          [Op.eq]: partition_name
        }
      }
    })
    return res
  }
  /**
   * 删除分区
   * @param {*} id 分区id
   * @returns 
   */
  async delPartitionById(id) {
    const res = await Partition.destroy({
      where: {
        id: {
          [Op.eq]: id
        }
      }
    })
    return res
  }
  /**
   * 查询所有的分区
   * @returns 
   */
  async selectAllPartition() {
    const res = await Partition.findAll()
    return res
  } 
  /**
   * 根据分区id查询id是否存在
   * @param {*} id 被查询的分区id
   * @returns 
   */
  async selectPartitionCountById(id) {
    const res = await Partition.count({
      where:{
        id: {
          [Op.eq]: id
        }
      }
    })
    return res
  }
}

module.exports = new PartitionService()