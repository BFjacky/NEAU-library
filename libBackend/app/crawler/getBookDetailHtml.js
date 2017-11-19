/*
    获得书籍细节信息的html源码
*/
const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const cheerio = require('cheerio');

module.exports = function getBookDetailHtml(bookId) {
  let options = {
    gzip: true,
    hostname: 'opac.lib.neau.edu.cn',
    port: 80,
    path: '/m/opac/detail.action?id=',
    method: 'GET',
    headers: {
      'Accept-Encoding': 'gzip',
      'Accept-Language': 'zh-CN',
      Host: 'opac.lib.neau.edu.cn',
      //后加的
      'Upgrade-Insecure-Requests': '1',
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
      Cookie: 'JSESSIONID=D919AC269C98287C310DB5661873AB9A',
      Connection: 'keep-alive',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Cache-Control': 'max-age=0'
    },
  };
  const p = new Promise(async function (resolve, reject) {
    options.path = options.path + bookId;
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
          const res = decoded.toString();
          resolve(res);
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

