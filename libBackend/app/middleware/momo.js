const userinfo = require('../models/userinfo.js');
const tryUsefulCookie = require('../crawler/tryUsefulCookie.js');

// 检查本地是否已经存储了该apiToken
const findByApiToken = function (apiToken) {
  return new Promise((resolve, reject) => {
    const whereStr = { apiToken };
    userinfo.find(whereStr, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

// 将一个用户信息更新插入到数据库表格中
const upsertApiToken = async function (result) {

  // 先在数据库中拿出原有信息
  let info = await findByApiToken(result.apiToken);
  info = info[0] ? info[0] : {};

  return new Promise((resolve, reject) => {
    const whereStr = { apiToken: result.apiToken };
    const updateStr = {
      stuId: result.stuId ? result.stuId : info.stuId,
      pswd: result.pswd ? result.pswd : info.pswd,
      name: result.name ? result.name : info.name,
      IDCardNo: result.IDCardNo ? result.IDCardNo : info.IDCardNo,
      loginBefore: result.loginBefore ? result.loginBefore : info.loginBefore,
    };
    const cond = { upsert: true, multi: true };

    userinfo.update(whereStr, updateStr, cond, function (err, res) {
      if (err) {
        err = new Error('upsertApiToken时出错！');
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

module.exports = () => {
  return async function (ctx, next) {
    console.log('dnxn_token_middleware');

    // 每次请求获得一个token
    const apiToken = ctx.request.body.apiToken;

    // 获得token后先检查本地数据库中是否有有关该token的存储信息，一切信息以本地数据库为主
    let result = await findByApiToken(apiToken);

    // 结果为空,从东农校内小程序拿取信息并存入数据库
    // 此用户第一次从东农校内中跳转至图书馆页面信息
    if (result.length === 0) {
      // 假装拿取了信息
      result = {
        apiToken,
        stuId: 'A19150185',
        pswd: '203312',
        name: '陈云飞',
        IDCardNo: '123123123',
        loginBefore: false,
      };

      // 存入数据库
      const res = await upsertApiToken(result);
    }
    // 本地数据库有信息
    else {
      // mongo中查询得到的信息为数组,需要处理
      result = result[0];
    }

    // 用户刚刚离开loginPage，提交了表单信息等待验证
    if (ctx.request.body.testLoginInfo) {
      try {
        const newInfo = {};
        newInfo.stuId = ctx.request.body.stuId;
        newInfo.pswd = ctx.request.body.pswd;
        newInfo.name = ctx.request.body.name;
        newInfo.apiToken = apiToken;
        await tryUsefulCookie(newInfo.stuId, newInfo.pswd, newInfo.name);

        // 以下，只有验证信息正确才会执行
        // 插入数据库中
        await upsertApiToken(newInfo);
        await next();
        return;
      } catch (err) {
        // 验证信息不通过，返回错误
        ctx.body = err;
        await next();
        return;
      }
    }

    // 如果是登陆界面，判断数据是否合法
    if (ctx.request.body.loginPage) {
      try {
        await tryUsefulCookie(result.stuId, result.pswd, result.name);

        // 放置在ctx.body中，用此信息尝试接下来的登陆操作
        ctx.request.body.stuId = result.stuId;
        ctx.request.body.pswd = result.pswd;
        ctx.request.body.name = result.name;

        // result中有了所需要的信息结果
        await next();
        return;
      } catch (err) {
        // 数据不合法则跳转至登录界面,将错误信息返回前端
        ctx.body = err;
        await next();
        return;
      }
    }

    //如果什么都不是，直接进入下一个中间件
    await next();
    return;
  };
};
