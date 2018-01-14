'use strict';
const path = require('path');
module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1510039409271_4470';

  // add your middleware here
  config.middleware = ['errorHandler', 'libCookie'];

  config.libCookie = {
    ignore: function (ctx) {
      /**
       * 忽略两个路由，
       * /api/rebind
       * /api/checkUser
       */
      if (ctx.url === '/api/rebind' || ctx.url === '/api/checkUser') {
        return true;
      } else {
        return false;
      }
    }
    //'/api/checkUser/',
  }

  // ignore csrf
  config.security = {
    csrf: {
      ignoreJSON: true, // 默认为 false，当设置为 true 时，将会放过所有 content-type 为 `application/json` 的请求
    },
    xframe: {
      enable: false,
    },
    domainWhiteList: ['localhost:8080']
  };

  // auto update Rank informations time
  config.updateRankTime = 22;

  //get token source url
  config.token_account = 'https://account.xiaonei.io/user/get?aid=';
  config.token_jwcxn = 'https://jwc.xiaonei.io/student/get?aid=';

  //add static file server
  config.static = {
    prefix: "/",
    dir: path.join(appInfo.baseDir, 'app/public'),
    dynamic: true
  }

  //跨域
  config.cors = {
    allowMethods: 'POST,GET',
    credentials: true,
  }

  //后端代码监听端口
  config.port = 80;

  return config;


};
