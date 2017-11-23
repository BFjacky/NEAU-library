const axios = require('axios')

export default {
    install(Vue, options) {
        Vue.prototype.$common = {
            //常量---------------------------------------------------------------------------------------------------


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

            //图书馆主机名称（imgurl前缀）
            libHost: "http://opac.lib.neau.edu.cn",

            //图书馆书籍暂无封面url
            bookNoCoverUrl: "http://opac.lib.neau.edu.cn/m/mopac/inner/images/no-book.jpg",

            //图书馆书籍暂无封面path
            bookNoCoverPath: "/m/mopac/inner/images/no-book.jpg",

            //测试用个人信息
            person: {
                stuId: 'A02150273',
                pswd: '213363',
                name: '陈云飞',
            },


            //方法---------------------------------------------------------------------------------------------------


            //检查封面
            checkCover: async function (imgUrl) {
                if (imgUrl === undefined) {
                    return this.bookNoCoverUrl;
                }
                if (imgUrl === this.bookNoCoverUrl) {
                    return this.bookNoCoverUrl;
                }

                //判断imgUrl是否有效
                try {
                    let res = await axios({
                        method: "get",
                        url: imgUrl,
                    })
                    //有效
                    if (res.status === 200) {
                        return imgUrl;
                    }
                }
                catch (err) {
                    //无效
                    //  console.log('检查url无效:', imgUrl)
                    return this.bookNoCoverUrl
                }

            },

            //根据bookId获得 bookImgUrl   参数:'id=xxxxxxxxxx'
            getbookImgUrl: async function (bookId) {
                let self = this;

                //根据bookid获得初步的url
                let getImgUrl = async function (bookId) {
                    let res = await axios({
                        methods: "get",
                        url: self.bookDetailUrl,
                        params: {
                            bookId: bookId
                        }
                    });
                    return res.data[0].imgurl;
                }

                //解析bookid 并获得url
                let patt = /\d+/g;
                bookId = bookId.match(patt)[0];
                let imgUrl = await getImgUrl(bookId);
                if (this.bookNoCoverPath === imgUrl) {
                    imgUrl = self.libHost + imgUrl
                }

                //获得合理的url
                imgUrl = await this.checkCover(imgUrl);

                return imgUrl
            }

        };
    }
}