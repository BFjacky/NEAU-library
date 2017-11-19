const trylogin = require('./trylogin.js');
const checkName = require('./checkName.js');
const getLoginCookie = require('./getLoginCookie.js');
module.exports = function tryUsefulCookie(stuId, pswd, name) {
  return new Promise(async (resolve, reject) => {
    const stu = {
      stuId,
      pswd,
      cookie: '',
      name,
    };
    try {
      stu.cookie = await getLoginCookie();
      const newStu = await trylogin(stu);
      resolve(newStu);
    } catch (err) {
      // 如果是 用户名/密码错误 不需要进行下一步(验证姓名)
      // 图书馆返回的信息 密码错误: '用户名/密码错误'  学号错误: '读者信息不存在'
      if (err.msg === '用户名/密码错误' || err.msg === '读者信息不存在' || err.msg === '账号/密码为空') {
        reject(err);
        return;
      }
      try {
        newStu = await checkName(stu);
        resolve(newStu);
      } catch (err) {
        reject(err);
      }
    }
  });
};
