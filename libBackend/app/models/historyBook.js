/*
    历史借阅的表格
*/
const db = require('../mongo/db.js');
Schema = db.Schema;
const HistoryBookSchema = new Schema(
  {
    stuId: String, // 学号
    bookName: String, // 书名
    borrowDate: String, // 借阅日期
    returnDate: String, // 归还日期
    bookPlace: String, // 馆藏地点

  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
module.exports = db.model('HistoryBook', HistoryBookSchema);
