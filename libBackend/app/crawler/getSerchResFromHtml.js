/*
    将搜索结果页面的html源码中的数据爬取出来
*/
const cheerio = require('cheerio');

module.exports = function getSerchResFromHtml(htmlData) {
  // 获取搜索结果页面中的书籍信息
  const result = [];
  const res = [];
  let resultsNumber;
  const $ = cheerio.load(htmlData);
  $('.weui_panel_hd').each(function(i, elem) {
    resultsNumber = $(this).text();
    patt = /\d+/g;
    resultsNumber = resultsNumber.match(patt);
  });

  // 如果搜索结果数目为0 ,返回空数组
  if (resultsNumber == 0) {
    result[0] = [];
    result[1] = 0;
    return result;
  }

  $('.weui_media_box').each(function(i, elem) {
    res[i] = {
      bookName: String, // 书名
      author: String, // 作者
      holding: String, // 馆藏
      camBorrow: String, // 可借
      imgUrl: String, // 书籍封面url
      bookId: String, // 书籍Url Id
    };
    res[i].bookName = $(this).find('.weui_media_title').text();
    res[i].author = $(this).find('.weui_media_desc').text();
    res[i].holding = $(this).find('.weui_media_info_meta').text();
    res[i].imgUrl = $(this).find('.weui_media_appmsg_thumb').attr('src');
    res[i].bookId = $(this).attr('href');

    patt = /id=\d\d\d\d\d\d\d\d\d\d/g;
    res[i].bookId = res[i].bookId.match(patt);
    res[i].bookId = res[i].bookId[0];

    if (res[i].imgUrl.indexOf('no-book.jpg') !== -1) {
      res[i].imgUrl = 'http://opac.lib.neau.edu.cn' + res[i].imgUrl;
    }
  });

  // 获取搜索结果中的最大页数
  const numberStr = $('.center').text();
  // 查询书籍为空则页面处数字为空，则总页数为1
  if (numberStr === '') {
    result[0] = res;
    result[1] = 1;
    return result;
  }
  // 正则提取数字
  patt = /\d+/g;
  const number = numberStr.match(patt); // 总页数在number[1]中
  pageLimit = number[1];

  // 将书籍信息和最大页数共同放进一个数组传出;
  result[0] = res;
  result[1] = pageLimit;
  return result;
};
