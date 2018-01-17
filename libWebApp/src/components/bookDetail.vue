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
    <div class="holding_place" v-show="book.summary!=''">
      <div class="holding_title">
        <span class="info_title_h2">内容简介</span>
      </div>
      <div class="holding_info">
        <hr class="devide_line">
        <span class="info">{{book.summary}}</span><br>
      </div>
      <hr class="devide_line_last">
    </div>
    <div class="holding_place" v-show="book.catalog!=''">
      <div class="holding_title">
        <span class="info_title_h2">章节介绍</span>
      </div>
      <div class="holding_info">
        <hr class="devide_line">
        <span class="info">{{book.catalog}}</span><br>
      </div>
      <hr class="devide_line_last">
    </div>
    <div class="holding_place" v-show="book.pages!=''&&book.price!=''">
      <div class="holding_title">
        <span class="info_title_h2" >书本信息</span>
      </div>
      <div class="holding_info">
        <hr class="devide_line">
        <span class="info">页数:{{book.pages}}</span><br>
        <span class="info">价格:{{book.price}}</span><br>
      </div>
      <hr class="devide_line_last">
    </div>
    <div class="holding_place">
      <div class="holding_title">
        <span class="info_title_h2">馆藏信息</span>
      </div>
      <div class="holding_info" v-for="guancang in book.guancang" :key="guancang.key">
        <hr class="devide_line">
        <!-- <span class="info_title">{{guancang.title}}</span><br> -->
        <span class="info">{{guancang.place}}</span><br>
        <span class="info">{{guancang.ableBorrow}}</span>
      </div>
        <hr class="devide_line_last">
    </div>
    <x-button  type="primary" @click.native="collectAction" class="button_1" v-show="!hasCollected">收&nbsp藏</x-button>
    <x-button  type="warn" @click.native="cancelCollectAction" class="button_1" v-show="hasCollected">取消收藏</x-button>
  </div>
</template>
<script>
import axios from "axios";
import { XButton } from "vux";
export default {
  data: function() {
    return {
      book: {},
      hasCollected: false
    };
  },
  components: {
    XButton: XButton
  },
  methods: {
    collectAction: async function() {
      const _this = this;
      this.$vux.loading.show({
        text: "客官稍等...",
        time: 10000000
      });
      let collectResult = await axios({
        url: _this.$common.collectUrl,
        method: "POST",
        withCredentials: true,
        data: {
          bookId: _this.book.bookId
        }
      });
      this.$vux.loading.hide();
      if (!collectResult.data.success) {
        this.$vux.toast.show({
          text: collectResult.data.message,
          type: "warn",
          time: 1000
        });
        return;
      }
      this.hasCollected = true;
      this.$vux.toast.hide();
      this.$vux.toast.show({
        text: collectResult.data.message,
        time: 1000
      });
    },
    cancelCollectAction: async function() {
      const _this = this;
      this.$vux.loading.show({
        text: "客官稍等...",
        time: 10000000
      });
      let collectResult = await axios({
        url: _this.$common.cancelCollectUrl,
        method: "POST",
        withCredentials: true,
        data: {
          bookId: _this.book.bookId
        }
      });
      this.$vux.loading.hide();
      if (!collectResult.data.success) {
        this.$vux.toast.show({
          text: collectResult.data.message,
          type: "warn",
          time: 1000
        });
        return;
      }

      this.hasCollected = false;
      this.$vux.toast.hide();
      this.$vux.toast.show({
        text: collectResult.data.message,
        time: 1000
      });
    }
  },
  created: async function() {
    //显示加载中提示
    this.$vux.loading.show({
      text: "搬运数据中...",
      time: 10000000
    });
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
    book.imgUrl = res.data[0].imgurl;
    book.catalog = res.data[0].catalog;
    book.summary = res.data[0].summary;
    book.pages = res.data[0].pages;
    book.price = res.data[0].price;
    console.log(book.catalog);
    book.author_intro = res.data[0].author_intro;
    book.guancang = [];
    for (let i = 0; i < res.data.length - 1; i++) {
      book.guancang[i] = res.data[i + 1];
    }
    //检查一下图片url的结果
    console.log(book.imgUrl);
    book.imgUrl = await this.$common.checkCover(book.imgUrl);

    //检查该用户是否已经收藏了该书籍
    let isCollectRes = await axios({
      method: "post",
      url: this.$common.isCollectUrl,
      withCredentials: true,
      data: {
        bookId: bookId
      }
    });

    if (isCollectRes.data.success) {
      //请求成功
      if (isCollectRes.data.isCollect) {
        this.hasCollected = true;
      } else {
        this.hasCollected = false;
      }
    }
    this.book = book;
    this.book.bookId = bookId;
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
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  position: fixed;
  overflow: auto;
  top: 0px;
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
  color: #95989a;
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
  font-weight: bold;
  color: #000000;
  line-height: 24px;
  /* font-size: 18px;
  color: #95989a; */
}
.button_1 {
  font-size: 16px;
  margin-left: 16px;
  margin-right: 16px;
  margin-top: 16px;
  margin-bottom: 32px;
}
</style>
