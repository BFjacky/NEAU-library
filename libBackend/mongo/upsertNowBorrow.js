/*
    将当前借阅upsert到NowBorrow表格中
*/
const nowBorrow = require('../models/nowBorrow.js')
module.exports = function upsertNowBorrow(stuId, NowBorrowBook) {
    return new Promise(async (resolve, reject) => {
        let whereStr = { stuId: stuId, bookName: NowBorrowBook.bookName }
        let updateStr = {
            stuId: stuId,              //学号
            bookName: NowBorrowBook.bookName,           //书名
            borrowDate: NowBorrowBook.borrowDate,         //借阅日期
            lawBackDate: NowBorrowBook.lawBackDate,        //到期时间
            bookPlace: NowBorrowBook.bookPlace,          //馆藏地点
            renewNum: NowBorrowBook.renewNum,           //可续借情况
        }
        let cond = { upsert: true, multi: true };
        nowBorrow.update(whereStr, updateStr, cond, function (err, res) {
            if (err) {
                err = new Error('upsertNowBorrow时出错！')
                reject(err);
            }
            else {
                resolve(res);
            }
        })
    })
}