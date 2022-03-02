/*
 * @Author: lihao
 * @Date: 2022-03-02 16:23:38
 * @LastEditors: lihao
 * @LastEditTime: 2022-03-02 17:59:01
 * @FilePath: \campus-community-backend\src\utils\oos\oosUtils.js
 * @Description: 
 * 
 * Copyright (c) 2022 by 用户/公司名, All Rights Reserved. 
 */

// 上传到七牛
let qiniu = require('qiniu'); // 需要加载qiniu模块的
const fs = require('fs')
// 引入key文件
const QINIU = require('./oosConfig')

/**
 * 
 * @param {*} file 从请求头中拿到的文件对象
 * @returns 
 */
const upToQiniu = (file) => {
    let fileName = file.name
    const accessKey = QINIU.accessKey
    const secretKey = QINIU.secretKey
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
    // bucket是存储空间名称
    const options = {
      scope: QINIU.bucket
    }
    const putPolicy =  new qiniu.rs.PutPolicy(options);
    // 生成token 作为个人七牛云账号的识别标识
    const uploadToken= putPolicy.uploadToken(mac);
    const config= new qiniu.conf.Config()
    // 空间对应的机房 一定要按自己属区Zone对象
    config.zone = qiniu.zone.Zone_z0
    const localFile = fs.createReadStream(file.path)
    const formUploader = new qiniu.form_up.FormUploader(config)
    const putExtra = new qiniu.form_up.PutExtra()
    // 文件上传
    return new Promise((resolved, reject) => {
      // 以文件流的形式进行上传
      // uploadToken是token， key是上传到七牛后保存的文件名, localFile是流文件
      // putExtra是上传的文件参数，采用源码中的默认参数
      formUploader.putStream(uploadToken, fileName, localFile, putExtra, function (respErr, respBody, respInfo) {
        if (respErr) {
          reject(respErr)
        } else {
          resolved('http://' + QINIU.origin + '/' + respBody.key)
        }
        fs.unlink(file.path, (err) => {
          if (err) {
            console.log(err);
            return false
          }
          console.log("文件删除成功！");
        })
      })
    })
  }

  module.exports = {
    upToQiniu
}