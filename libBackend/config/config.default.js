'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1510039409271_4470';

  // add your config here
  config.middleware = ['errorHandler', 'crossyv', 'dnxnToken',];

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
  return config;
};
