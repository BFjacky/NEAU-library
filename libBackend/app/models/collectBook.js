/*
    历史借阅的表格
*/
const db = require('../mongo/db.js');
Schema = db.Schema;
const CollectBookSchema = new Schema(
    {
        stuId: String, // 学号
        books: Array, //bookId的集合
        collectDate: String,//收藏日期
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);
module.exports = db.model('CollectBook', CollectBookSchema);
