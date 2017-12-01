<template>
    <div class="parent_container">
        <div class="book_scroller">
            <div class="one_book" v-for="book in myBooks" @click="gotoBookDetail(book)" :key="book.key">
                <img class="book_img" v-bind:src="book.imgUrl">
                <div class="book_name" >{{book.bookName}}</div>
                <div class="book_bottom_mask" v-show="book.warn">即将到期</div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  props: ["books"],
  data: function() {
    return {
      myBooks: []
    };
  },
  methods: {
    gotoBookDetail: function(book) {
      const _this = this;
      if (book.name === "查看更多") {
        console.log("跳转至查看更多界面吧!");
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
      //只取前五本书
      let cover_books = [];
      if (this.books.length >= 5) {
        cover_books = this.books.slice(0, 5);
      } else {
        cover_books = this.books.slice(0, this.books.length);
      }
      console.log(cover_books.length);
      for (let i = 0; i < cover_books.length; i++) {
        cover_books[i].imgUrl = await this.$common.getbookImgUrl(
          cover_books[i].bookId
        );
        //如果要监听myBooks的变化，则需要从引用上改变，而不是改变this.books
        this.myBooks = [];
        this.myBooks = cover_books;
      }

      //如果书籍总数大于五本，为cover_books数组添加上查看更多的按键
      if (this.books.length > 5) {
        cover_books[cover_books.length] = {
          name: "查看更多"
        };
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
  height: 240px;
}
.one_book {
  height: 225px;
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
  height: 50px;
  text-overflow: ellipsis;
}
.parent_container {
  height: 225px;
  overflow: hidden;
}
</style>
