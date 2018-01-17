<template>
<!--带有展现 搜索结果 热门分类 的搜索界面-->
  <div class="search_result">
      <search-box class="search_box" v-on:search="doSearch" v-bind:searchStrFromFather = "searchStr"></search-box>
      <search-remind class="search_remind" v-bind:classes="classes" v-show="isEmpty" v-on:goinClass="goinClass"></search-remind>
      <books-result v-bind:books="books" v-bind:number="booksNumber" class="show_searchBooks"  v-show="!isEmpty" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="1400"></books-result>
  </div>
</template>
<style scoped>
div {
  border: 0px solid black;
  box-sizing: border-box;
}
.search_result {
  height: 100%;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}
.search_result_header {
}

.search_result_main {
}

.search_box {
  position: relative;
  margin-top: 3%;
  left: 50%;
  transform: translateX(-50%);
}
.search_remind {
  position: relative;
  margin-top: 20px;
  left: 50%;
  transform: translateX(-50%);
}
.show_searchBooks {
  height: 84%;
  margin-top: 3%;
  overflow: auto;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}
</style>

<script>
import searchBox from "./searchBox";
import searchRemind from "./searchRemind";
import booksResult from "./booksResult";
import axios from "axios";
import $ from "jquery";
//当前搜索的关键词
let search_keyWord;

