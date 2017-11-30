const userinfo = require('../models/userinfo.js');
const tryUsefulCookie = require('../crawler/tryUsefulCookie.js');
module.exports = app => {
    class userService extends app.Service {
        /**
         * 重新绑定账号
         * @param {*} stuId 
         * @param {*} pswd 
         * @param {*} name 
         */
        async rebind(stuId, pswd, name) {
            //存入数据库中
            let mysave = function (stuId, pswd) {
                return new Promise((resolve, reject) => {
                    userinfo.update({ stuId: stuId }, { pswd: pswd }, { upsert: true, mutil: true }, (err, res) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(res);
                        }
                    })
                })
            }
            try {
                let login_result = await tryUsefulCookie(stuId, pswd, name);
                //该账号密码登陆成功
                if (login_result.success) {
                    let res = await mysave(stuId, pswd);
                    if (res.ok === 1) {
                        //成功存入数据库中
                        return ({
                            project: 'rebind',
                            success: true,
                        })
                    }
                }
            } catch (err) {
                return ({
                    project: 'rebind',
                    success: false,
                    err: err,
                })
            }
        }
    }
    return userService;
};
