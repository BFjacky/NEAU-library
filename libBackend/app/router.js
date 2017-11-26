module.exports = app => {
  app.get('/api', app.controller.home.index);

  // 获得书籍关键词搜索结果   需要在后面加参数   如:?word=java&type=02&page=10
  app.get('/api/search/getSearchRes', app.controller.search.getSearchRes);

  // 获得一本书的细节信息   需要在后面加参数   如:?bookId=0000205976
  app.get('/api/search/getBookDetail', app.controller.search.getBookDetail);

  // 获得热门借阅分类
  app.get('/api/search/getTopLendClass', app.controller.search.getTopLendClass);

  // 获得热门借阅中某分类的书籍  需要在后面加参数   如:?clsNo=A&page=2
  app.get('/api/search/getTopLendDetail', app.controller.search.getTopLendDetail);

  // 更新一个人的个人信息并存入数据库 需要在后面加参数   如?stuId=A19150346&pswd=260410&name=张笑晨
  app.post('/api/update/grxx', app.controller.update.updateGrxx);

  // 更新一个人的历史借阅并存入数据库 需要在后面加参数   如?stuId=A19150346&pswd=260410&name=张笑晨
  app.post('/api/update/hisBooks', app.controller.update.updateHisBooks);

  // 更新一个人的当前借阅并存入数据库 需要在后面加参数   如?stuId=A19150346&pswd=260410&name=张笑晨
  app.post('/api/update/nowBorrow', app.controller.update.updateNowBorrow);

  // 更新一个人的全部信息并存入数据库 需要在后面加参数   如?stuId=A19150346&pswd=260410&name=张笑晨
  app.post('/api/update/all', app.controller.update.updateAll);

  // 根据学号一键续借 stuId=A01010101
  app.post('/api/update/tryRenew',app.controller.update.tryRenew);

  // 从数据库获得一个人的个人信息  需要在后面加参数   如?stuId=A19150346
  app.get('/api/fetch/grxx', app.controller.fetch.fetchGrxx);

  // 从数据库获得一个人的历史借阅  需要在后面加参数   如?stuId=A19150346
  app.get('/api/fetch/hisBooks', app.controller.fetch.fetchHisBooks);

  // 从数据库获得一个人的当前借阅  需要在后面加参数   如?stuId=A19150346
  app.get('/api/fetch/nowBorrow', app.controller.fetch.fetchNowBorrow);

  // 将数据库中所有同学的总借阅数量排名，并将排名结果保存到一个新table中（此操作耗时！）
  app.get('/api/analyse/rankTotalBooks', app.controller.analyse.rankTotalBooks);

  // 从数据库中获得一个人的总借书量排名 需要在后面加参数 如?stuId=A19150185
  app.get('/api/analyse/getRank', app.controller.analyse.getRank);

  // 从数据库中获得所有距离还书日期小于7天的书籍数据
  app.get('/api/analyse/getNeedBackBooks', app.controller.analyse.getNeedBackBooks);
};
