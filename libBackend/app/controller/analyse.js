/*
    对已有数据进行分析
*/
module.exports = app => {
  class analyseController extends app.Controller {

    // 根据总借书量进行排名
    async rankTotalBooks(ctx) {
      const res = await ctx.service.analyse.rankTotalBooks();
      this.ctx.body = res;
    }

    // 获得一个学生的总借书量排名
    async getRank(ctx) {
      const stuId = ctx.query.stuId;
      const res = await ctx.service.analyse.getRank(stuId);
      this.ctx.body = res;
    }

    // 获得需要提醒归还/续借的书籍信息
    async getNeedBackBooks(ctx) {
      const res = await ctx.service.analyse.getNeedBackBooks();
      this.ctx.body = res;
    }

  }
  return analyseController;
};
