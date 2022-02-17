<!--
 * @Author: 41
 * @Date: 2022-02-15 14:52:44
 * @LastEditors: 41
 * @LastEditTime: 2022-02-17 16:54:50
 * @Description: 
-->
[toc]
# 项目说明
- 本项目是百度晋级班第一题:校园社区的后端
- 本项目基于koa框架
### 使用必备
文档都在项目中！！！
- 本项目的接口文档
- 本项目的开发文档
- 本项目的bug回忆录
- 本项目的开发记录文档
***
# 使用说明
### 数据库的相关配置
- 1.在本地打开数据库(一般都是默认打开的mysql)
如果没有打开使用cmd命令`net start mysql`就可以了
- 2.登录数据库后建立一个数据库,比如名字叫`schoolcommunity`
当然你可以用`navicat`来创建,会简单不少
- 3.在本项目的`.env`文件中更新mysql的相关配置
- 4.在`model/user.model.js`中取消注释`// User.sync({ force: true })`
- 5.使用命令`npm run createDB`来创建用户的数据表
- 6.在`model/user.model.js`中重新注释`// User.sync({ force: true })`

### 本地运行
```BASH
npm run dev
或
yarn dev
```