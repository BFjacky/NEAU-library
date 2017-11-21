/*
    将借阅历史页面的html源码中的数据爬取出来
*/
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');


module.exports = function getHistoryBookFromHtml(htmlData) {
  const res = [];
  const $ = cheerio.load(htmlData);
  $('.weui_media_bd').each(function (i, elem) {
    res[i] = {
      bookId: '',
      bookName: '',
      borrowDate: '',
      returnDate: '',
      bookPlace: '',
    };
    $(this).find('.weui_media_title').each(function (j, elem) {
      res[i].bookName = $(this).text();
    });
    $(this).find('.weui_media_desc').each(function (j, elem) {
      res[i].borrowDate = $(this).text();
    });
    $(this).find('.weui_media_info_meta').each(function (j, elem) {
      if (j == 0) {
        res[i].returnDate = $(this).text();
      } else {
        res[i].bookPlace = $(this).text();
      }
    });
  });
  $('.weui_media_box').each(function (i, elem) {
    res[i].bookId = $(this).attr('href');
    patt = /id=\d\d\d\d\d\d\d\d\d\d/g;
    res[i].bookId = res[i].bookId.match(patt);
    res[i].bookId = res[i].bookId[0];
  })
  // 返回爬取html页面后装有数据对象的数组
  return res;
};

