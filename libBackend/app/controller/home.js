'use strict';

module.exports = app => {
  class HomeController extends app.Controller {
    * index() {
      this.ctx.body = 'hi, NEAU library';
    }
  }
  return HomeController;
};
