module.exports = app => {
  class fetchController extends app.Controller {
    // 从数据库取出个人信息
    async fetchGrxx(ctx) {
      const stuId = ctx.query.stuId;
      const res = await ctx.service.fetch.fetchGrxx(stuId);
      this.ctx.body = res;
    }
    // 从数据库取出历史借阅
    async fetchHisBooks(ctx) {
      const stuId = ctx.query.stuId;
      const res = await ctx.service.fetch.fetchHisBooks(stuId);
      this.ctx.body = res;
    }
    // 从数据库取出当前借阅
    async fetchNowBorrow(ctx) {
      const stuId = ctx.query.stuId;
      const res = await ctx.service.fetch.fetchNowBorrow(stuId);
      this.ctx.body = res;
    }
  }
  return fetchController;
};
