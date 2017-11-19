module.exports = {
  schedule: {
    interval: 3600 * 1000, // 1小时间隔
    type: 'all', // 指定所有的 worker 都需要执行
  },
  * task(ctx) {
    const now = new Date();
    const nowHours = now.getHours();
    // 每天凌晨三点时更新借书量排名数据
    if (nowHours === ctx.app.config.updateRankTime) {
      ctx.service.analyse.rankTotalBooks();
    }
  },
};
