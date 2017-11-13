module.exports = app => {
    class UpdateController extends app.Controller {
        //更新个人信息 并入库
        async updateGrxx(ctx) {
            console.log('updateGrxx');
            let stuId = ctx.request.body.stuId;
            let pswd = ctx.request.body.pswd;
            let name = ctx.request.body.name;
            try {
                await ctx.service.update.updateGrxx(stuId, pswd, name);
            } catch (err) {
                ctx.body = {
                    project: 'updateGrxx',
                    success: false,
                    message: err.msg,
                }
                return;
            }
            ctx.body = {
                project: 'updateGrxx',
                success: true,
            }
        }
        //更新历史借阅 并入库
        async updateHisBooks(ctx) {
            let stuId = ctx.request.body.stuId;
            let pswd = ctx.request.body.pswd;
            let name = ctx.request.body.name;
            try {
                await ctx.service.update.updateHisBooks(stuId, pswd, name);
            } catch (err) {
                console.log(err);
                ctx.body = {
                    project: 'updateHisBooks',
                    success: false,
                    message: err.msg,
                }
                return;
            }
            ctx.body = {
                project: 'updateHisBooks',
                success: true,
            }
        }
        //更新当前借阅 并入库
        async updateNowBorrow(ctx) {
            let stuId = ctx.request.body.stuId;
            let pswd = ctx.request.body.pswd;
            let name = ctx.request.body.name;
            try {
                await ctx.service.update.updateNowBorrow(stuId, pswd, name);
            } catch (err) {
                ctx.body = {
                    project: 'updateNowBorrow',
                    success: false,
                    message: err.msg,
                }
                return;
            }
            ctx.body = {
                project: 'updateNowBorrow',
                success: true,
            }
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
                ctx.body = {
                    project: 'updateAll',
                    success: false,
                    message: err.msg,
                }
                return;
            }
            ctx.body = {
                project: 'updateAll',
                success: true,
            }
        }
    }
    return UpdateController;
};

