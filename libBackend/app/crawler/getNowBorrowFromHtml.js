/*
    将当前借阅页面的html源码中的数据爬取出来
*/
const cheerio = require('cheerio')

module.exports = function getNowBorrowFromHtml(htmlData) {
    let res = [];
    const $ = cheerio.load(htmlData);
    $('.weui_media_bd').each(function (i, elem) {
        res[i] = {
            bookName: String,
            borrowDate: String,
            lawBackDate: String,
            bookPlace: String,
            renewNum: String,
        }
        res[i].bookName = $(this).find('.weui_media_title').text();
        res[i].borrowDate = $(this).find('.weui_media_desc').text();
        $(this).find('.weui_media_info_meta').each(function (j, elem) {
            switch (j) {
                case 0:
                    res[i].lawBackDate = $(this).text();
                case 1:
                    res[i].bookPlace = $(this).text();
                case 2:
                    res[i].renewNum = $(this).text();
            }
        })
    })
    return res;
}
