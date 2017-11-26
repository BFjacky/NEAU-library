/*
    用户登录信息的表格
*/
const db = require('../mongo/db.js');
Schema = db.Schema;
const userinfoSchema = new Schema(
  {
    _id: String, //key
    student: String, //student 的key
    wasNew: Boolean,//新用户
    login: String,//登陆端
    unions: Array, //???
    phoneNumber: String,//电话号
    id: String, //key

    stuId: String, // 学号
    name: String, // 读者姓名
    gender: String,//性别
    grade: Number, //年级
    department: String,//学院信息
    major: String,//专业
    className: String,//班级
    schoolId: String,//student key
    pswd: String, // 图书馆密码
    IDCardNo: String, // 身份证号码
    loginBefore: Boolean, // 之前是否登陆成功过
    libSessionId:String, //library cookie
  }, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
module.exports = db.model('userinfo', userinfoSchema);
