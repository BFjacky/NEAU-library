/*
    将个人信息upsert到grxx表格中
*/
const grxx = require('../models/grxx.js');

module.exports = function upsertGrxxInDB(stuId, res) {
  return new Promise((resolve, reject) => {
    const whereStr = { stuId };
    const updateStr = {
      expire: res[0], // 到期
      exceed: res[1], // 超期
      yyds: res[2], // 预约到书
      wtds: res[3], // 委托到书
      recommendation: res[4], // 荐购
      name: res[5], // 读者姓名
      stuId: res[6], // 读者证件
      raedersCode: res[7], // 读者条码
      readersType: res[8], // 读者类型
      organization: res[9], // 工作单位
      beginDate: res[10], // 办证日期
      effectiveDate: res[11], // 生效日期
      expiryDate: res[12], // 失效日期
      deposit: res[13], // 读者押金
      expense: res[14], // 手续费用
      totalBooks: res[15], // 累计借书
      zongjifen: res[16], // 总积分
      keyongjifen: res[17], // 可用积分
      email: res[18], // email地址
      tel: res[19], // 电话
      address: res[20], // 地址
      postalCode: res[21], // 邮政编码
    };
    const cond = { upsert: true, multi: true };

    grxx.update(whereStr, updateStr, cond, function(err, res) {
      if (err) {
        err = new Error('upsertGrxxInDB时出错！');
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};
