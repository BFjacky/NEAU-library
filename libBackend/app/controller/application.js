const path = require('path');
const fs = require('fs');
module.exports = app => {
    class ApplicationController extends app.Controller {
        async index() {
            //获得aid参数，如果数据库中有信息则不存，没信息则存
            let res = fs.readFileSync(path.join(__dirname, '../public', '/index.html'));
            this.ctx.response.append("content-type", "text/html");
            this.ctx.response.body = res;
        }
    }
    return ApplicationController;
};
