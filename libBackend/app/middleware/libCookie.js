const axios = require('axios');
const userinfo = require('../models/userinfo.js');
const tryUsefulCookie = require('../crawler/tryUsefulCookie.js');

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
 * 处理图书馆内部url跳转的用户信息查阅请求,用cookie获得用户信息，接管请求体
 */


module.exports = () => {
    return async function (ctx, next) {
        const cookie = ctx.cookies.get('libSessionId');
        let res = await findUserByCookie(ctx.cookies.get('libSessionId'));
        //如果res[0].pswd 为空,则使用身份证后六位为密码
        if (res[0].pswd == '' || res[0].pswd == null || res[0].pswd == undefined) {
            res[0].pswd = getPswdFromIdcardNo(res[0].IDCardNo);
        }
        console.log('进入了libCookie中间件:' + cookie, 'res:' + res[0]);
        ctx.request.body.stuId = res[0].stuId;
        ctx.request.body.pswd = res[0].pswd;
        ctx.request.body.name = res[0].name;
        ctx.request.query.stuId = res[0].stuId;
        await next();
        return;
    }
}