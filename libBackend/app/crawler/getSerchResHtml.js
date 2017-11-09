/*
    获得搜索书籍结果的html源码
    搜索类别:
    任意词:any;
    题名:02;
    责任者:03;
    主题:04;
    ISBN:05;
    索书号:08;
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
    path: '/m/opac/search.action?',
    method: 'GET',
    headers: {
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.8',
        'Host': 'opac.lib.neau.edu.cn',
        'Cookie': ''
    }
};
module.exports = function getSerchResHtml(queryWord, queryType, page) {
    let p = new Promise(async function (resolve, reject) {
        options.path = '/m/opac/search.action?q=' + queryWord + '&t=' + queryType + '&page=' + page;
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


