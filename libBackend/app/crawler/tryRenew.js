
/*
    模拟续借续借
*/
const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const cheerio = require('cheerio');

module.exports = function tryRenew(cookie, barcode) {
    let options = {
        gzip: true,
        hostname: 'opac.lib.neau.edu.cn',
        port: 80,
        path: '/m/reader/renew.action',
        method: 'GET',
        headers: {
            'Accept-Encoding': 'gzip',
            'Accept-Language': 'zh-CN',
            Host: 'opac.lib.neau.edu.cn',
            Cookie: '',
        },
    };
    cookie = transformCookie(cookie);
    options.path = options.path + ';' + cookie + '?barcode=' + barcode;
    const p = new Promise(async function (resolve, reject) {
        const req = http.request(options, res => {
            const chunks = [];
            let size = 0;
            res.on('data', chunk => {
                chunks.push(chunk);
                size += chunk.length;
            });
            res.on('end', () => {
                data = new Buffer(size);
                data = Buffer.concat(chunks, size);
                zlib.gunzip(data, function (err, decoded) {
                    //decoded为空 说明请求续借失败
                    if (decoded == undefined || decoded == null || decoded == '') {
                        resolve(false);
                    }
                    const res = decoded.toString();
                    //如果页面中包含 续借成功 字样 ，则说明续借成功
                    if (res.indexOf('续借成功') !== -1) {
                        resolve(true);
                    }
                    else if (res.indexOf('超过最大续借次数，不得续借！')) {
                        resolve(false);
                    }
                    else {
                        resolve(false);
                    }
                });
            });
        });
        req.on('error', e => {
            console.error(`请求遇到问题: ${e.message}`);
            reject(e);
        });
        req.end();
    });
    return p;
};

//将JSESSIONID=D1232B87614EEE8AD8ACB3369001106F转换为jsessionid=DCC457498D71379E37199B279F7B5D35
let transformCookie = function (cookieStr) {
    let patt = /=\w+/g;
    let res = cookieStr.match(patt);
    if (res != null) {
        res[0] = 'jsessionid' + res[0];
        return res[0];
    }
}
