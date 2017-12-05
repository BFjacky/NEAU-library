const getSerchResFromHtml = require('../crawler/getSerchResFromHtml.js');
const getSerchResHtml = require('../crawler/getSerchResHtml.js');
const getBookDetailFromHtml = require('../crawler/getBookDetailFromHtml.js');
const getBookDetailHtml = require('../crawler/getBookDetailHtml.js');
const getTopLendHtml = require('../crawler/getTopLendHtml.js');
const getTopLendFromHtml = require('../crawler/getTopLendFromHtml.js');
const getTopLendDetailHtml = require('../crawler/getTopLendDetailHtml.js');
const getTopLendDetailFromHtml = require('../crawler/getTopLendDetailFromHtml.js');
const book = require('../models/book.js')
const fs = require('fs');
const path = require('path');
module.exports = app => {
  class searchService extends app.Service {
    async getSearchRes(queryWord, queryType, page) {
      /*
                爬取图书馆搜索结果页面信息
                搜索类别:（queryType）
                任意词:any;
                题名:02;
                责任者:03;
                主题:04;
                ISBN:05;
                索书号:08;
            */
      // 将参数作为URI进行编码
      queryWord = encodeURI(queryWord);
      let data;
      try {
        // 根据queryWord和queryType获取查询图书馆
        const htmlData = await getSerchResHtml(queryWord, queryType, page);
        /*
                    从HTML页面中获得书籍信息
                    data[0]为查询书籍信息
                    data[1]为查询最大页数（一页十本书的信息）
                */
        data = getSerchResFromHtml(htmlData);
      } catch (err) {
        reject(err);
      }
      return data;
    }

    async getBookDetail(bookId) {
      /**
       * 传入bookId来查询书籍的详细信息，此信息是getSerchRes.js中得到的结果的对象属性，
       * 将此书籍信息更新至数据库中,
       */
      const updateBook = function (bookId, res) {
        return new Promise((resolve, reject) => {
          let bookPlace = [];
          for (let i = 1; i < res.length; i++) {
            bookPlace[i - 1] = res[i];
          }
          book.update(
            { bookId: bookId },
            {
              title: res[0].title,
              author: res[0].author,
              info: res[0].info,
              ISBN: res[0].ISBN,
              imgurl: res[0].imgurl,
              bookPlace: bookPlace,
            },
            {
              mutil: true,
              upsert: true,
            }, (err, res) => {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            })
        })
      }
      const htmlData = await getBookDetailHtml(bookId);
      const res = getBookDetailFromHtml(htmlData);
      let update_result = await updateBook(bookId, res);
      return res;
    }

    // 获得热门借阅的分类信息
    async getTopLendClass() {
      const htmlData = await getTopLendHtml();
      const res = getTopLendFromHtml(htmlData);
      return res;
    }

    // 获得热门借阅某一类某一页的详细信息
    async getTopLendDetail(clsNo, page) {
      const htmlData = await getTopLendDetailHtml(clsNo, page);
      const res = getTopLendDetailFromHtml(htmlData);
      return res;
    }
  }
  return searchService;
};
