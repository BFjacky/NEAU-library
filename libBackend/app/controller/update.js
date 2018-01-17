module.exports = app => {
  class UpdateController extends app.Controller {
    // 更新个人信息 并入库
    async updateGrxx(ctx) {
      //console.log('updateGrxx');
      const stuId = ctx.request.body.stuId;
      const pswd = ctx.request.body.pswd;
      const name = ctx.request.body.name;
      try {
        await ctx.service.update.updateGrxx(stuId, pswd, name);
      } catch (err) {
        ctx.body = {
          project: 'updateGrxx',
          success: false,
          message: err.msg,
        };
        return;
      }
      ctx.body = {
        project: 'updateGrxx',
        success: true,
      };
    }
    // 更新历史借阅 并入库
    async updateHisBooks(ctx) {
      const stuId = ctx.request.body.stuId;
      const pswd = ctx.request.body.pswd;
      const name = ctx.request.body.name;
      try {
        await ctx.service.update.updateHisBooks(stuId, pswd, name);
      } catch (err) {
        console.log(err);
        ctx.body = {
          project: 'updateHisBooks',
          success: false,
          message: err.msg,
        };
        return;
      }
      ctx.body = {
        project: 'updateHisBooks',
        success: true,
      };
    }
    // 更新当前借阅 并入库
    async updateNowBorrow(ctx) {
      const stuId = ctx.request.body.stuId;
      const pswd = ctx.request.body.pswd;
      const name = ctx.request.body.name;
      try {
        await ctx.service.update.updateNowBorrow(stuId, pswd, name);
      } catch (err) {
        ctx.body = {
          project: 'updateNowBorrow',
          success: false,
          message: err.msg,
        };
        return;
      }
      ctx.body = {
        project: 'updateNowBorrow',
        success: true,
      };
    }
    // // 更新 个人信息 历史借阅 当前借阅 并入库
    // async updateAll(ctx) {
    //   const stuId = ctx.request.body.stuId;
    //   const pswd = ctx.request.body.pswd;
    //   const name = ctx.request.body.name;
    //   try {
    //     await ctx.service.update.updateGrxx(stuId, pswd, name);
    //     await ctx.service.update.updateHisBooks(stuId, pswd, name);
    //     await ctx.service.update.updateNowBorrow(stuId, pswd, name);
    //   } catch (err) {
    //     ctx.body = {
    //       project: 'updateAll',
    //       success: false,
    //       message: err.msg,
    //     };
    //     return;
    //   }
    //   ctx.body = {
    //     project: 'updateAll',
    //     success: true,
    //   };
    // }
    // 更新 历史借阅 当前借阅 并入库
    async updateAll(ctx) {
      const stuId = ctx.request.body.stuId;
      const pswd = ctx.request.body.pswd;
      const name = ctx.request.body.name;
      try {
        await ctx.service.update.updateHisBooks(stuId, pswd, name);
        await ctx.service.update.updateNowBorrow(stuId, pswd, name);
      } catch (err) {
        ctx.body = {
          project: 'updateAll',
          success: false,
          message: err.msg,
        };
        return;
      }
      ctx.body = {
        project: 'updateAll',
        success: true,
      };
    }
    //续借
    async tryRenew(ctx) {
      const stuId = ctx.request.body.stuId;
      let res;
      try {
        res = await ctx.service.update.tryRenew(stuId);
      } catch (err) {
        ctx.body = {
          project: 'tryRenew',
          success: false,
          message: err.msg,
        };
        return;
      }
      ctx.body = res;
    }
    //获取图书封面
    async getBookDetail(ctx) {
      /**
       * books 为['bookid_1','bookid_2'],前端传递时首先将数组字符串化
       * 后端接收时将字符串数组话，元素分割标记为';'
       */
      let books = ctx.request.query.books;
      books = books.split(';');
      let res = await ctx.service.update.getBookDetail(books);
      ctx.body = res;
    }

    //收藏一本书
    async collect(ctx) {
      let bookId = ctx.request.body.bookId;
      let stuId = ctx.request.body.stuId;
      let res = await ctx.service.update.collect(bookId, stuId);
      ctx.body = res;
    }

    //取消收藏一本书
    async cancelCollect(ctx) {
      let bookId = ctx.request.body.bookId;
      let stuId = ctx.request.body.stuId;
      let res = await ctx.service.update.cancelCollect(bookId, stuId);
      ctx.body = res;
    }

    //查看是否收藏了这本书
    async isCollect(ctx){
      let bookId = ctx.request.body.bookId;
      let stuId = ctx.request.body.stuId;
      let res = await ctx.service.update.isCollect(bookId, stuId);
      ctx.body = res;
    }
  }
  return UpdateController;
};

