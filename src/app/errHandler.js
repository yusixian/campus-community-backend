/*
 * @Author: 41
 * @Date: 2022-02-16 19:01:07
 * @LastEditors: 41
 * @LastEditTime: 2022-02-16 19:02:14
 * @Description: 
 */
module.exports = (err, ctx) => {
  let status = 500
  switch (err.code) {
    case '10001':
      status = 400
      break
    case '10002':
      status = 409
      break
    default:
      status = 500
  }
  ctx.status = status
  ctx.body = err
}