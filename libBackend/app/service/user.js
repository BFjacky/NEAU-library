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
            let mysave = function (stuId, pswd, libSessionId) {
                return new Promise((resolve, reject) => {
                    userinfo.update({ stuId: stuId }, { pswd: pswd, libSessionId: libSessionId }, { upsert: true, mutil: true }, (err, res) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(res);
                        }
                    })
                })
            }
            //根据stuId找cookie
            let myfind = function (stuId) {
                return new Promise((resolve, reject) => {
                    userinfo.find({ stuId: stuId }, (err, res) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(res);
                        }
                    })
                })
            }
            //生成随机字符串
            let randomString = function () {
                //默认位数为200位
                let len = 200;
                var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
                var maxPos = $chars.length;
                var pwd = '';
                for (let i = 0; i < len; i++) {
                    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
                }
                return pwd;
            }

            try {
                let login_result = await tryUsefulCookie(stuId, pswd, name);
                //该账号密码登陆成功
                if (login_result.success) {
                    /**
                     * 1.将正确的pswd存入数据库
                     * 2.向该客户端设置一个新的cookie，并存入数据库
                     */
                    let cookieStr = randomString();
                    this.ctx.cookies.set('libSessionId', cookieStr, {
                        maxAge: 1000 * 60 * 60 * 24 * 7,
                    });

                    let res = await mysave(stuId, pswd, cookieStr);
                    if (res.ok === 1) {
                        //成功存入数据库中
                        return ({
                            project: 'rebind',
                            success: true,
                        })
                    };
                }
            } catch (err) {
                console.log(err)
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
