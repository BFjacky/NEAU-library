<template>
  <div class="booksResult">
    <div class="book_number">
      {{title}}
    </div>
    <div class="books_item" v-for="book in books" v-bind:key="book.number" v-on:click="gotoBookDetail(book)">
        <div class="book_title">{{book.bookName}}</div>
        <div class="book_detail" v-if="!isCollect">{{book.borrowDate}}&nbsp&nbsp&nbsp&nbsp{{book.returnDate}}{{book.lawBackDate}}</div>
        <div class="book_detail" v-if="isCollect">{{book.author}}</div>
        <div class="book_detail">{{book.bookPlace}}</div>
        <div class="book_devide_line"></div>
    </div>
  </div>
</template>
<script>
import $ from "jquery";
export default {
  data: function() {
    return {
      books: [],
      number: 0,
      title: "",
      //是否是我的书架
      isCollect: false
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
      if (this.title === "我的书架") {
        this.isCollect = true;
      }
      return;
    }
    this.books = this.$route.params.books;
    this.number = this.books.length;
    if (this.books[0].returnDate != undefined) {
      this.title = "历史借阅信息";
    } else if (this.books[0].lawBackDate != undefined) {
      this.title = "当前借阅信息";
    } else {
      this.title = "我的书架";
      this.isCollect = true;
    }
    //我的书架的信息与其他格式不同，格式化一下字符信息
    if (this.title === "我的书架") {
      for (let i = 0; i < this.books.length; i++) {
        this.books[i].bookName = this.books[i].title;
        this.books[i].bookPlace = this.books[i].bookPlace[0].place;
        let author = "";
        for (let j = 0; j < this.books[i].author.length; j++) {
          author += this.books[i].author[j].authorName;
          if (j !== this.books[i].author.length - 1) {
            author += " / ";
          }
        }
        this.books[i].author = author;
      }
      this.books = this.books;
    }
  },
  mounted: function() {
    //恢复滚动条位置
    $(".booksResult").scrollTop(this.$common.bookMorePageInfo.myScrollTop);
  },
  beforeDestroy: function() {
    this.$common.bookMorePageInfo.books = this.books;
    this.$common.bookMorePageInfo.title = this.title;
    this.$common.bookMorePageInfo.number = this.number;
    this.$common.bookMorePageInfo.myScrollTop = $(".booksResult").scrollTop();
  }
};
</script>
<style scoped>
div {
  border: 0px solid black;
  box-sizing: border-box;
}
.booksResult {
  margin-left: 5%;
  width: 90%;
  height: 100%;
  overflow: auto;
  position: fixed;
  top: 0px;
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
