/*
 * @Author: 41
 * @Date: 2022-02-16 18:54:32
 * @LastEditors: cos
 * @LastEditTime: 2022-02-18 14:38:03
 * @Description: 
 */
module.exports = {
  userFormateError: {
    code: '10001',
    message: '用户名或密码为空',
    result: ''
  },
  userAlreadtExited: {
    code: '10002',
    message: '用户已经存在',
    result: ''
  },
  userRegisterError: {
    code: '10003',
    message: '用户注册错误',
    result: ''
  },
  userDosNotExist: {
    code: '10004',
    message: '用户不存在',
    result: ''
  },
  userLoginError: {
    code: '10005',
    message: '用户登录失败',
    result: ''
  },
  invalidPassword: {
    code: '10006',
    message: '密码不匹配',
    result: ''
  },
  tokenExpiredError: {
    code: '10101',
    message: 'token已过期',
    result: ''
  },
  invalidToken: {
    code: '10102',
    message: 'token无效',
    result: ''
  },

  // 文章相关errorType
  articleCreateErr: {
    code: '11001',
    message: '发帖失败',
    result: ''
  }
}