export default {
  data: function() {
    return {
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
      //路由回退，搜索框重新赋值为原先的搜索内容，不进行搜索标志
      shouldSearch: true
    };
  },
  methods: {
    //接受了搜索事件
    doSearch: async function(searchStr) {
      if (!this.shouldSearch) {
        this.shouldSearch = true;
        return;
      }
      //重置信息
      this.nowUrl = this.$common.searchBookUrl;
      this.nowPage = 1;
      this.searchStr = searchStr;

      if (!this.loading) {
        this.loading = true;
        this.$vux.loading.show({
          text: "搬运数据中...",
          time: 10000000
        });
      }

      this.changeTimes++;
      let changeTimes = this.changeTimes;
      //searchStr是否为空
      if (searchStr === "") {
        this.isEmpty = true;
      } else {
        this.isEmpty = false;
      }

      let res = await axios({
        method: "get",
        url: this.$common.searchBookUrl,
        params: {
          word: searchStr,
          type: "02",
          page: this.nowPage
        }
      });

      if (changeTimes !== this.changeTimes) {
        return;
      }

      //搜索结果总页数
      let totalPages = res.data[1];
      //this.totalPages
      this.totalPages = totalPages;

      //爬取最后一页的书有多少本
      let lastPage = await axios({
        method: "get",
        url: this.$common.searchBookUrl,
        params: {
          word: searchStr,
          type: "02",
          page: totalPages
        }
      });

      if (changeTimes !== this.changeTimes) {
        return;
      }

      let lastPageBooks = lastPage.data[0].length;
      this.books = res.data[0];
      this.booksNumber =
        totalPages >= 1 ? (totalPages - 1) * 10 + lastPageBooks : lastPageBooks;

      this.nowPage++;
      if (this.loading) {
        this.loading = false;
        this.$vux.loading.hide();
      }

      console.log("已获得第1页内容!");
    },
    goinClass: async function(item) {
      //重置信息
      this.nowUrl = this.$common.classDetailUrl;
      this.nowPage = 1;

      this.isEmpty = false;

      if (!this.loading) {
        this.loading = true;
        this.$vux.loading.show({
          text: "搬运数据中...",
          time: 10000000
        });
      }

      //在classname中匹配出clsNo
      let patt = /[A-Z]/g;
      item.clsNo = patt.exec(item.className)[0];

      //重置信息
      this.clsNo = item.clsNo;

      let res = await axios({
        method: "get",
        url: this.$common.classDetailUrl,
        params: {
          clsNo: item.clsNo,
          page: this.nowPage
        }
      });

      this.book = res.data[0];

      //搜索结果总页数
      let totalPages = res.data[1];

      //重置信息
      this.totalPages = totalPages;

      //爬取最后一页的书有多少本
      let lastPage = await axios({
        method: "get",
        url: this.$common.classDetailUrl,
        params: {
          clsNo: item.clsNo,
          page: totalPages
        }
      });

      let lastPageBooks = lastPage.data[0].length;
      this.books = res.data[0];
      this.booksNumber =
        totalPages >= 1 ? (totalPages - 1) * 10 + lastPageBooks : lastPageBooks;

      this.nowPage++;
      if (this.loading) {
        this.loading = false;
        this.$vux.loading.hide();
      }

      console.log("已获得第1页内容!");
    },
    loadMore: async function() {
      this.busy = true;
      this.$vux.loading.show({
        text: "正在搬运数据..."
      });
      if (this.nowUrl === this.$common.searchBookUrl) {
        //爬取其他页码的搜索信息
        for (let i = this.nowPage; i <= this.totalPages; i++) {
          let res = await axios({
            method: "get",
            url: this.$common.searchBookUrl,
            params: {
              word: this.searchStr,
              type: "02",
              page: i
            }
          });
          this.books = this.books.concat(res.data[0]);
          console.log("已获得第" + i + "页内容!");
          //爬1页之后就不爬了
          if ((i = this.nowPage)) {
            this.nowPage = i + 1;
            break;
          }
        }
      } else {
        //爬取其他页码的分类书籍信息
        for (let i = this.nowPage; i <= this.totalPages; i++) {
          let res = await axios({
            method: "get",
            url: this.$common.classDetailUrl,
            params: {
              clsNo: this.clsNo,
              page: i
            }
          });
          this.books = this.books.concat(res.data[0]);
          console.log("已获得第" + i + "页内容!");
          //爬1页之后就不爬了
          if ((i = this.nowPage)) {
            this.nowPage = i + 1;
            break;
          }
        }
      }
      this.$vux.loading.hide({
        text: "正在搬运数据..."
      });
      this.busy = false;
    }
  },
  created: async function() {
    //如果为回退路由，则从保存的数据中读取出来
    if (this.$common.searchResult.beDestroyed) {
      //不应该搜索
      this.shouldSearch = false;
      //保存分类信息
      this.classes = this.$common.searchResult.classes;
      //保存搜索结果的书籍信息
      this.books = this.$common.searchResult.books;
      //保存书籍总数
      this.booksNumber = this.$common.searchResult.booksNumber;
      //搜索框是否有内容
      this.isEmpty = this.$common.searchResult.isEmpty;
      //保存这是第几次改变输入的搜索字符串
      this.changeTimes = this.$common.searchResult.changeTimes;
      //加载中
      this.loading = this.$common.searchResult.loading;
      //实时更新书籍数据是否busy
      this.busy = this.$common.searchResult.busy;
      //保存当前的url，判断书籍信息是热门分类还是搜索信息
      this.nowUrl = this.$common.searchResult.nowUrl;
      //当前的页码
      this.nowPage = this.$common.searchResult.nowPage;
      //搜索框的字符串,
      this.searchStr = this.$common.searchResult.searchStr;
      //总页码数
      this.totalPages = this.$common.searchResult.totalPages;
      //分类选择
      this.claNo = this.$common.searchResult.claNo;

      return;
    }

    //页面加载时就要获取 热门分类
    let result = await axios({
      nethods: "get",
      url: this.$common.classUrl
    });
    let classes = result.data;
    for (let i = 0; i < classes.length; i++) {
      classes[i].order = i;
    }
    this.classes = classes;
  },
  mounted: function() {
    //恢复滚动条位置
    console.log("before:" + this.$common.searchResult.myScrollTop);
    console.log($(".show_searchBooks"));
    $(".show_searchBooks").scrollTop(this.$common.searchResult.myScrollTop);
  },
  beforeDestroy: function() {
    //程序退出时一定要将busy置为不忙
    this.busy = false;

    //保存滚动条位置
    this.$common.searchResult.myScrollTop = $(".show_searchBooks").scrollTop();
    //保存分类信息
    this.$common.searchResult.classes = this.classes;
    //保存搜索结果的书籍信息
    this.$common.searchResult.books = this.books;
    //保存书籍总数
    this.$common.searchResult.booksNumber = this.booksNumber;
    //搜索框是否有内容
    this.$common.searchResult.isEmpty = this.isEmpty;
    //保存这是第几次改变输入的搜索字符串
    this.$common.searchResult.changeTimes = this.changeTimes;
    //加载中
    this.$common.searchResult.loading = this.loading;
    //实时更新书籍数据是否busy
    this.$common.searchResult.busy = this.busy;
    //保存当前的url，判断书籍信息是热门分类还是搜索信息
    this.$common.searchResult.nowUrl = this.nowUrl;
    //当前的页码
    this.$common.searchResult.nowPage = this.nowPage;
    //搜索框的字符串,
    this.$common.searchResult.searchStr = this.searchStr;
    //总页码数
    this.$common.searchResult.totalPages = this.totalPages;
    //分类选择
    this.$common.searchResult.claNo = this.claNo;
    //是否被销毁过
    this.$common.searchResult.beDestroyed = true;
  },
  watch: {},
  components: {
    searchBox,
    searchRemind,
    axios,
    booksResult
  }
};
</script>
