
module.exports = app => {
    class UserController extends app.Controller {
        async rebind(ctx) {
            let stuId = ctx.request.body.stuId;
            let pswd = ctx.request.body.pswd;
            let name = ctx.request.body.name;
            let res = await ctx.service.user.rebind(stuId, pswd, name);
            this.ctx.body = res;
        }
        async checkUser(ctx) {
            //如果通过了dnxnToken中间件到达了controller，则说明该用户信息正确
            this.ctx.body = { userLogin: true };
        }
    }
    return UserController;
};
