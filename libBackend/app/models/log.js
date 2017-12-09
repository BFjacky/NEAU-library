/*
    程序运行时状况的表格
*/
const db = require('../mongo/db.js');
Schema = db.Schema;
const logSchema = new Schema(
    {
        stuId: String, //学号
        pswd: String, //密码
        name: String, //姓名
        cookie: String, //cookie
    }, {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);
module.exports = db.model('log', logSchema);
