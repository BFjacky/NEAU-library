# 校园卡信息查询平台 - 前端模块

> &#x1F3B8; 基于Vue.js、Vue Router以及Mint-UI开发

## 安装 / 开始开发

```bash
  # 安装依赖
  $ cd webdev
  $ npm install

  # 启动开发模式
  $ npm run dev
```

> &#x26A0; Tips：应用将会运行在 [http://localhost:8080](http://localhost:8080)

## 相关技术栈

  + Vue.js
  + Webpack
  + Vue Router
  + Mint-UI
  + axios
  + Babel

## 目录结构

```bash
  . libWebApp
  ├── build                     # Webpack 及 Vue Loader 相关配置项
  ├── config                    # 配置选项
  ├── dist                      # 编译后的文件
  ├── src                       # 源文件
  │   ├── assets                # 图像资源
  │   ├── components            # 组件
  │   ├── router                # 路由
  │   ├── App.vue               # 主页面
  │   ├── common.js             # 常量及共用方法
  │   └── main.js               # 主脚本文件
  ├── static                    # 静态资源目录
  ├── test                      # 测试代码
  ├── .babelrc                  # Babel 配置项
  ├── .editorconfig             # 编辑器配置项
  ├── .gitignore                # Git 忽略文件列表
  ├── .postcssrc.js             # PostCSS 配置文件
  ├── index.html                # 主 HTML 文件
  ├── package-lock.json         # 包依赖锁定文件
  ├── package.json              # 包描述文件
  └── README.md                 # 本说明文档
```

## 整体设计思路简述

  + 我们将整个前端页面划分为四个页面&#x1F355;：
    - 首页
    - 个人图书信息页面
    - 搜索页面
    - 书籍详细信息页面
  + 采用组件化开发，将四个页面作为四个容器组件，通过公共变量及props来传递数据
  + 将API接口Url，和获取书籍信息，获得用户信息等需要在多个地方引用的方法和变量存入一个新建的common.js文件中，来统一管理。
  + 不同页面间跳转需要保持状态，此处我用手动管理状态的方式，将状态变量在beforeDestroy时存入common.js文件中，在created时拿出，并且使用同样的方式管理了滚动条保持状态

> &#x26A0; Tips：欢迎在 Issue 页沟通交流并提出您的宝贵建议，您的建议是我成长的动力来源 &#x1F603;

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

## 生产环境

&#x1F4E6; 在生产环境中发布，需要先对项目进行编译

```bash
  # 生产环境编译
  $ npm run build

```

编译成功后，将 `dist` 目录中编译好的文件转移至后端静态资源文件夹中即可  
看起来，我们做的很棒  
但是由于服务器带宽的限制 &#x26D4; ，以及并发时过多网络请求对服务器性能的消耗，这样的部署方式效果并不理想。因为我们将一些不必要的工作交给了服务器，消耗了服务器的资源，说白了，这样做有点大材小用，造成页面访问响应慢，服务器负载大  
因此，我们需要将静态资源文件的托管交给CDN，也就是下一部分我们需要讨论的内容 &#x1F447;

## CDN 加速

&#x1F680; 因为学生9.9优惠服务器的带宽只有1M,使得静态资源放置在服务器上会导致静态资源请求极慢，并发量稍大便会出现几分钟的白屏，所以将静态资源打包放置在了又拍云存储上，加快了加载静态资源的速度，同时也不会占用服务器带宽

网站响应速度快了，服务器负载也小了！&#x1F389;

## 缓存问题

&#x1F4D1; 由于该平台还以 Webview 的形式嵌于“东农校内”微信小程序中，每次平台的迭代更新都会因为小程序的 Webview 缓存而出现问题

对于此问题，我们决定不适用静态资源的访问方式，改为fs模块读出Index.html文件返回给客户端

```bash
  https://neau-lib.xiaonei.io/
```

## ToDos

  + 未来会加入有关图书的交流讨论功能，方便大家评论书籍质量
  + 未来会加入点击图书跳转至当当网并自动筛选搜索结果的链接

## 代码风格指南

  + 该项目使用 [ESLint Standard 标准](https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style)

## 其他

  + &#x1F4CD; 如果您有任何好的建议或想法，欢迎在我的 Issue 中交流探讨
  + &#x1F4E7; 您也可以向我发送邮件以取得联系： 438376555@qq.com
