const booksModel = require("../models/book.js")
module.exports = app => {
  class fetchController extends app.Controller {
    // 从数据库取出个人信息
    async fetchGrxx(ctx) {
      const stuId = ctx.request.body.stuId
      const res = await ctx.service.fetch.fetchGrxx(stuId);
      this.ctx.body = res;
    }
    // 从数据库取出历史借阅
    async fetchHisBooks(ctx) {
      const stuId = ctx.request.body.stuId
      const res = await ctx.service.fetch.fetchHisBooks(stuId);
      this.ctx.body = res;
    }
    // 从数据库取出当前借阅
    async fetchNowBorrow(ctx) {
      const stuId = ctx.request.body.stuId
      const res = await ctx.service.fetch.fetchNowBorrow(stuId);
      this.ctx.body = res;
    }
    //从数据库中取出这个同学现在收藏的书籍
    async fetchNowCollect(ctx) {
      const stuId = ctx.request.body.stuId;
      const res = await ctx.service.fetch.fetchNowCollect(stuId);
      const findByBookId = function (bookId) {
        return new Promise((resolve, reject) => {
          booksModel.find({ bookId: bookId }, (err, res) => {
            if (err) {
              reject(err);
            } else {
              resolve(res);
            }
          })
        })
      }
      //如果res的长度为0
      if (res.length === 0) {
        this.ctx.body = [];
        return [];
      }
      if (res[0].books.length === 0) {
        this.ctx.body = [];
        return [];
      }

      //根据每本书的bookid，寻找book的详细信息
      let booksid = res[0].books;
      let books = [];
      for (let i = 0; i < booksid.length; i++) {
        let book = await findByBookId(booksid[i]);
        /*
         * 逻辑上收藏过的书籍都会存在于本地数据库中
         * 所以可以直接在本地数据库中查找，
         * 也有可能出现意外，在本地数据库中找不到该书，抛出错误即可
         * （后续代码会完善这一现象，将不存在的书籍爬取回来）
         */
        if (book.length === 0) {
          console.log(`${booksid[i]}这本书没有存在在数据库中!!`)
        }
        else {
          books[i] = book[0];
        }
      }

      //根据books
      this.ctx.body = books;
    }
  }
  return fetchController;
};
