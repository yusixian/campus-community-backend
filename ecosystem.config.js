/*
 * @Author: cos
 * @Date: 2022-03-05 20:32:31
 * @LastEditTime: 2022-03-05 20:32:31
 * @LastEditors: cos
 * @Description: PM2 自定义启动配置更改日志文件位置
 * @FilePath: \campus-community-backend\ecosystem.config.js
 */
module.exports = {
  apps : [{
    name   : "app1",
    script : "./src/main.js",
    error_file : "./logs/err.log", // 更改到logs目录下~
    out_file : "./logs/out.log",  // 更改到logs目录下~
  }]
}
