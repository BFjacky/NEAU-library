/*
    将历史借阅upsert到historyBook表格中
*/
const historyBook = require('../models/historyBook.js')
module.exports = function upsertHistoryBook(stuId, hisbook) {
    return new Promise(async (resolve, reject) => {
        let whereStr = { stuId: stuId, bookName: hisbook.bookName }
        let updateStr = {
            stuId: stuId,                          //学号
            bookName: hisbook.bookName,           //书名
            borrowDate: hisbook.borrowDate,         //借阅日期
            returnDate: hisbook.returnDate,         //归还日期
            bookPlace: hisbook.bookPlace,          //馆藏地点
        }
        let cond = { upsert: true, multi: true };
        historyBook.update(whereStr, updateStr, cond, function (err, res) {
            if (err) {
                err = new Error('upsertHistoryBook时出错！')
                reject(err);
            }
            else {
                resolve(res);
            }
        })
    })
}