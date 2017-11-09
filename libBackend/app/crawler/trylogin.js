/*
    使用stuId和password(默认身份证后6位)登陆图书馆激活cookie
*/
const http = require('http')
const querystring = require('querystring');
let postData;
let prePostData = {
    name: '',
    passwd: '',
    type: '',
    verifyCode: '',
};
const options = {
    hostname: 'opac.lib.neau.edu.cn',
    port: 80,
    path: '/m/reader/check_login.action',
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': '',
        'Cookie': '',
    }
};
module.exports = function tryLogin(stu) {

    let p = new Promise(async function (resolve, reject) {

        //接受到stu之后设置一下请求信息-------------------------------------
        prePostData.name = stu.stuId;
        prePostData.passwd = stu.pswd;
        postData = querystring.stringify(prePostData);
        options.headers.Cookie = stu.cookie;
        options.headers['Content-Length'] = Buffer.byteLength(postData);
        //----------------------------------------------------------------

        const req = http.request(options, (res) => {
            var chunks = [];
            let size = 0;
            res.on('data', (chunk) => {
                chunks.push(chunk);
                size += chunk.length;
            });
            res.on('end', () => {
                data = new Buffer(size);
                data = Buffer.concat(chunks, size);
                let res = data.toString('utf8', 0, size);
                try {
                    res = JSON.parse(res);
                } catch (err) {
                    err = new Error('JSON解析数据出错');
                    reject(err);
                }
                if (res.success) {
                    //登陆成功，激活了cookie，返回一个带有激活cookie的student对象
                    resolve(stu);
                }
                else {
                    //登陆失败，cookie无效
                    reject(res);
                }
            });
        });

        req.on('error', (e) => {
            console.error(`请求遇到问题: ${e.message}`);
            reject(e);
        });

        // 写入数据到请求主体
        req.write(postData);
        req.end();
    })
    return p;
}
