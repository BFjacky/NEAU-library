/*
    请求到一个cookie
*/
const http = require('http');
const options = {
    hostname: 'opac.lib.neau.edu.cn',
    port: 80,
    path: '/m/reader/login.action',
    method: 'get',
}
module.exports = function getLoginCookie() {
    let p = new Promise(function (resolve, reject) {
        //请求登录页面
        const req = http.request(options, (res) => {
            //获得cookie
            const cookie = res.headers['set-cookie'][0].split(';')[0];
            //如果没有得到cookie
            if (cookie === '') {
                let err = new Error('没有获得cookie!')
                reject(err);
            }
            //返回cookie
            resolve(cookie);
        });
        req.on('error', (e) => {
            console.error(`请求遇到问题: ${e.message}`);
            reject(e);
        });
        req.end();
    })
    return p;
}

