const tryUsefulCookie = require('../crawler/tryUsefulCookie.js');
const tryRenew = require('../crawler/tryRenew.js');
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
const book = require('../models/book.js');
const axios = require('axios')
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

        /**
         * 将得到的数据写入数据库
         * 将图书馆颁发的cookie也存入数据库中
         */
        for (let i = 0; i < datas.length; i++) {
          datas[i].cookie = stu.cookie;
          await upsertNowBorrow(stu.stuId, datas[i]);
        }

      } catch (err) {
        console.log(err);
      }
    }
    /**
     * 一键续借
     * @param {*} stuId 
     */
    async tryRenew(stuId) {
      let getInfo = function (stuId) {
        //在数据库中获得相应的书籍信息
        return new Promise((resolve, reject) => {
          let whereStr = { stuId: stuId };
          nowBorrow.find(whereStr, (err, res) => {
            if (err) {
              reject(err);
            } else {
              resolve(res);
            }
          })
        })
      }
      let info = await getInfo(stuId);

      //存放续借情况
      let renewList = [];

      for (let i = 0; i < info.length; i++) {
        //如果barcode renewNum cookie为undefined，则提示用户重新刷新当前借阅
        if (info[i].barcode == undefined || info[i].renewNum == undefined || info[i].cookie == undefined) {
          //所借期刊有超期标志
          if (info[i].barcode === null) {
            let res = {
              project: 'tryRenew',
              success: false,
              msg: '所借期刊有超期，不得续借'
            }

            return res;
          }
          let res = {
            project: 'tryRenew',
            success: false,
            msg: '续借信息不全，请重新获取当前借阅'
          }
          return res;
        }
        let patt = /\d+/g;
        info[i].barcode = info[i].barcode.match(patt)[0];
        info[i].renewNum = info[i].renewNum.match(patt)[0];

        //信息模板
        renewList[i] = {
          project: 'tryRenew',
          bookName: info[i].bookName,
          renewNum: info[i].renewNum,
          stuId: info[i].stuId,
          bookId: info[i].bookId,
          bookPlace: info[i].bookPlace,
          lawBackDate: info[i].lawBackDate,
          borrowDate: info[i].borrowDate,
        };

        //此书还没被续借过
        if (info[i].renewNum == 0) {
          let res = await tryRenew(info[i].cookie, info[i].barcode);
          renewList[i].success = res;
        }
        //此书已被续借过
        else {
          renewList[i].success = false;
        }
      }

      return renewList;

    }

    /**
     * 根据图书id，来获得对应风书籍封面
     * 1.本地数据库查找
     * 2.图书馆数据库查找
     */
    async getBookDetail(books) {
      const _this = this;
      const findBookByBookId = function (bookId) {
        return new Promise((resolve, reject) => {
          book.find({ bookId: bookId }, (err, res) => {
            if (err) {
              reject(err);
            } else {
              resolve(res);
            }
          })
        })
      }
      const axios_new = async function (bookId) {
        let res = await axios({
          url: ' /api/search/getBookDetail',
          params: {
            bookId: bookId,
          },
          proxy: {
            host: '127.0.0.1',
            port: _this.ctx.app.config.port,
          },
          method: 'get',
        })
        return res;
      }
      let res = [];
      for (let i = 0; i < books.length; i++) {
        res[i] = await findBookByBookId(books[i]);
        if (res[i].length === 0) {
          /**
           * 如果本地数据库中没有此书信息
           * 1.发出本地更新请求
           * 2.从新从数据库中取数据
           */
          let axios_res = await axios_new(books[i]);
          if (axios_res.status === 200) {
            //更新成功从数据库中拿数据
            res[i] = await findBookByBookId(books[i]);
          } else {
            console.log('无法获得' + books[i] + '的书籍数据')
          }
        }
        if (res[i].length !== 0) {
          res[i] = res[i][0];
        }
      }
      return res;
    }
  }
  return updateService;
};
