'use strict';
const insertUser = function(res1, res2) {
  return new Promise((resolve, reject) => {
    // 存入数据库中
    userinfo.update({ _id: res1.data._id }, {
      _id: res1.data._id,
      student: res1.data.student,
      wasNew: res1.data.wasNew,
      login: res1.data.login,
      unions: res1.data.unions,
      phoneNumber: res1.data.phoneNumber,
      id: res1.data.id,

      stuId: res2.data.stuId,
      name: res2.data.name,
      gender: res2.data.gender,
      grade: res2.data.grade,
      department: res2.data.department,
      major: res2.data.major,
      className: res2.data.className,
      schoolId: res2.data.schoolId,
      IDCardNo: res2.data.IDCardNo,
      pswd: res2.data.pswd,
    }, { upsert: true, multi: true }, (err, res) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(res);
    });
  });
};
const findUser = function(res1, res2) {
  return new Promise((resolve, reject) => {
    userinfo.find({ _id: res1.data._id }, (err, res) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(res);
    });
  });
};
// 将一名用户的cookie更新到数据库中
const updateCookieById = function(_id, cookie) {
  return new Promise((resolve, reject) => {
    userinfo.update({ _id }, { libSessionId: cookie }, { upsert: false, multi: false }, (err, res) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(res);
    });
  });
};
// 生成随机字符串
const randomString = function() {
  // 默认位数为200位
  const len = 200;
  const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; /** **默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  const maxPos = $chars.length;
  let pwd = '';
  for (i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
};
const book = require('../models/book.js');
const collectBook = require('../models/collectBook.js');
const grxx = require('../models/grxx.js');
const histroyBook = require('../models/historyBook.js');
const log = require('../models/log.js');
const nowBorrow = require('../models/nowBorrow.js');
const rankTotalBooks = require('../models/rankTotalBooks.js');
const userinfo = require('../models/userinfo.js');

const axios = require('axios');
const path = require('path');
const fs = require('fs');
module.exports = app => {
  class ApplicationController extends app.Controller {
    async index(ctx) {
      this.ctx.body = '因学校图书馆系统异常，暂停服务!';
      return;
      // console.log('进入到了程序入口')
      /**
             * 程序入口:
             * 获取dnxnToken
             * 拿用户信息
             * 比对数据库中用户信息
             *    数据库中存在用户信息-》
             *    数据库中不存在用户信息-》存入数据库-》给浏览器绑定cookie
             */
      const token_account = 'https://account.xiaonei.io/user/get';
      const token_jwcxn = 'https://neau-lib.xiaonei.io/dnxn-mina/student/get';
      const dnxnToken = ctx.query.aid;
      if (dnxnToken !== undefined && dnxnToken !== null && dnxnToken !== '') {
        // console.log('获得了该同学的dnxnToken')
        // ---!!!!!!!!!!!!!!!这里可能会因为token无效报错403!!!!!!!!!!!!!!!
        let res1,
          res2;
        try {
          res1 = await axios({
            method: 'get',
            url: token_account,
            params: {
              aid: dnxnToken,
            },
          });
          res2 = await axios({
            method: 'get',
            url: token_jwcxn,
            params: {
              aid: dnxnToken,
              needIdCard: 1,
            },
          });
        } catch (err) {
          // console.log('根据token向远端服务器拿取信息的时候出错了:' + err);
          // console.log('返回前端页面')
          const res = fs.readFileSync(path.join(__dirname, '../public', '/index.html'));
          this.ctx.response.append('content-type', 'text/html');
          this.ctx.response.body = res;
          return;
        }
        const userFromMongo = await findUser(res1, res2);
        if (userFromMongo[0] !== undefined && userFromMongo[0] !== null && userFromMongo[0] !== '') {
          // 在本地数据库中有此人的信息
          // console.log('该同学曾经登陆过，数据库中有该同学的信息')
        }
        else {
          // 本地无此用户信息
          // console.log('该同学没有登陆过，数据库中无该同学的信息')
          const userInsertNew = await insertUser(res1, res2);

          const cookieStr = randomString();
          ctx.cookies.set('libSessionId', cookieStr, {
            maxAge: 1000 * 60 * 60 * 24 * 7,
          });
          await updateCookieById(res1.data._id, cookieStr);
        }
      } else {
        // console.log('没有获得dnxnToken，不知道该用户是谁')
      }

      // console.log('返回前端页面')
      const res = fs.readFileSync(path.join(__dirname, '../public', '/index.html'));
      this.ctx.response.append('content-type', 'text/html');
      this.ctx.response.body = res;
    }

    // 管理员查看数据库信息
    async jserAdmin(ctx) {
      const getAll = function(dbName) {
        return new Promise((resolve, reject) => {
          dbName.find({}, (err, res) => {
            if (err) {
              reject(err);
            } else {
              resolve(res);
            }
          });
        });
      };
      const jserpswd = ctx.request.body.jserpswd;
      if (jserpswd === 'afm3129ufdk') {
        console.log('身份验证成功');
        // 获得所有的数据库信息
        const book_dbs = await getAll(book);
        const collectBook_dbs = await getAll(collectBook);
        const grxx_dbs = await getAll(grxx);
        const histroyBook_dbs = await getAll(histroyBook);
        const log_dbs = await getAll(log);
        const nowBorrow_dbs = await getAll(nowBorrow);
        const rankTotalBooks_dbs = await getAll(rankTotalBooks);
        const userinfo_dbs = await getAll(userinfo);
        ctx.body = {
          book_dbs,
          collectBook_dbs,
          grxx_dbs,
          histroyBook_dbs,
          log_dbs,
          nowBorrow_dbs,
          rankTotalBooks_dbs,
          userinfo_dbs,
        };
        return;
      }
      ctx.body = {
        '???': '???',
      };
      return;
    }
  }
  return ApplicationController;
};
