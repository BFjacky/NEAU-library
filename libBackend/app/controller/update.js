module.exports = app => {
    class UpdateController extends app.Controller {
        //更新个人信息 并入库
        async updateGrxx(ctx) {
            console.log('post methods')
            let stuId = ctx.request.body.stuId;
            let pswd = ctx.request.body.pswd;
            let name = ctx.request.body.name;
            try {
                await ctx.service.update.updateGrxx(stuId, pswd, name);
            } catch (err) {
                console.log('更新失败!',err);
            }
        }
        //更新历史借阅 并入库
        async updateHisBooks(ctx) {
            console.log('hisbooks');
            let stuId = ctx.request.body.stuId;
            let pswd = ctx.request.body.pswd;
            let name = ctx.request.body.name;
            await ctx.service.update.updateHisBooks(stuId, pswd, name);
        }
        //更新当前借阅 并入库
        async updateNowBorrow(ctx) {
            let stuId = ctx.request.body.stuId;
            let pswd = ctx.request.body.pswd;
            let name = ctx.request.body.name;
            await ctx.service.update.updateNowBorrow(stuId, pswd, name);
        }
        //更新 个人信息 历史借阅 当前借阅 并入库
        async updateAll(ctx) {
            let stuId = ctx.request.body.stuId;
            let pswd = ctx.request.body.pswd;
            let name = ctx.request.body.name;
            try {
                await ctx.service.update.updateGrxx(stuId, pswd, name);
                await ctx.service.update.updateHisBooks(stuId, pswd, name);
                await ctx.service.update.updateNowBorrow(stuId, pswd, name);
            } catch (err) {
                console.log('更新失败！');
            }
        }
    }
    return UpdateController;
};

