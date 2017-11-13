/*
    用户登录信息的表格
*/
const db = require('../mongo/db.js')
Schema = db.Schema;
let userinfoSchema = new Schema(
    {
        apiToken: String, //api接口的token
        stuId: String,  //学号
        name: String,   //读者姓名
        pswd: String, //图书馆密码
        IDCardNo: String, //身份证号码
        loginBefore: Boolean, //之前是否登陆成功过
    }, {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
)
module.exports = db.model('userinfo', userinfoSchema);