<template>
  <div class="book_detail">
    <div class="book_title">{{book.bookName}}</div>
    <div class="book_content">
        <img v-bind:src="book.imgUrl" class="book_icon"></img>
        <div class="book_author">
          责任者&nbsp:&nbsp<span class="info" v-for="author in book.author" v-bind:key="author.key">{{author.authorName}}&nbsp&nbsp</span>
          <br>
          <span class="info">{{book.info}}</span>
          <br>
           <span class="info">{{book.ISBN}}</span>
        </div>
    </div>
    <div class="holding_place">
      <div class="holding_title">
        <span class="info_title_h2">馆藏信息</span>
      </div>
      <div class="holding_info" v-for="guancang in book.guancang" :key="guancang.key">
        <hr class="devide_line">
        <span class="info_title">{{guancang.title}}</span><br>
        <span class="info">{{guancang.place}}</span><br>
        <span class="info">{{guancang.ableBorrow}}</span>
      </div>
        <hr class="devide_line_last">
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data: function() {
    return {
      book: {}
    };
  },
  created: async function() {
    //显示加载中提示
    this.$vux.loading.show({
      text: "搬运数据中...",
      time: 10000000
    });
    console.log(this.$route.params);
    let bookId = this.$route.params.book.bookId;

    //从字符串中提取出bookId
    let patt = /[0-9]{10}$/;
    bookId = patt.exec(bookId)[0];

    let res = await axios({
      method: "get",
      url: this.$common.bookDetailUrl,
      params: {
        bookId: bookId
      }
    });
    let book = {};
    book.bookName = res.data[0].title;
    book.author = res.data[0].author;
    book.info = res.data[0].info;
    book.ISBN = res.data[0].ISBN;
    book.guancang = [];
    for (let i = 0; i < res.data.length - 1; i++) {
      book.guancang[i] = res.data[i + 1];
    }
    book.imgUrl = this.$route.params.book.imgUrl;
    //检查一下图片url的结果
    book.imgUrl = await this.$common.checkCover(book.imgUrl);

    this.book = book;
    //停止加载中提示
    this.$vux.loading.hide();
  }
};
</script>
<style scoped>
div {
  border: 0px solid black;
  box-sizing: border-box;
}
.book_detail {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.book_title {
  flex-grow: 1;
  margin-top: 16px;
  margin-left: 16px;
  margin-right: 16px;
  font-size: 20px;
  font-weight: bold;
}
.book_content {
  display: flex;
  flex-grow: 1;
  margin-top: 20px;
  margin-left: 16px;
  margin-right: 16px;
}
.book_icon {
  border: 0px solid black;
  width: 70px;
  height: 98px;
}
.book_author {
  margin-left: 32px;
  font-size: 12px;
  color: #95989a;
  line-height: 24px;
}
.holding_place {
  display: flex;
  justify-content: flex-start;
  width: 100%;
  margin-top: 20px;
  flex-wrap: wrap;
}
.holding_title {
  display: flex;
  margin-left: 16px;
  width: 100%;
}
.holding_info {
  margin-left: 16px;
  width: 100%;
  flex-grow: 1;
  margin-right: 16px;
}
.info_title {
  font-size: 18px;
  font-weight: bold;
  color: #000000;
  line-height: 24px;
}
.info {
  font-size: 12px;
  color: #95989a;
  line-height: 24px;
}
.devide_line {
  border: 1px solid #dcdcdc;
}
.devide_line_last {
  border: 1px solid #dcdcdc;
  margin-left: 16px;
  width: 100%;
  margin-right: 16px;
}
.info_title_h2 {
  font-size: 18px;
  color: #95989a;
}
</style>
