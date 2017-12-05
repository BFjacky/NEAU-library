//根据cookie获得用户信息
const findUserByCookie = function (cookie) {
    return new Promise((resolve, reject) => {
        userinfo.find({ libSessionId: cookie }, (err, res) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(res);
        })
    })
}
/**
 * 由IDcardNo获得pswd
 * @param {*} IDCardNo 
 */
const getPswdFromIdcardNo = function (IDCardNo) {
    /**
     * 最后一位为X
     */
    let patt = /\d\d\d\d\d\dX$/g;
    let res = IDCardNo.match(patt);
    if (res !== null) {
        patt = /\d\d\d\d\d\d/g;
        res = res[0].match(patt);
        return res[0];
    }
    /**
     * 最后一位为数字
     */
    patt = /\d\d\d\d\d\d$/g;
    res = IDCardNo.match(patt);
    return res[0];
}
const axios = require('axios');
const userinfo = require('../models/userinfo.js');
const tryUsefulCookie = require('../crawler/tryUsefulCookie.js');
module.exports = app => {
    class UserController extends app.Controller {
        async rebind(ctx) {
            console.log('重新绑定用户信息')
            let stuId = ctx.request.body.stuId;
            let pswd = ctx.request.body.pswd;
            let name = ctx.request.body.name;
            let res = await ctx.service.user.rebind(stuId, pswd, name);
            this.ctx.body = res;
        }
        async checkUser(ctx) {
            /**
             * 拿cookie，查询数据库，用数据库中的信息尝试登陆,
             * 成功返回:this.ctx.body = { userLogin: true };
             * 失败返回:this.ctx.body = { userLogin:false };
             */
            console.log('checkuser : 验证用户信息')
            if (ctx.cookies.get('libSessionId') !== undefined) {
                console.log('获得了浏览器的cookie验证:' + ctx.cookies.get('libSessionId'))
                let res = await findUserByCookie(ctx.cookies.get('libSessionId'));
                if (res[0] !== undefined && res[0] !== null) {
                    //如果res[0].pswd 为空,则使用身份证后六位为密码
                    if (res[0].pswd == '' || res[0].pswd == null || res[0].pswd == undefined) {
                        res[0].pswd = getPswdFromIdcardNo(res[0].IDCardNo);
                    }
                    let login_res = await tryUsefulCookie(res[0].stuId, res[0].pswd, res[0].name);
                    if (login_res.success) {
                        console.log('登陆成功')
                        this.ctx.body = { userLogin: true };
                        return;
                    }
                    else {
                        console.log('登陆失败')
                        this.ctx.body = { userLogin: false };
                        return;
                    }
                } else {
                    console.log('根据cookie没有获得用户信息' + '登陆失败');
                    this.ctx.body = { userLogin: false };
                    return;
                }
            }
            this.ctx.body = { userLogin: false };
            return;

        }
    }
    return UserController;
};
