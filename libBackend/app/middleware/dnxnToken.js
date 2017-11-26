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



module.exports = () => {
    const self = this;
    return async function (ctx, next) {
        /**
         * 获得请求中的cookie
         *  1.获得到合法可用信息 return
         *  2.未获得合法可用信息 go on
         */
        if (ctx.cookies.get('libSessionId') === undefined) {
            let res = await findUserByCookie(ctx.cookies.get('libSessionId'));
            if (res[0] !== undefined && res[0] !== null) {
                let login_res = await tryUsefulCookie(res[0].stuId, res[0].pswd, res[0].name);
                if (login_res.success) {
                    //登陆成功 
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
                    //登陆成功 
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
                //登陆成功 
                let userInsertNew = await insertUser(res1, res2);
                return;
            }
        }

        //无法获得用户信息，跳转到登录界面，从新绑定

    }
}