/*
 * @Author: 41
 * @Date: 2022-02-16 18:54:32
 * @LastEditors: cos
 * @LastEditTime: 2022-02-26 16:41:52
 * @Description: 
 */
module.exports = {
  userFormateError: {
    code: 10001,
    message: '用户名或密码为空',

  },
  userAlreadtExited: {
    code: 10002,
    message: '用户已经存在',

  },
  userRegisterError: {
    code: 10003,
    message: '用户注册错误',

  },
  userDosNotExist: {
    code: 10004,
    message: '用户不存在',

  },
  userLoginError: {
    code: 10005,
    message: '用户登录失败',

  },
  invalidPassword: {
    code: 10006,
    message: '密码不匹配',

  },
  changePasswordError: {
    code: 10007,
    message: '修改密码失败',

  },
  adminError: {
    code: 10008,
    message: '没有管理员权限',
  },
  userChangeError: {
    code: 10009,
    message: '用户状态改变失败',
  },
  changeAdminError: {
    code: 10010,
    message: '管理员状态改变失败',
  },
  changeNameError: {
    code: 10011,
    message: '昵称改变失败',
  },
  changeCityError: {
    code: 10012,
    message: '城市改变失败',
  },
  changeSexError: {
    code: 10013,
    message: '性别改变失败',
  },
  sexError: {
    code: 10014,
    message: '输入的性别不符合要求',
  },
  findError: {
    code: 10015,
    message: '查询错误！',
  },
  resetError: {
    code: 10016,
    message: '密码重置错误！',
  },
  tokenExpiredError: {
    code: 10101,
    message: 'token已过期',

  },
  invalidToken: {
    code: 10102,
    message: 'token无效',

  },
  unAuthorizedError: {
    code: 10103,
    message: '未授权,当前请求需要管理员权限',

  },
  // 文章相关errorType
  articleIDError: {
    code: 11000,
    message: '文章id不可以为空'
  },
  articleCreateError: {
    code: 11001,
    message: '发帖失败'
  },
  articleDeleteError: {
    code: 11002,
    message: '删除文章失败'
  },
  articleParamsError: {
    code: 11003,
    message: '文章标题或内容为空'
  },
  articleDosNotExist: {
    code: 11004,
    message: '该文章不存在！'
  },
  articleUpdateError: {
    code: 11005,
    message: '更新文章失败'
  },
  articleShieldError: {
    code: 11006,
    message: '屏蔽文章失败'
  },
  articleRestoreError: {
    code: 11007,
    message: '恢复文章失败，该文章可能未被屏蔽'
  },
  articleFilterParamsError: {
    code: 11008,
    message: '过滤参数错误，请检查query参数正确性'
  },

  // 分区管理 partition
  partitionCreateErr: {
    code: 12001,
    message: '创建分区失败',

  },
  partitionIsExitedErr: {
    code: 12002,
    message: '分区已存在',

  },
  partitionFormateError: {
    code: 12003,
    message: '分区名称不可以为空',

  },
  partitionDeleteError: {
    code: 12004,
    message: '分区删除失败',

  },
  partitionIdError: {
    code: 12005,
    message: '分区id为空',

  },
  partitionQueryALLError: {
    code: 12006,
    message: '查询所有分区失败',

  },
  partitionIsNotExitedErr: {
    code: 12007,
    message: '分区不存在',

  },
  // 评论，comment
  commentCreateError: {
    code: 13001,
    message: '评论失败',

  },
  commentCreateInfoFormateError: {
    code: 13002,
    message: '评论内容和评论文章不可以为空',

  },
  commentIdFormateError: {
    code: 13003,
    message: '评论id不可以为空',

  },
  commentDeleteFailedError: {
    code: 13004,
    message: '评论删除失败',

  },
  commentSelectByArticleIdFailedError: {
    code: 13005,
    message: '查询评论失败',
  },
  fileUploadError: {
    code: 13000,
    message: '资源上传失败',

  },

  // 点赞 Like
  likeIdError: {
    code: 14000,
    message: '点赞记录ID不合法！'
  },
  likeParamsError: {
    code: 14001,
    message: '点赞参数不合法！'
  },
  likeCreateError: {
    code: 14002,
    message: '添加点赞记录失败！'
  },
  likeRepeatError: {
    code: 14003,
    message: '点赞重复，该用户已点赞过！'
  },
  likeOperationError: {
    code: 14004,
    message: '点赞接口操作失败'
  },
  likeDosNotExistError: {
    code: 14005,
    message: '该点赞记录不存在！'
  },
  likeOwnError: {
    code: 14006,
    message: '操作失败！不是自己的点赞！'
  }
}
