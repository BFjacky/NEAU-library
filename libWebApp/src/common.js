const axios = require('axios')
const urlPrefix = "/api"
export default {
    install(Vue, options) {
        Vue.prototype.$common = {
            //常量---------------------------------------------------------------------------------------------------

            //主机地址
            host: "http://127.0.0.1:7001",

            //搜索书籍详细信息的url
            bookDetailUrl: urlPrefix + "/api/search/getBookDetail",

            //书籍分类信息的url
            classUrl: urlPrefix + "/api/search/getTopLendClass",

            //搜索书籍的url
            searchBookUrl: urlPrefix + "/api/search/getSearchRes",

            //获得分类详细信息的url
            classDetailUrl: urlPrefix + "/api/search/getTopLendDetail",

            //获取当前借阅的url
            nowBorrow: urlPrefix + "/api/fetch/nowBorrow",

            //获取历史借阅的url
            hisBorrow: urlPrefix + "/api/fetch/hisBooks",

            //更新全部个人信息的url
            updateAll: urlPrefix + "/api/update/all",

            //续借请求的url
            renewUrl: urlPrefix + "/api/update/tryRenew",

            //图书馆主机名称（imgurl前缀）
            libHost: "http://opac.lib.neau.edu.cn",

            //图书馆书籍暂无封面url
            bookNoCoverUrl: "http://opac.lib.neau.edu.cn/m/mopac/inner/images/no-book.jpg",

            //图书馆书籍暂无封面path
            bookNoCoverPath: "/m/mopac/inner/images/no-book.jpg",

            //重新绑定账号的url
            rebindUrl: urlPrefix + "/api/rebind",

            //重新绑定账号的url
            checkUserUrl: urlPrefix + "/api/checkUser",

            //测试用个人信息
            person: {
                stuId: '',
                pswd: '',
                name: '',
            },

            //书籍即将到期的期限 10天
            warn_days: 10,

            //bookMorePageInfo
            bookMorePageInfo: {
                books: [],
                number: 0,
                title: '',
                myScrollTop: 0,
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
            },



            //跟据当前路由检查该页面是回退的还是前进
            urlName: {
                loginPage: 0,
                searchPage: 1,
                searchResult: 2,
                bookDetail: 4,
                personalPage: 2,
                bookMorePage: 3,
                beforeUrl: '',
            },
            /**
             * 回退路由返回true，
             * 前进路由返回false，
             */
            isBackUrl: function (myUrlName) {
                if (this.urlName.beforeUrl === '') {
                    this.urlName.beforeUrl = myUrlName;
                    return false;
                }
                let beforeUrlName = this.urlName.beforeUrl;
                if (this.urlName[myUrlName] <= this.urlName[beforeUrlName]) {
                    this.urlName.beforeUrl = myUrlName;
                    return true;
                }

                this.urlName.beforeUrl = myUrlName;
                return false;
            },


            //变量---------------------------------------------------------------------------------------------------

            //保存searchResult中的变量
            searchResult: {
                //滚动条位置
                myScrollTop: 0,
                //保存分类信息
                classes: [],
                //保存搜索结果的书籍信息
                books: [],
                //保存书籍总数
                booksNumber: 0,
                //搜索框是否有内容
                isEmpty: true,
                //保存这是第几次改变输入的搜索字符串
                changeTimes: 0,
                //加载中
                loading: false,
                //实时更新书籍数据是否busy
                busy: false,
                //保存当前的url，判断书籍信息是热门分类还是搜索信息
                nowUrl: "",
                //当前的页码
                nowPage: 1,
                //搜索框的字符串,
                searchStr: "",
                //总页码数
                totalPages: 0,
                //分类选择
                claNo: "",
                //是否被销毁过
                beDestroyed: false,
            },

            //保存personalPage中的变量
            personalPage: {
            }
        };
    }
}