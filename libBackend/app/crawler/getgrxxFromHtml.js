/*
    将grxx页面的html源码中的数据爬取出来
*/
const cheerio = require('cheerio');

module.exports = function getgrxxFromHtml(htmlData) {
  const res = [];
  const $ = cheerio.load(htmlData);
  $('.weui_cell_ft').each(function(i, elem) {
    if (i === 15) {
      res[i] = parseInt($(this).text());
    } else {
      res[i] = $(this).text();
    }
  });
  return res;
};

