/*
    将书的细节html源码中的数据爬取出来
*/
const cheerio = require('cheerio');

module.exports = function getBookDetailFromHtml(htmlData) {
  const res = [];
  const $ = cheerio.load(htmlData);
  $('.weui_media_bd').each(function(i, elem) {
    if (i === 0) {
      res[i] = {
        title: String,
        author: [],
        info: String,
        ISBN: String,
      };
      res[i].title = $(this).find('.weui_media_title').text();
      console.log(res[i].title);
      $(this).find('.weui_media_desc').find('a')
        .each(function(j, elem) {
          res[i].author[j] = {
            authorName: String,
            authorLinkUrl: String,
          };
          res[i].author[j].authorName = $(this).text();
          res[i].author[j].authorLinkUrl = $(this).attr('href');
        });
      $(this).find('.weui_media_info');
      $(this).find('.weui_media_info_meta').each(function(j, elem) {
        if (j === 0) {
          res[i].info = $(this).text();
        }
        if (j === 1) {
          res[i].ISBN = $(this).text();
        }
      });
    } else {
      res[i] = {
        title: String,
        place: String,
        ableBorrow: String,
      };
      res[i].title = $(this).find('.weui_media_title').text();
      res[i].place = $(this).find('.weui_media_desc').text();
      res[i].ableBorrow = $(this).find('.weui_media_info_meta').text();
    }
  });
  return res;
};

