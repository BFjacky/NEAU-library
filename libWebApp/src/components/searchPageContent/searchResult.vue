<template>
<!--带有展现 搜索结果 热门分类 的搜索界面-->
  <div class="search_result">
      <search-box class="search_box" v-on:search="doSearch"></search-box>
      <search-remind class="search_remind" v-bind:classes="classes" v-show="isEmpty"></search-remind>
      <books-result v-bind:books="books" v-bind:number="booksNumber" class="show_searchBooks"  v-show="!isEmpty"></books-result>
  </div>
</template>
<script>
import searchBox from "./searchBox";
import searchRemind from "./searchRemind";
import booksResult from "./booksResult";
import axios from "axios";
//主机地址
const host = "http://127.0.0.1:7001";

//获得分类的url
const classUrl = "/api/search/getTopLendClass";

//搜索书籍的url
const searchBookUrl = "/api/search/getSearchRes";

//搜索书籍时的页码
let nowPage = 1;

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
      loading: false
    };
  },
  methods: {
    //接受了搜索事件
    doSearch: async function(searchStr) {
      console.log(this.$vux);
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
        url: host + searchBookUrl,
        params: {
          word: searchStr,
          type: "02",
          page: nowPage
        }
      });

      if (changeTimes !== this.changeTimes) {
        return;
      }

      //搜索结果总页数
      let totalPages = res.data[1];

      //爬取最后一页的书有多少本
      let lastPage = await axios({
        method: "get",
        url: host + searchBookUrl,
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

      if (this.loading) {
        this.loading = false;
        this.$vux.loading.hide();
      }
      //爬取其他页码的搜索信息
      // for (let i = 1; i <= totalPages; i++) {
      //   let res = await axios({
      //     method: "get",
      //     url: host + searchBookUrl,
      //     params: {
      //       word: searchStr,
      //       type: "02",
      //       page: i
      //     }
      //   });
      //   this.books = this.books.concat(res.data[0]);
      // }
    }
  },
  created: async function() {
    //页面加载时就要获取 热门分类
    let result = await axios({
      nethods: "get",
      url: host + classUrl
    });
    let classes = result.data;
    for (let i = 0; i < classes.length; i++) {
      classes[i].order = i;
    }
    this.classes = classes;
  },
  components: {
    searchBox,
    searchRemind,
    axios,
    booksResult
  }
};
</script>
<style scoped>
div {
  border: 0px solid black;
  box-sizing: border-box;
}
.search_result {
  height: 100%;
  width: 100%;
  position: relative;
}
.search_result_header {
}
.search_result_main {
}
.search_box {
  position: relative;
  margin-top: 20px;
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
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}
</style>
