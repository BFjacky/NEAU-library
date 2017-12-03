<template>
    <div class="parent_container">
        <div class="book_scroller">
            <div class="one_book" v-for="book in myBooks" @click="gotoBookDetail(book)" :key="book.key">
                <img class="book_img" v-bind:src="book.imgUrl">
                <div class="book_name" >{{book.bookName}}</div>
                <div class="book_bottom_mask" v-show="book.warn">即将到期</div>
                <div class="book_info" v-show="isNowBorrow">{{book.borrowDate}}</div>
                <div class="book_info" v-show="isNowBorrow">{{book.lawBackDate}}</div>
            </div>
        </div>
    </div>
</template>
<script>
//格式化：借书日字符串
const parseStr = function(str) {
  let patt1 = /借书日/g;
  let patt2 = /应还日/g;
  let patt3 = /\d\d\d\d-\d\d-\d\d/g;
  let strPrefix = str.match(patt1);
  if (strPrefix == null) {
    //如果为 应还日
    strPrefix = str.match(patt2);
  }
  strPrefix = strPrefix[0];
  let strSuffix = str.match(patt3)[0];
  return strPrefix + ": " + strSuffix;
};
export default {
  props: ["books"],
  data: function() {
    return {
      myBooks: [],
      isNowBorrow: false
    };
  },
  methods: {
    gotoBookDetail: function(book) {
      const _this = this;
      if (book.name === "查看更多") {
        this.$router.push({
          name: "bookMorePage",
          params: {
            books: _this.books
          }
        });
        return;
      }
      this.$router.push({
        name: "bookDetail",
        params: {
          book: book
        }
      });
    }
  },
  watch: {
    books: async function() {
      //判断是不是nowborrow栏目
      if (this.books[0].lawBackDate != undefined) {
        this.isNowBorrow = true;
        for (let i = 0; i < this.books.length; i++) {
          this.books[i].lawBackDate = parseStr(this.books[i].lawBackDate);
          this.books[i].borrowDate = parseStr(this.books[i].borrowDate);
        }
      }
      //只取前五本书
      let cover_books = [];
      if (this.books.length >= 5) {
        cover_books = this.books.slice(0, 5);
      } else {
        cover_books = this.books.slice(0, this.books.length);
      }
      //如果书籍总数大于五本，为cover_books数组添加上查看更多的按键
      if (this.books.length > 5) {
        cover_books[cover_books.length] = {
          name: "查看更多",
          bookId: ""
        };
      }
      for (let i = 0; i < cover_books.length; i++) {
        cover_books[i].imgUrl = await this.$common.getbookImgUrl(
          cover_books[i].bookId
        );
        //如果要监听myBooks的变化，则需要从引用上改变，而不是改变this.books
        this.myBooks = [];
        this.myBooks = cover_books;
      }
      this.myBooks = cover_books;
    }
  },
  created: async function() {}
};
</script>
<style scoped>
div {
  border: 0px solid black;
  box-sizing: border-box;
}
.book_scroller {
  display: flex;
  overflow-x: scroll;
  overflow-y: hidden;
  height: 100%;
}
.one_book {
  height: 100%;
  width: 119px;
  margin-left: 25px;
}
.book_img {
  box-sizing: border-box;
  border: 1px solid black;
  border-radius: 16px;
  width: 119px;
  height: 168px;
}
.book_bottom_mask {
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  width: 119px;
  height: 32px;
  background-color: #e95628;
  position: relative;
  bottom: 86px;
  opacity: 1;
  color: white;
  font-size: 12px;
  text-align: center;
  padding-top: 6px;
  letter-spacing: 1px;
}
.book_name {
  color: #555555;
  font-size: 12px;
  overflow: hidden;
  height:33px;
  text-overflow:ellipsis;
}
.book_info {
  color: #555555;
  font-size: 8px;
  overflow: hidden;
}
.parent_container {
  height: 240px;
  overflow: hidden;
}
</style>
