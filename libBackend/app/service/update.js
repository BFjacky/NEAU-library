const tryUsefulCookie = require('../crawler/tryUsefulCookie.js');
const getgrxxHtml = require('../crawler/getgrxxHtml.js');
const getgrxxFromHtml = require('../crawler/getgrxxFromHtml.js');
const getHistoryBookHtml = require('../crawler/getHistoryBookHtml.js');
const getHistoryBookFromHtml = require('../crawler/getHistoryBookFromHtml.js');
const getNowBorrowFromHtml = require('../crawler/getNowBorrowFromHtml.js');
const getNowBorrowHtml = require('../crawler/getNowBorrowHtml.js');
const upsertGrxxInDB = require('../mongo/upsertGrxxInDB.js');
const upsertHistoryBook = require('../mongo/upsertHistoryBook.js');
const upsertNowBorrow = require('../mongo/upsertNowBorrow.js');
const nowBorrow = require('../models/nowBorrow.js');
const histroyBook = require('../models/historyBook.js');
module.exports = app => {
  class updateService extends app.Service {
    async updateGrxx(stuId, pswd, name) {
      /*
                爬取图书馆个人信息页面信息并装入数据库
                需要传入一个用户名和密码
            */
      // 尝试用该信息获取一个已经激活的cookie;
      const stu = await tryUsefulCookie(stuId, pswd, name);
      // 通过已激活的cookie获取个人信息的html页面
      const htmlData = await getgrxxHtml(stu.cookie);
      // 将个人信息的html页面爬取下来
      const res = getgrxxFromHtml(htmlData);
      // 将得到的数据填入数据库
      await upsertGrxxInDB(stu.stuId, res);
    }
    async updateHisBooks(stuId, pswd, name) {
      /*
                爬取图书馆借阅历史页面信息并装入数据库
                需要传入一个用户名和密码
            */
      // 尝试用该信息获取一个已经激活的cookie;
      const stu = await tryUsefulCookie(stuId, pswd, name);
      // 通过已激活的cookie获取借阅历史的html页面
      const htmlDatas = await getHistoryBookHtml(stu.cookie);
      // 将借阅历史的html页面爬取下来
      let datas = [];
      for (let i = 1; i < htmlDatas.length; i++) {
        datas = datas.concat(getHistoryBookFromHtml(htmlDatas[i]));
      }

      //先删除数据库中老的信息
      let delete_histroyBook = function () {
        return new Promise((resolve, reject) => {
          const delete_cond = { stuId: stu.stuId };
          histroyBook.remove(delete_cond, function (err) {
            if (err) {
              reject(err);
            } else {
              resolve('ok');
            }
          })
        });
      }
      await delete_histroyBook();

      for (let i = 0; i < datas.length; i++) {
        // 将得到的数据写入数据库
        await upsertHistoryBook(stu.stuId, datas[i]);
      }

    }
    async updateNowBorrow(stuId, pswd, name) {
      /*
                爬取图书馆当前借阅页面信息并装入数据库
                需要传入一个用户名和密码
            */
      try {
        // 尝试用该信息获取一个已经激活的cookie;
        const stu = await tryUsefulCookie(stuId, pswd, name);
        // 通过已激活的cookie获取借阅历史的html页面
        const htmlDatas = await getNowBorrowHtml(stu.cookie);
        // 将借阅历史的html页面爬取下来
        let datas = [];
        for (let i = 1; i < htmlDatas.length; i++) {
          datas = datas.concat(getNowBorrowFromHtml(htmlDatas[i]));
        }
        //先删除数据库中老的信息
        let delete_nowBorrow = function () {
          return new Promise((resolve, reject) => {
            const delete_cond = { stuId: stu.stuId };
            nowBorrow.remove(delete_cond, function (err) {
              if (err) {
                reject(err);
              } else {
                resolve('ok');
              }
            })
          });
        }
        await delete_nowBorrow();

        // 将得到的数据写入数据库
        for (let i = 0; i < datas.length; i++) {
          await upsertNowBorrow(stu.stuId, datas[i]);
        }

      } catch (err) {
        console.log(err);
      }
    }
  }
  return updateService;
};
