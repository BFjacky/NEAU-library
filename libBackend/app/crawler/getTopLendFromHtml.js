/*
    将热门借阅图书分类页面的html源码中的数据爬取出来
*/
const cheerio = require('cheerio');

module.exports = function getTopLendFromHtml(htmlData) {
  const res = [];
  const $ = cheerio.load(htmlData);
  $('.weui_cell').each(function(i, elem) {
    res[i] = {
      href: String,
      className: String,
    };
    res[i].href = $(this).attr('href');
    res[i].className = $(this).find('p').text();
  });
  return res;
};
