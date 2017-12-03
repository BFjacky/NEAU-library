const axios = require('axios');
const userinfo = require('../models/userinfo.js');
const tryUsefulCookie = require('../crawler/tryUsefulCookie.js');
const insertUser = function (res1, res2) {
    return new Promise((resolve, reject) => {
        //存入数据库中
        userinfo.update({ _id: res1.data._id }, {
            _id: res1.data._id,
            student: res1.data.student,
            wasNew: res1.data.wasNew,
            login: res1.data.login,
            unions: res1.data.unions,
            phoneNumber: res1.data.phoneNumber,
            id: res1.data.id,

            stuId: res2.data.stuId,
            name: res2.data.name,
            gender: res2.data.gender,
            grade: res2.data.grade,
            department: res2.data.department,
            major: res2.data.major,
            className: res2.data.className,
            schoolId: res2.data.schoolId,
            IDCardNo: res2.data.IDCardNo,
            pswd: res2.data.pswd,
        }, { upsert: true, multi: true }, (err, res) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(res);
        })
    })
}
const findUser = function (res1, res2) {
    return new Promise((resolve, reject) => {
        userinfo.find({ _id: res1.data._id }, (err, res) => {
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

//将一名用户的cookie更新到数据库中
const updateCookieById = function (_id, cookie) {
    return new Promise((resolve, reject) => {
        userinfo.update({ _id: _id }, { libSessionId: cookie }, { upsert: false, multi: false }, (err, res) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(res);
        })
    })
}

//生成随机字符串
const randomString = function () {
    //默认位数为200位
    let len = 200;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var maxPos = $chars.length;
    var pwd = '';
    for (i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}








module.exports = () => {
    const self = this;
    return async function (ctx, next) {
        console.log('进入了dnxnToken');
        //--------------------------------以下仅在用户从小程序跳转到 图书馆时进行，图书馆内部跳转请求，不经过这个地方------------------
        /**
         * 获得请求中的cookie
         *  1.获得到合法可用信息 return
         *  2.未获得合法可用信息 go on
         */
        if (ctx.cookies.get('libSessionId') !== undefined) {
            let res = await findUserByCookie(ctx.cookies.get('libSessionId'));
            if (res[0] !== undefined && res[0] !== null) {
                //如果res[0].pswd 为空,则使用身份证后六位为密码
                if (res[0].pswd == '' || res[0].pswd == null || res[0].pswd == undefined) {
                    res[0].pswd = getPswdFromIdcardNo(res[0].IDCardNo);
                }
                let login_res = await tryUsefulCookie(res[0].stuId, res[0].pswd, res[0].name);
                if (login_res.success) {
                    /** 
                     * 由cookie获得的用户信息合法
                     * 1.接管 ctx.body,ctx.query中的用户信息
                     * 2.前往下一中间件
                     * 3.return;
                     */

                    ctx.request.body.stuId = res[0].stuId;
                    ctx.request.body.pswd = res[0].pswd;
                    ctx.request.body.name = res[0].name;
                    ctx.request.query.stuId = res[0].stuId;

                    console.log('浏览器cookie登陆成功')
                    await next();

                    return;
                }
            }
        }

        /**
         * 已知浏览器中无合法可用cookie，则需要获取dnxnToken
         *   1.dnxnToken存在，使用给定url和token获得该用户信息 
         *     (1)可用
         *        再议
         *     (2)不可用 
         *        去登陆界面吧
         *   2.dnxnToken不存在
         *     去登陆界面吧
         */
        //获取请求中的东农校内token
        const token_account = 'https://account.xiaonei.io/user/get';
        const token_jwcxn = 'https://jwc.xiaonei.io/student/get';
        const dnxnToken = ctx.query.aid;
        if (dnxnToken !== undefined && dnxnToken !== null && dnxnToken !== '') {
            //---!!!!!!!!!!!!!!!这里可能会因为token无效报错403!!!!!!!!!!!!!!!
            try {
                let res1 = await axios({
                    method: 'get',
                    url: token_account,
                    params: {
                        aid: dnxnToken,
                    }
                })
                let res2 = await axios({
                    method: 'get',
                    url: token_jwcxn,
                    params: {
                        aid: dnxnToken,
                        needIdCard: 1,
                    }
                })
            } catch (err) {
                //如果token不合法，跳转登录界面
                ctx.body = { userLogin: false };
                return;
            }
            let userFromMongo = await findUser(res1, res2);
            if (userFromMongo[0] !== undefined && userFromMongo[0] !== null && userFromMongo[0] !== '') {
                //在本地数据库中有此人的信息,需要判断能否登录成功
                let pswd = userFromMongo[0].pswd;
                if (pswd === undefined || pswd === null || pswd === '') {
                    pswd = getPswdFromIdcardNo(userFromMongo[0].IDCardNo);
                }
                let stuId = userFromMongo[0].stuId;
                let name = userFromMongo[0].name;
                //用获得的信息尝试登陆
                let login_res = await tryUsefulCookie(stuId, pswd, name);
                if (login_res.success) {
                    /**
                     * 本地验证用户信息通过操作:
                     * 1.为浏览器设置cookie,并将此coookie存入到该用户的用户信息中
                     * 2.接管 ctx.body,ctx.query中的用户信息
                     * 3.前往下一中间件
                     * 4.return;
                     */

                    let cookieStr = randomString();
                    ctx.cookies.set('libSessionId', cookieStr, {
                        maxAge: 1000 * 60 * 60 * 24 * 7,
                    });
                    await updateCookieById(userFromMongo[0]._id, cookieStr);

                    ctx.request.body.stuId = stuId;
                    ctx.request.body.pswd = pswd;
                    ctx.request.body.name = name;
                    ctx.request.query.stuId = stuId;

                    console.log('本地token合法，登陆成功')
                    await next();

                    return;
                }
            }
            //本地无此用户信息
            let stuId = res2.data.stuId;
            let IDCardNo = res2.data.IDCardNo;
            let pswd = getPswdFromIdcardNo(IDCardNo);
            let name = res2.data.name;
            //用获得的信息尝试登陆
            let login_res = await tryUsefulCookie(stuId, pswd, name);
            if (login_res.success) {
                /**
                   * 远端验证用户信息通过操作:
                   * 1.将此用户信息存储至数据库中
                   * 1.为浏览器设置cookie,并将此coookie存入到该用户的用户信息中
                   * 2.接管 ctx.body,ctx.query中的用户信息
                   * 3.前往下一中间件
                   * 4.return;
                   */

                let userInsertNew = await insertUser(res1, res2);

                let cookieStr = randomString();
                ctx.cookies.set('libSessionId', cookieStr, {
                    maxAge: 1000 * 60 * 60 * 24 * 7,
                });
                await updateCookieById(res1.data._id, cookieStr);

                ctx.request.body.stuId = stuId;
                ctx.request.body.pswd = pswd;
                ctx.request.body.name = name;
                ctx.request.query.stuId = stuId;

                console.log('远程token合法，成功登陆')
                await next();

                return;
            }
        }
        console.log('自助登陆失败')
        //无法获得用户信息，跳转到登录界面，从新绑定
        await next();
        return;
    }
}
