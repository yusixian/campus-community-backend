/*
 * @Author: 41
 * @Date: 2022-02-16 18:54:32
 * @LastEditors: lihao
 * @LastEditTime: 2022-02-19 17:32:41
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
  },

  // 分区管理 partition
  partitionCreateErr: {
    code: '12001',
    message: '创建分区失败',
    result: ''
  },
  partitionIsExitedErr: {
    code: '12002',
    message: '分区已存在',
    result: ''
  },
  partitionFormateError: {
    code: '12003',
    message: '分区名称不可以为空',
    result: ''
  },
  partitionDeleteError: {
    code: '12004',
    message: '分区删除失败',
    result: ''
  },
  partitionIdError: {
    code: '12005',
    message: '分区id为空',
    result: ''
  }
}
