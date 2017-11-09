/*
    获得书籍细节信息的html源码
*/
const http = require('http')
const fs = require('fs')
const path = require('path')
const zlib = require('zlib')
const cheerio = require('cheerio')
const options = {
    gzip: true,
    hostname: 'opac.lib.neau.edu.cn',
    port: 80,
    path: '/m/opac/detail.action?id=',
    method: 'GET',
    headers: {
        'Accept-Encoding': 'gzip',
        'Accept-Language': 'zh-CN',
        'Host': 'opac.lib.neau.edu.cn',
        'Cookie': ''
    }
};
module.exports = function getBookDetailHtml(bookId) {
    let p = new Promise(async function (resolve, reject) {
        options.path = options.path + bookId;
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
                zlib.gunzip(data, function (err, decoded) {
                    let res = decoded.toString();
                    resolve(res);
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


