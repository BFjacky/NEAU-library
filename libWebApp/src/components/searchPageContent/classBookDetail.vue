<template>
  <div class="classBookDetail">
        <books-result v-bind:books="books" v-bind:number="booksNumber" class="show_searchBooks"  ></books-result>
  </div>
</template>
<script>
import booksResult from "./booksResult";
import axios from "axios";

//主机地址
const host = "http://127.0.0.1:7001";

//获得分类的url
const classUrl = "/api/search/getTopLendDetail";

export default {
  props: ["clsNo"],
  data: function() {
    return {
      //保存搜索结果的书籍信息
      books: [],
      //保存书籍总数
      booksNumber: 0,
      //加载中
      loading: false
    };
  },
  components: {
    booksResult
  }
};
</script>
<style scoped>
.classBookDetail {
  width: 100%;
}
.show_searchBooks {
}
</style>
