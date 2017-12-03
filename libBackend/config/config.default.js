'use strict';
const path = require('path');
module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1510039409271_4470';

  // add your middleware here
  config.middleware = ['errorHandler', 'libCookie'];

  // control the middleware switch
  // config.dnxnToken = {
  //   match: '/api/checkUser',
  // }

  config.libCookie = {
    ignore: function (ctx) {
      /**
       * 忽略两个路由，
       * /api/rebind
       * /api/checkUser
       */
      if (ctx.url === '/api/rebind' || ctx.url === '/api/checkUser' || ctx.url === '/?aid=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6Im1vYmlsZSIsIl9pZCI6IjVhMDU2OWJlNzFkYTA5MDAyOTJmNTljZiIsImV4cCI6MTUxMzQxMDMwMn0.RZVLMvsYK77nHCJkjLx_ZdGYu9R689QlEQwZGnG0siY') {
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
  };

  // status code
  config.StatusCode = {
    failed: 200,
  };

  // auto update Rank informations time
  config.updateRankTime = 22;

  // test token
  config.testToken = 'thisIsATestTokenblabla~~~';



  //get token source url
  config.token_account = 'https://account.xiaonei.io/user/get?aid=';
  config.token_jwcxn = 'https://jwc.xiaonei.io/student/get?aid=';

  //add static file server
  config.static = {
    prefix: "/static/",
    dir: path.join(appInfo.baseDir, 'app/public/static'),
    dynamic: true
  }

  return config;


};
