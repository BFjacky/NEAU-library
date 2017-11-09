/*
    获得个人信息的html页面源码
*/
const http =require('http')
const fs = require('fs')
const path = require('path')
const zlib = require('zlib')
const options = {
    gzip:true,
    hostname: 'opac.lib.neau.edu.cn',
    port: 80,
    path: '/m/reader/info.action',
    method: 'GET',
    headers: {
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.8',
        'Host': 'opac.lib.neau.edu.cn',
        'Cookie': ''
    }
};
module.exports = function getgrxxHtml(cookie){
    let p = new Promise(async function(resolve,reject){
        options.headers.Cookie=cookie;
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
                zlib.gunzip(data,function(err,decoded){
                    let res = decoded.toString();
                    resolve(res)
                })
            });
        });

        req.on('error', (e) => {
            console.error(`请求遇到问题: ${e.message}`);
            reject(e);
        });
        req.end();
    })
    return p;
}

