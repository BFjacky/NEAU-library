/*
    将当前借阅upsert到NowBorrow表格中
*/
const nowBorrow = require('../models/nowBorrow.js');
module.exports = function upsertNowBorrow(stuId, NowBorrowBook) {
  return new Promise(async (resolve, reject) => {
    const whereStr = { stuId, bookName: NowBorrowBook.bookName };
    const updateStr = {
      stuId, // 学号
      bookName: NowBorrowBook.bookName, // 书名
      borrowDate: NowBorrowBook.borrowDate, // 借阅日期
      lawBackDate: NowBorrowBook.lawBackDate, // 到期时间
      bookPlace: NowBorrowBook.bookPlace, // 馆藏地点
      renewNum: NowBorrowBook.renewNum, // 可续借情况
      bookId: NowBorrowBook.bookId,//书籍id
      barcode:NowBorrowBook.barcode,//书籍续借barcode
      cookie:NowBorrowBook.cookie, //经图书馆验证过的cookie信息
    };
    const cond = { upsert: true, multi: true };
    nowBorrow.update(whereStr, updateStr, cond, function (err, res) {
      if (err) {
        err = new Error('upsertNowBorrow时出错！');
        reject(err);
      } else {
        resolve(res)
      }
    });
  });
};
