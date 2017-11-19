/*
    个人信息的表格
*/
const db = require('../mongo/db.js');
Schema = db.Schema;
const grxxSchema = new Schema(
  {
    stuId: String, // 学号
    expire: String, // 到期
    exceed: String, // 超期
    yyds: String, // 预约到书
    wtds: String, // 委托到书
    recommendation: String, // 荐购
    name: String, // 读者姓名
    stuId: String, // 读者证件
    raedersCode: String, // 读者条码
    readersType: String, // 读者类型
    organization: String, // 工作单位
    beginDate: String, // 办证日期
    effectiveDate: String, // 生效日期
    expiryDate: String, // 失效日期
    deposit: String, // 读者押金
    expense: String, // 手续费用
    totalBooks: Number, // 累计借书
    zongjifen: String, // 总积分
    keyongjifen: String, // 可用积分
    email: String, // email地址
    tel: String, // 电话
    address: String, // 地址
    postalCode: String, // 邮政编码
  }, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
module.exports = db.model('grxxes', grxxSchema);
