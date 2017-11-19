<template>
  <div class="booksResult">
    <div class="book_number" >共搜索到{{number}}本馆藏</div>
      <div class="books_item" v-for="book in books" v-bind:key="book.number" v-on:click="gotoBookDetail(book)">
          <div class="book_title">{{book.bookName}}</div>
          <div class="book_detail">{{book.author}}{{book.holding}}</div>
          <img class="moreInfo_icon" src="../../assets/asset1.png">
          <div class="book_devide_line"></div>
      </div>
  </div>
</template>
<script>
export default {
  props: ["books", "number"],
  methods: {
    gotoBookDetail: function(book) {
      this.$router.push({
        name: "bookDetail",
        params: {
          book: book
        }
      });
    }
  }
};
</script>
<style scoped>
div {
  border: 0px solid black;
  box-sizing: border-box;
}
.booksResult {
  width: 325px;
}
.book_number {
  text-align: right;
  width: 325px;
  height: 16px;
  font-size: 12px;
  color: #cbcbcb;
  margin-top: 12px;
}
.books_item {
  position: relative;
  width: 100%;
}
.book_title {
  width: 283px;
  height: 28.5px;
  font-size: 20px;
  line-height: 28.5px;
  color: black;
  margin-top: 12px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.book_detail {
  margin-top: 2px;
  width: 283px;
  height: 34px;
  font-size: 12px;
  padding: 0;
  color: #aaaaaa;
  text-overflow: ellipsis;
  overflow: hidden;
}
.moreInfo_icon {
  position: absolute;
  right: 12px;
  top: 21px;
}
.book_devide_line {
  width: 100%;
  margin-top: 12px;
  border-top: 1px solid #dcdcdc;
}
</style>
