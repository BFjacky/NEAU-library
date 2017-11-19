module.exports = () => {
    return async function (ctx, next) {
        //---设置可跨域访问----
        ctx.response.append("Access-Control-Allow-Origin", "http://localhost:8080");
        ctx.response.append("Access-Control-Allow-Credentials", "true");
        ctx.response.append("Access-Control-Allow-Methods", "*");
        await next();
        return;
    }
}