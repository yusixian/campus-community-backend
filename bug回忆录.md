<!--
 * @Author: 41
 * @Date: 2022-02-15 21:08:52
 * @LastEditors: cos
 * @LastEditTime: 2022-02-24 21:30:03
 * @Description: 
-->
[toc]
### 1.nodemon安装的时候加-D
这样就只会在开发依赖里面添加，我们项目真实上线的时候就不会下载这个依赖

### 2.mysql的版本需要5.7以上

### 3.mysql2和sequelize必须要添加到依赖。就是`--save`才可以成功连接数据库

### 4.npm下载不动使用cnpm下载

### 5.通过postman send数据后，竟然无法解构
- 在postman中要选择是json格式文件才行！

### 6.verify中间件出现错误
- getUserInfo函数返回的是一个promise,在使用的时候用await来获取值
- promise对象是恒为真的

### 7.通过emit到app进行统一的错误处理
- 这里的emit和vue中的emit有些类似的地方！

### 8.在postman中设置变量的时候不加''会被识别为字符串

### 9.`__dirname`可能不是最外层
- 用`path.resolve(__dirname,'..')`可以向外跳一层

### 10.在`views/index.html`单独打开是有样式的,但是运行后没有样式了！
- 使用`koa-static`搭建静态资源

### 11.absolute+left+transform没办法完全水平居中
- 动画的过程使用了transform挤掉了居中的transform

### 12.在apifox中修改密码接口一直有问题
- 忘记换类型了，修改密码是`patch`！

### 13.apifox自动登录前置脚本一直提示用户名密码为空

请求头里记得加上`header: { "Content-Type": "application/json" }` ！！！

```js
 const loginRequest =  {
     url: baseUrl + '/users/login',
     method: 'POST',
     header: {
     	"Content-Type": "application/json"
     },
     body: {
         mode: 'raw',
         raw: JSON.stringify({ user_name: username, password: pwd }),
     }
 };
```
## 14.uploadDir`../upload`这种`../`的方式是不对的！
- 一般来说,在配置的文件中,我们都不要使用相对路径！！！

## 15.class里别用this！
- 非箭头函数会自动创建this指向自己
- class里面不支持箭头函数
- 想在类里调用其他方法，请用类名.prototype.方法
## 16.query中的参数类型转换问题 空对象
- query中的参数为字符串类型，需转换！
- [Boolean - MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Boolean)
- 其值不是undefined或null的任何对象（包括其值为false的布尔对象）在传递给条件语句时都将计算为true
- 0，-0，null，false，NaN，undefined，或空字符串（""） 为true
- 其他为false
## 17. GET请求中body会被自动忽略，需用params
- 官方规范：[RFC7231] A payload within a GET request message has no defined semantics; sending a payload body on a GET request might cause some existing implementations to reject the request.
## 18. query中属性是在其原型上的，无法通过解构获得
```js
console.log(ctx.request.query)    // [Object: null prototype] { status: '0' }
const { status } = ctx.request.query    //Error
[Object: null prototype] { status: '0' }
```

## 19. 异步map

今天处理一个map里异步的问题，顺带知道了Promise.all的用法之一了23333

查阅博客：[如何正确的在 Array.map 使用 async - luckrain7 - 博客园 (cnblogs.com)](https://www.cnblogs.com/luckrain7/p/12750424.html)

错误示范：

````js
temp = res.map(async(val) => {
    // console.log("val:", val)
    const { user_id, article_id } = val
    const userInfo = await User.findOne({ attributes: [['img', 'avator'], 'user_name'], where: { id:user_id }, raw: true})
    const articleInfo = await Article.findOne({ attributes: { exclude: ['status', 'deleteAt'] }, where: { id:article_id }, raw: true})
    userInfo && Object.assign(val, { userInfo })
    articleInfo && Object.assign(val, { articleInfo })
    return val
})
````

正确示范：将每个项目映射到具有新值的 `Promise`，这是`async`在函数执行之前添加的内容。其次，它需要等待所有`Promises`，然后将结果收集到Array中。

```js
temp = await Promise.all( res.map(async(val) => {
    // console.log("val:", val)
    const { user_id, article_id } = val
    const userInfo = await User.findOne({ attributes: [['img', 'avator'], 'user_name'], where: { id:user_id }, raw: true})
    const articleInfo = await Article.findOne({ attributes: { exclude: ['status', 'deleteAt'] }, where: { id:article_id }, raw: true})
    userInfo && Object.assign(val, { userInfo })
    articleInfo && Object.assign(val, { articleInfo })
    return val
}) ) 
```

