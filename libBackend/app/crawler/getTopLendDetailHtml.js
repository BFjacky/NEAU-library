/*
    获取热门借阅某一个分类的html源码
*/
const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const cheerio = require('cheerio');

// 这里传入一个类别，A-Z（没有L,M）,和查询的页数page
module.exports = function getTopLendDetailHtml(clsNo, page) {
  let options = {
    gzip: true,
    hostname: 'opac.lib.neau.edu.cn',
    port: 80,
    path: '/m/info/top_lend.action?clsNo=',
    method: 'GET',
    headers: {
      'Accept-Encoding': 'gzip',
      'Accept-Language': 'zh-CN',
      Host: 'opac.lib.neau.edu.cn',
      Cookie: '',
    },
  };
  const p = new Promise(async function (resolve, reject) {
    options.path = options.path + clsNo + '&page=' + page;
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

