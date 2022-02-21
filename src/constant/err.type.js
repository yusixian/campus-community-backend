/*
 * @Author: 41
 * @Date: 2022-02-16 18:54:32
 * @LastEditors: 41
 * @LastEditTime: 2022-02-21 10:06:40
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
  changePasswordError: {
    code: '10007',
    message: '修改密码失败',
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
  unAuthorizedError: {
    code: '10103',
    message: '未授权,当前请求需要管理员权限',
    result: ''
  },
  // 文章相关errorType
  articleOperationError: {
    code: '11000',
    message: '操作失败！服务器遇到未知错误'
  },
  articleCreateError: {
    code: '11001',
    message: '发帖失败'
  },
  articleDeleteError: {
    code: '11002',
    message: '删除文章失败'
  },
  articleParamsError: {
    code: '11003',
    message: '文章标题或内容为空'
  },
  articleDosNotExist: {
    code: '11004',
    message: '该文章不存在！'
  },
  articleUpdateError: {
    code: '11005',
    message: '更新文章失败'
  },
  articleShieldError: {
    code: '11006',
    message: '屏蔽文章失败'
  },
  articleRestoreError: {
    code: '11007',
    message: '恢复文章失败，该文章不存在或未被屏蔽'
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
  },
  partitionQueryALLError: {
    code: '12006',
    message: '查询所有分区失败',
    result: ''
  },
  // 评论，comment
  commentCreateError: {
    code: '13001',
    message: '评论失败',
    result: ''
  },
  commentCreateInfoFormateError: {
    code: '13002',
    message: '评论内容和评论文章不可以为空',
    result: ''
  },
  commentIdFormateError: {
    code: '13003',
    message: '评论id不可以为空',
    result: ''
  },
  commentDeleteFailedError: {
    code: '13004',
    message: '评论删除失败',
    result: ''
  },
  commentSelectByArticleIdFailedError: {
    code: '13005',
    message: '查询评论失败',
  },
  fileUploadError: {
    code: '13000',
    message: '资源上传失败',
    result: ''
  }
  
}
