/*
    获得借阅历史的html页面源码
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
    path: '/m/reader/lend_hist.action?page=1',
    method: 'GET',
    headers: {
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.8',
        'Host': 'opac.lib.neau.edu.cn',
        'Cookie': ''
    }
};
function getHistoryBookHtml(cookie, page) {
    let p = new Promise(async function (resolve, reject) {
        options.path = '/m/reader/lend_hist.action?page=' + page;
        options.headers.Cookie = cookie;
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

module.exports = async function getHistoryBookHtmlPages(cookie) {
    let datas = [];
    let pageLimit;
    let page = 1;
    while (true) {
        if (page === 1) {
            //先抓取借阅历史的第一页
            datas[page] = await getHistoryBookHtml(cookie, page);
            //从这页中获得总的借阅数量
            const $ = cheerio.load(datas[page]);
            let numberStr = $('.center').text();
            //此人没借阅过书籍，页面处数字为空
            if (numberStr === '') {
                return datas;
            }
            //正则提取数字
            patt = /\d+/g;
            let number = numberStr.match(patt);   //总页数在number[1]中
            pageLimit = number[1];
            page++;
        }
        else if (page <= pageLimit) {
            //抓取借阅历史的其他页
            datas[page] = await getHistoryBookHtml(cookie, page);
            page++;
        }
        else {
            break;
        }
    }
    //返回装有html源码的数组
    return datas;
}


