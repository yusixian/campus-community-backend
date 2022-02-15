<!--
 * @Author: 41
 * @Date: 2022-02-15 14:52:44
 * @LastEditors: 41
 * @LastEditTime: 2022-02-15 16:43:08
 * @Description: 
-->
# 项目说明
- 本项目是百度晋级班第一题:校园社区的后端
- 本项目基于koa框架
***
# 搭建过程记录
## 一.项目初始化
### 1.npm初始化
```bash
npm init -y
```
生成`package.json`文件:
- 记录项目的依赖

### 2.git初始化
```bash
git init
```
生成`.git`隐藏文件夹,git的本地仓库

### 3.创建readme文件

## 二.搭建项目
### 1.安装Koa框架
```bash
npm install koa
```
### 2.编写最基础的app
创建`src/main.js`
```javascript
// 导入包
const Koa = require('koa')
// 创建app实例
const app = new Koa()
// 创建中间件
app.use((ctx, next) => {
  ctx.body = 'hello api'
})
// 监听端口
app.listen(3000, () => {
  console.log('server is running on http://localhost:3000');
})
```
### 3.测试
在终端，使用`node src/main.js`

## 三.项目的基本优化
### 1.自动重启服务
- 安装nodemon工具
```bash
npm i nodemon
```
- 编写package.json脚本
```json
  "scripts": {
    "dev": "nodemon ./src/main.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
```
- 执行`npm run dev`启动服务

### 2.读取配置文件
- 安装`dotenv`，读取根目录中的`.env`文件，将配置写`process.nev`中
```bash
npm i dotenv
```
- 创建`.env`文件
```bash
APP_PORT=8000
```
- 创建`src/config.config.default.js`

```javascript
// 导入包
const dotenv = require('dotenv')
// 获取信息
dotenv.config()

// console.log(process.env.APP_PORT);

// 导入对象
module.exports = process.env
```
- 改写`main.js` 导入配置和使用模板字符串