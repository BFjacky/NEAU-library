<template>
  <div class="booksResult">
    <div class="book_number" >{{title}}</div>
      <div class="books_item" v-for="book in books" v-bind:key="book.number" v-on:click="gotoBookDetail(book)">
          <div class="book_title">{{book.bookName}}</div>
          <div class="book_detail">{{book.borrowDate}}&nbsp&nbsp&nbsp&nbsp{{book.returnDate}}</div>
          <div class="book_detail">{{book.bookPlace}}</div>
          <div class="book_devide_line"></div>
      </div>
  </div>
</template>
<script>
export default {
  data: function() {
    return {
      books: [],
      number: 0,
      title: ""
    };
  },
  methods: {
    gotoBookDetail: function(book) {
      this.$router.push({
        name: "bookDetail",
        params: {
          book: book
        }
      });
    }
  },
  created: function() {
    //回退路由this.$route.params 为 {};使用以前保存的数据
    if (this.$route.params.books == undefined) {
      this.books = this.$common.bookMorePageInfo.books;
      this.title = this.$common.bookMorePageInfo.title;
      this.number = this.$common.bookMorePageInfo.number;
      return;
    }

    this.books = this.$route.params.books;
    this.number = this.books.length;
    if (this.books[0].returnDate != "") {
      this.title = "历史借阅信息";
    } else {
      this.title = "当前借阅信息";
    }
  },
  beforeDestroy: function() {
    this.$common.bookMorePageInfo.books = this.books;
    this.$common.bookMorePageInfo.title = this.title;
    this.$common.bookMorePageInfo.number = this.number;
  }
};
</script>
<style scoped>
div {
  border: 0px solid black;
  box-sizing: border-box;
}
.booksResult {
  width: 90%;
  height: 100%;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}
.book_number {
  text-align: left;
  width: 100%;
  height: 16px;
  font-size: 16px;
  color: #cbcbcb;
  margin-top: 12px;
}
.books_item {
  position: relative;
  width: 100%;
}
.book_title {
  width: 100%;
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
  width: 100%;
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
