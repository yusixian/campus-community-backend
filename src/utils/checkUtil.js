/*
 * @Author: cos
 * @Date: 2022-02-26 16:22:58
 * @LastEditTime: 2022-02-26 16:37:40
 * @LastEditors: cos
 * @Description: 信息检查通用工具
 * @FilePath: \campus-community-backend\src\utils\checkUtil.js
 */
class CheckUtil {
  /**
   * @description: id检查
   * @param {any} id
   * @return {number | null} 有效id 
   */
  checkID(id) {
    if(!id) throw Error('target_id不存在！')
    try {
      id = parseInt(id) // 转换为数字
      if(id !== id) // id为NaN
        throw Error('id为NaN!')
      return id
    } catch(err) {
      console.log("id不合法！", err)
      return null
    }
  }
}
module.exports = new CheckUtil()