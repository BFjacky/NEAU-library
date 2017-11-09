const grxx = require('../../models/grxx.js')
const historyBook = require('../../models/historyBook')
const nowBorrow = require('../../models/nowBorrow.js')
module.exports = app => {
    class fetchService extends app.Service {
         //从数据库取出个人信息
        async fetchGrxx(stuId) {
            return new Promise((resolve, reject) => {
                let whereStr = { stuId: stuId };
                grxx.find(whereStr, (err, res) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(res);
                    }
                })
            })
        }
         //从数据库取出历史借阅
        async fetchHisBooks(stuId) {
            return new Promise((resolve, reject) => {
                let whereStr = { stuId: stuId };
                historyBook.find(whereStr, (err, res) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(res);
                    }
                })
            })
        }
         //从数据库取出当前借阅
        async fetchNowBorrow(stuId) {
            return new Promise((resolve, reject) => {
                let whereStr = { stuId: stuId };
                nowBorrow.find(whereStr, (err, res) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(res);
                    }
                })
            })
        }
    }
    return fetchService;
}