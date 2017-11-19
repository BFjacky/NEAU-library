/*
    总借书量的表格
*/
const db = require('../mongo/db.js');
Schema = db.Schema;
const rankTotalBookSchema = new Schema(
  {
    stuId: String, // 学号
    rankCount: Number, // 排名（数字）
    rankPercent: String, // 排名(百分比)
    totalBooks: Number, // 总借书量
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
module.exports = db.model('rankTotalBooks', rankTotalBookSchema);
