/*
 * @Author: 41
 * @Date: 2022-02-16 19:01:07
 * @LastEditors: cos
 * @LastEditTime: 2022-02-23 00:45:38
 * @Description: HTTP 错误响应代码转换 https://developer.mozilla.org/zh-CN/docs/web/http/status
 */
module.exports = (err, ctx) => {
  let status = 500
  switch (err.code) {
    case '10001':   // 请求参数有误。or 语义有误
    case '11000':
    case '11003': 
      status = 400  // 400 Bad Request
      break   
    case '10103':   // 当前请求需要管理员权限，用户并非管理员，服务器拒绝请求。
      status = 403  // 403 Forbidden
      break
    case '10004':   // 请求失败，请求所希望得到的资源未被在服务器上发现
    case '11004':
      status = 404  // 404 Not Found
      break
    case '10002':   // 和被请求的资源的当前状态之间存在冲突
      status = 409  // 409 Conflict
      break
    default:        // 服务器遇到了不知道如何处理的情况。
      status = 500  // 500 Internal Server Error
  }
  ctx.status = status
  ctx.body = err
}