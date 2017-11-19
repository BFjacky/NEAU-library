module.exports = app => {
  class SearchController extends app.Controller {
    // 根据关键词获得搜索结果
    async getSearchRes(ctx) {
      const word = ctx.query.word;
      const type = ctx.query.type;
      const page = ctx.query.page;
      const res = await ctx.service.search.getSearchRes(word, type, page);
      this.ctx.body = res;
    }
    // 根据bookId获得一本书的细节信息
    async getBookDetail(ctx) {
      const bookId = ctx.query.bookId;
      const res = await ctx.service.search.getBookDetail(bookId);
      this.ctx.body = res;
    }
    // 获得热门借阅的分类信息
    async getTopLendClass(ctx) {
      const res = await ctx.service.search.getTopLendClass();
      this.ctx.body = res;
    }
    // 获得热门借阅某一类某一页的详细信息
    async getTopLendDetail(ctx) {
      const clsNo = ctx.query.clsNo;
      const page = ctx.query.page;
      const res = await ctx.service.search.getTopLendDetail(clsNo, page);
      this.ctx.body = res;
    }
  }
  return SearchController;
};

