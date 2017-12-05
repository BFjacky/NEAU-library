/*
    图书馆书籍的表格
*/
const db = require('../mongo/db.js');
Schema = db.Schema;
const bookSchema = new Schema(
    {
        bookId: String,      //bookid
        title: String,    //书名
        imgurl: String,  //图书封面url地址
        ISBN: String,
        info: String, //出版信息 
        bookPlace: [], // 馆藏地点
        author: [],//作者
    }, {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);
module.exports = db.model('book', bookSchema);
