<!--
 * @Author: 41
 * @Date: 2022-02-15 21:08:52
 * @LastEditors: 41
 * @LastEditTime: 2022-02-17 19:11:12
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