/*
 * @Author: cos
 * @Date: 2022-02-18 15:10:21
 * @LastEditTime: 2022-02-18 15:10:21
 * @LastEditors: cos
 * @Description: 文章相关中间件
 * @FilePath: \campus-community-backend\src\middleware\article.middleware.js
 */

const { getUserInfo } = require('../service/article.service')
const { articleCreateErr } = require('../constant/err.type')