<!--
 * @Author: 41
 * @Date: 2022-02-15 21:08:52
 * @LastEditors: 41
 * @LastEditTime: 2022-02-16 00:39:24
 * @Description: 
-->
### 1.nodemon安装的时候加-D
这样就只会在开发依赖里面添加，我们项目真实上线的时候就不会下载这个依赖

### 2.mysql的版本需要5.7以上

### 3.mysql2和sequelize必须要添加到依赖。就是`--save`才可以成功连接数据库

### 4.npm下载不动使用cnpm下载