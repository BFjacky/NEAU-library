//维护前端代码中所需要的常量
module.exports = {
    //主机地址
    host: "http://127.0.0.1:7001",
    //搜索书籍详细信息的url
    bookDetailUrl: "/api/api/search/getBookDetail",
    //书籍分类信息的url
    classUrl: "/api/api/search/getTopLendClass",
    //搜索书籍的url
    searchBookUrl: "/api/api/search/getSearchRes",
    //获得分类详细信息的url
    classDetailUrl: "/api/api/search/getTopLendDetail",
    //获取当前借阅的url
    nowBorrow: "/api/api/fetch/nowBorrow",
    //获取历史借阅的url
    hisBorrow: "/api/api/fetch/hisBooks",
    //更新全部个人信息的url
    updateAll: "/api/api/update/all",
}