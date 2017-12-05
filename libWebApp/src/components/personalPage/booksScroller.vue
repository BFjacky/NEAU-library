
<template>
    <div class="parent_container">
        <div class="book_scroller">
            <div class="one_book" v-for="book in myBooks" @click="gotoBookDetail(book)" :key="book.key">
                <div class="book_cover" v-show="book.isMoreCover">
                  <div class="cover_title">更多</div>
                  <div class="cover_icon">+</div>
                </div>
                <img class="book_img" v-bind:src="book.imgUrl" v-show="!book.isMoreCover">
                <div class="book_name"  v-show="!book.isMoreCover">{{book.bookName}}</div>
                 <div class="book_info" v-show="isNowBorrow" >{{book.borrowDate}}</div>
                <div class="book_info" v-show="isNowBorrow" >{{book.lawBackDate}}</div>
                <div class="book_bottom_mask" v-show="book.warn" >即将到期</div>
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
          bookId: "",
          isMoreCover: true
        };
      }
      /**@augments
       * 获得cover_books对应的书籍detail
       * 1.将booksId 打包成数组
       * 2.调用common中的方法getManyImgUrl，获得包含着imgurl的数组
       * 3.顺序对应，将cover_books和imgs数组对应赋值
       */
      console.log("开始取出封面操作");
      let bookIds = [];
      for (let i = 0; i < cover_books.length; i++) {
        let patt = /\d+/g;
        //刨除更多页面
        if (cover_books[i].name !== "查看更多") {
          bookIds[i] = cover_books[i].bookId.match(patt)[0];
        }
      }
      console.log("获得了封面书籍Id：", bookIds);

      let manyBooks = [];
      manyBooks = await this.$common.getmanyImgUrl(bookIds);
      console.log("获得了封面书籍详细信息", manyBooks);

      for (let i = 0; i < cover_books.length; i++) {
        //刨除更多页面
        if (cover_books[i].name !== "查看更多") {
          cover_books[i].imgUrl = manyBooks[i].imgurl;
        }
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
  padding-top: 8px;
}
.one_book {
  height: 100%;
  width: 119px;
  margin-left: 25px;
}
.book_img {
  box-sizing: border-box;
  border-radius: 16px;
  width: 119px;
  height: 168px;
  box-shadow: 0px 7.5px 15px rgba(219, 219, 219, 0.5);
}
.book_cover {
  box-sizing: border-box;
  border-radius: 16px;
  width: 119px;
  height: 168px;
  box-shadow: 0px 7.5px 15px rgba(219, 219, 219, 0.5);
  background-color: #e8e8e8;
}
.cover_title {
  color: #aaaaaa;
  font-size: 20px;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  width: 40px;
  height: 26px;
  padding-top: 55px;
}
.cover_icon {
  color: #aaaaaa;
  font-size: 24px;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 26px;
  padding-top: 36px;
  text-align: center;
}
.book_bottom_mask {
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  width: 119px;
  height: 32px;
  background-color: #e95628;
  position: relative;
  bottom: 101px;
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
  line-height: 16px;
  height: 33px;
  text-overflow: ellipsis;
}
.book_info {
  color: #555555;
  font-size: 11px;
  overflow: hidden;
}
.parent_container {
  height: 248px;
  overflow: hidden;
}
</style>

