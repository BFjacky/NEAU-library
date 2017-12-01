/*
    图书馆书籍的表格
*/
const db = require('../mongo/db.js');
Schema = db.Schema;
const bookSchema = new Schema(
    {
        bookId:String,      //bookid
        bookName:String,    //书名
        bookImgUrl:String,  //图书封面url地址
        bookPlace: String, // 馆藏地点
    }, {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);
module.exports = db.model('book', bookSchema);
