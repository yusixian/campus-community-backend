<!--
 * @Author: 41
 * @Date: 2022-02-15 14:52:44
 * @LastEditors: 41
 * @LastEditTime: 2022-02-16 23:08:02
 * @Description: 
-->
[toc]
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
npm i nodemon -D
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

## 四.添加路由
路由:根据不同的URL，调用对应处理函数
### 1.安装koa-router
```bash
npm i koa-router
```
- 1.导入包
- 2.实例化对象
- 3.编写路由
- 4.注册中间件
### 2.编写路由
- 创建`src/routers`目录，编写`user.route.js`
```js
const Router = require('koa-router')

const router = new Router({ prefix: '/users' })

// GET /users/
router.get('/', (ctx, next) => {
  ctx.body = 'hello users'
})

module.exports = router
```
### 3.改写main.js
- 导入路由
- 注册中间件

## 五.目录结构的优化
### 1.将http服务和app业务拆分
- 创建`src/app/index.js`
```js
// 导入包
const Koa = require('koa')
// 创建app实例
const app = new Koa()
// 导入封装好的路由
const userRouter = require('../routers/user.route')
// 创建中间件
app.use(userRouter.routes())

module.exports = app
```
***
- 改写`main.js`
```js
// 导入设置的端口号
const { APP_PORT } = require('./config/config.default')
// 导入封装的app
const app = require('./app/index')
// 监听端口
app.listen(APP_PORT, () => {
  //使用模板字符串输出端口
  console.log(`server is running on http://localhost:${APP_PORT}`);
})
```

### 2.将路由和控制器拆分
- 路由:解析URL，分发给控制器对应的方法
- 控制器:处理不同的业务
改写`user.route.js`
创建`controller/user.controller.js`

## 六.解析body
### 1.安装koa-body 
```bash
npm i koa-body
```
### 2.注册中间件
改写`app/index.js`  require+use

### 3.解析请求数据
改写`user.controller.js`
```JS
const { createUser } = require('../service/user.service')
class UserController {
  async register (ctx, next) {
    // 1.获取数据
    // console.log(ctx.request.body);
    const { user_name, password } = ctx.request.body
    // 2.操作数据库
    const res = await createUser(user_name, password)
    console.log(res);
    // 3.返回结果
    ctx.body = ctx.request.body
  }

  async login (ctx, next) {
    ctx.body = '登录成功'
  }
}

module.exports = new UserController()
```

### 4.拆分service层
service层主要是做数据库的处理
创建`src/service/user.service.js`
```JS
class UserService {
  async createUser (user_name, password) {
    // todo:写入数据库
    return '写入数据库成功'
  }
}

module.exports = new UserService()
```
## 七.数据库操作
sequelize ORM数据库工具
ORM:对象关系映射
- 数据表映射(对应)一个类
- 数据表中的数据行(记录)对应一个对象
- 数据表字段对应对象的属性
- 数据表的操作对应对象的方法
### 1.安装sequelize
```bash
npm i mysql2 sequelize --save
```
### 2.连接数据库
```js
const { Sequelize } = require('sequelize')
const {
  MYSQL_HOST,
  MYSQL_PROT,
  MYSQL_USER,
  MYSQL_PWD,
  MYSQL_DB } = require('../config/config.default')


const seq = new Sequelize(MYSQL_DB, MYSQL_USER, MYSQL_PWD, {
  host: MYSQL_HOST,
  dialect: 'mysql',
})

seq.authenticate().then(() => {
  console.log('数据库连接成功');
}).catch(err => {
  console.log('数据库连接失败', err);
})

```
### 3.编写配置文件
```
APP_PORT = 8000

MYSQL_HOST = localhost
MYSQL_PROT = 3306
MYSQL_USER = root
MYSQL_PWD  = yysy0324
MYSQL_DB   = sc_user
```

## 八.创建模型
- 创建`src/model/user.model.js`
- 通过`sync`同步模型创建model中设计的数据表

## 九.添加用户
- 所有数据库的操作都在service层完成。service调用model完成数据库操作
```JS
const User = require('../model/user.model')
class UserService {
  async createUser (user_name, password) {
    // 插入数据
    // await表达式:promise对象的值
    const res = await User.create({
      // 表的字段 这里用了简写，属性名 属性值相同！
      user_name,
      password
    })
    console.log(res);
    return res.dataValues
  }
}

module.exports = new UserService()
```
- 同时改写`user.controller.js`
```JS
const { createUser } = require('../service/user.service')
class UserController {
  async register (ctx, next) {
    // 1.获取数据
    // console.log(ctx.request.body);
    const { user_name, password } = ctx.request.body
    // console.log(user_name, password);
    // 2.操作数据库
    const res = await createUser(user_name, password)
    // 3.返回结果
    ctx.body = {
      code: 0,
      message: "用户注册成功",
      result: {
        id: res.id,
        user_name: res.user_name
      }
    }
  }

  async login (ctx, next) {
    ctx.body = '登录成功'
  }
}

module.exports = new UserController()
```

## 十.错误处理
- 在控制器中对不同的错误进行处理，返回不同的提示

## 十一.将错误处理拆分为中间件
### 1.拆分中间件
添加`src/middleware/user.middleware.js`
```JS
const { getUserInfo } = require('../service/user.service')
const { userFormateError, userAlreadtExited, userRegisterError } = require('../constant/err.type')
const userValidator = async (ctx, next) => {
  const { user_name, password } = ctx.request.body
  // 合法性
  if (!user_name || !password) {
    console.error('用户名或密码为空', ctx.request.body);
    ctx.app.emit('error', userFormateError, ctx)
    return
  }
  await next()
}

const verifyUser = async (ctx, next) => {
  const { user_name, password } = ctx.request.body
  console.log(user_name);
  try {
    // 合理性 先在数据库中进行查询
    if (await getUserInfo({ user_name })) {
      console.error('用户名已经存在', { user_name })
      ctx.app.emit('error', userAlreadtExited, ctx)
      return
    }
  } catch (err) {
    console.error('获取用户信息错误', err)
    ctx.app.emit('error', userRegisterError, ctx)
    return
  }

  await next()
}
module.exports = {
  userValidator,
  verifyUser
}
```

### 2.统一错误处理
- 在出错的地方使用`ctx.app.emit`提交错误
- 在app中通过`app.on`监听
编写统一的错误定义文件
```js
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
  }
}
```
### 3.错误处理函数
```JS
module.exports = (err, ctx) => {
  let status = 500
  switch (err.code) {
    case '10001':
      status = 400
      break
    case '10002':
      status = 409
      break
    default:
      status = 500
  }
  ctx.status = status
  ctx.body = err
}
```
改写`app/index.js`
```JS
const errHandler = require('./errHandler')
// 统一的错误处理
app.on('error', errHandler)
```