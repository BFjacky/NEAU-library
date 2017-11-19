<template>
  <div class="personalPage">
     <div class="one_scroller">
         <h1 class="scroller_h1">正在阅读5本书</h1>
         <books-scroller class="books_scroller" v-bind:books="books"></books-scroller>
     </div>
     <div class="one_scroller">
         <h1 class="scroller_h1">正在阅读5本书</h1>
         <books-scroller class="books_scroller" v-bind:books="books"></books-scroller>
     </div>
     <div class="one_scroller">
         <h1 class="scroller_h1">正在阅读5本书</h1>
         <books-scroller class="books_scroller" v-bind:books="books"></books-scroller>
     </div>
  </div>
</template>
<script>
import axios from "axios";
import booksScroller from "./booksScroller";

//主机地址
const host = "http://127.0.0.1:7001";

//获取当前借阅的url
const nowBorrow = "/api/fetch/nowBorrow";
//更新全部个人信息的url
const updateAll = "/api/update/all";

export default {
  components: {
    booksScroller
  },
  data: function() {
    return {
      books: [{}, {}, {}, {}, {}]
    };
  },
  created: async function() {}
};
</script>
<style scoped>
div {
  border: 1px solid black;
  box-sizing: border-box;
}
.personalPage {
  position: relative;
  top: 12px;
}
.one_scroller {
  margin-bottom: 28px;
}
.scroller_h1 {
  font-size: 30px;
  padding-left: 25px;
  margin: 0;
  letter-spacing: 3px;
}
.books_scroller {
  margin-top: 28px;
}
</style>
