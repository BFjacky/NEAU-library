/*
    图书馆第一次登陆需要验证姓名
    将姓名信息传入http://opac.lib.neau.edu.cn/m/reader/check_name.action
    来激活cookie
*/
const http = require('http');
const querystring = require('querystring');
const getLoginCookie = require('./getLoginCookie.js');
let postData;
// post表单内容
const prePostData = {
  username: '',
  passwd: '',
  name: '',
  verifyCode: '',
  type: '1',
  submitType: 'reg',
};
const options = {
  hostname: 'opac.lib.neau.edu.cn',
  port: 80,
  path: '/m/reader/check_name.action',
  method: 'POST',
  headers: {
    Origin: 'http://opac.lib.neau.edu.cn',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Content-Length': '',
    Cookie: '',
  },
  Referer: 'http://opac.lib.neau.edu.cn/m/reader/check_name.action?username=',
};
module.exports = function checkName(stu) {
  const p = new Promise(async function(resolve, reject) {
    stu.cookie = await getLoginCookie();
    // 接受到stu之后设置一下请求信息-------------------------------------
    options.Referer = options.Referer + stu.stuId + '&passwd=' + stu.pswd + '&veirigyCode=&type=1';
    prePostData.username = stu.stuId;
    prePostData.name = stu.name;
    prePostData.passwd = stu.pswd;
    postData = querystring.stringify(prePostData);
    options.headers.Cookie = stu.cookie;
    options.headers['Content-Length'] = Buffer.byteLength(postData);
    //----------------------------------------------------------------

    const req = http.request(options, res => {
      const chunks = [];
      let size = 0;
      res.on('data', chunk => {
        chunks.push(chunk);
        size += chunk.length;
      });
      res.on('end', () => {
        data = new Buffer(size);
        data = Buffer.concat(chunks, size);
        let res = data.toString('utf8', 0, size);

        try {
          // 将res 从字符串转换为对象,json格式不正确;
          res = eval('(' + res + ')');
        } catch (err) {
          /**
                     * 在这里备注一下不清楚具体为了账号输入错误抛出这样的err
                     */
          err.msg = 'json解析错误';
          reject(err);
          return;
        }
        if (res.success === false) {
          const err = new Error();
          err.msg = res.msg;
          reject(err);
        }
        res = JSON.stringify(res);
        // 如果返回的页面中不包括'首次验证姓名'则登陆成功
        if (res.indexOf('首次验证姓名') === -1) {
          // 登陆成功，激活了cookie，返回一个带有激活cookie的student对象
          resolve(stu);
        } else {
          // 登陆失败，cookie无效
          const err = new Error();
          err.msg = '姓名错误';
          reject(err);
        }
      });
    });

    req.on('error', e => {
      console.error(`请求遇到问题: ${e.message}`);
      reject(e);
    });

    // 写入数据到请求主体
    req.write(postData);
    req.end();
  });
  return p;
};
