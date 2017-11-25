/*
    当前借阅的表格
*/
const db = require('../mongo/db.js');
Schema = db.Schema;
const NowBorrowSchema = new Schema(
  {
    stuId: String, // 学号
    bookName: String, // 书名
    borrowDate: String, // 借阅日期
    lawBackDate: String, // 到期时间
    bookPlace: String, // 馆藏地点
    renewNum: String, // 可续借情况
    bookId: String,//bookId
    barcode: String,//续借barcode
    cookie: String,//图书馆验证过的cookie信息
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
module.exports = db.model('nowBorrowBooks', NowBorrowSchema);
