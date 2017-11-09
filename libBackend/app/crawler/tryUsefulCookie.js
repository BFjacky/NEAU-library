const trylogin = require('./trylogin.js')
const checkName = require('./checkName.js')
const getLoginCookie = require('./getLoginCookie.js')
module.exports = function tryUsefulCookie(stuId, pswd, name) {
    return new Promise(async (resolve, reject) => {
        let stu = {
            stuId: stuId,
            pswd: pswd,
            cookie: '',
            name: name,
        }
        try {
            stu.cookie = await getLoginCookie();
            let newStu = await trylogin(stu);
            console.log('该用户已经登陆过图书馆，直接登陆成功')
            resolve(newStu);
        } catch (err) {
            //如果是 用户名/密码错误 不需要进行下一步(验证姓名)
            if (err.msg === '用户名/密码错误') {
                reject(err);
                return;
            }
            try {
                newStu = await checkName(stu);
                console.log('该用户第一次登陆图书馆，验证姓名成功');
                resolve(newStu);
            } catch (err) {
                reject(err);
            }
        }
    })
}
