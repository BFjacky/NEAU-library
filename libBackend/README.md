# 校园卡信息查询平台 - 后端模块

> &#x1F373; 基于egg.js、axios、cheerio以及MongoDB开发

## 要求

  + Node.js v8.9.4
  + MongoDB 数据库已启动，运行端口27017

## 安装 / 开始开发

```bash
  # 安装依赖
  $ cd backend
  $ npm install

  # 启动开发模式
  $ npm run dev
```

> &#x26A0; Tips：应用将会运行在 [http://localhost:7001/](http://localhost:7001/)

## 部署

```bash
  $ npm start
  $ npm stop
```

## 框架配置

```js
  // config/confg.default.js
    ...

  //get token source url
  config.token_account = 'https://account.xiaonei.io/user/get?aid=';
  config.token_jwcxn = 'https://jwc.xiaonei.io/student/get?aid=';

  //add static file server
  config.static = {
    prefix: "/",
    dir: path.join(appInfo.baseDir, 'app/public'),
    dynamic: true
  }

    ...
```

```js
  // conig/plugin.js
    ...
    //插件配置
    exports.validate = {
    enable: true,
    package: 'egg-validate',
    };
    exports.cors = {
    enable: true,
    package: 'egg-cors',
    };
    ...
```

## 开发模式跨域解决方案

在开发过程中，由于采用了前后端分离开发的方法，使得后端（Egg.js - 7001端口）与前端（Vue.js - 8080端口）产生了跨域问题 &#x1F4A2;  
&#x1F4A1; 解决方案：使用egg.js中的插件Egg-cors;

> &#x26A0; Tips：在生产环境中，将已编译好的文件合并入后端系统中时不会出现跨域问题，因为前端请求路由与后端路由处于同一域名和端口下。此处的跨域问题仅出现在开发过程中(生产环境请注释掉这段代码)
 ```js
  //libBackend/config/config.default.js
  config.cors = {
    allowMethods: 'POST,GET',
    credentials: true,
  }
 ```
## ToDos

  + 优化API风格，严格按照Restful风格进行编写
  + 添加单元测试代码

## 其他

  + &#x1F4CD; 如果您有任何好的建议或想法，欢迎在我的 Issue 中交流探讨
  + &#x1F4E7; 您也可以向我发送邮件以取得联系： 438376555@qq.com

-------------------------------------------------------------------
