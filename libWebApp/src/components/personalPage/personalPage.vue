<template>
  <div class="personalPage">
     <div class="one_scroller">
         <h1 class="scroller_h1" v-show="nowBorrowBooks.length>=0">正在阅读的{{nowBorrowBooks.length}}本书</h1>
         <!--h1 class="scroller_h2" v-show="nowBorrowBooks.length===0">没有正在阅读的书籍哦</h1-->
         <div class="btn_text" v-on:click="tryRenew" v-show="warn_numbers>0">你有{{warn_numbers}}本书即将到期,点我一键续借 > > ></div> 
         <books-scroller class="books_scroller" v-bind:books="nowBorrowBooks" ></books-scroller>
     </div>
     <div class="one_scroller">
         <h1 class="scroller_h1">曾经借阅的{{histroyBooks.length}}本书</h1>
         <books-scroller class="books_scroller" v-bind:books="histroyBooks"></books-scroller>
     </div>
     <div class="one_scroller">
         <h1 class="scroller_h1">已经收藏的{{collectBooks.length}}本书</h1>
         <books-scroller class="books_scroller" v-bind:books="collectBooks"></books-scroller>
     </div>
  </div>
</template>
<script>
import axios from "axios";
import booksScroller from "./booksScroller";
export default {
  components: {
    booksScroller
  },
  data: function() {
    return {
      //即将到期的图书数量
      warn_numbers: 0,

      nowBorrowBooks: [],
      histroyBooks: [],
      collectBooks: []
    };
  },
  methods: {
    tryRenew: async function() {
      this.$vux.loading.show({
        text: "正在续借...",
        time: 10000000
      });
      let res = await axios({
        method: "post",
        url: this.$common.renewUrl,
        data: {
          stuId: this.$common.person.stuId
        },
        withCredentials: true
      });
      this.$vux.loading.hide();

      //获得续借成功的数量
      let sum_success = 0;
      for (let i = 0; i < res.length; i++) {
        if (res[i].success) {
          sum_success++;
        }
      }

      if (sum_success >= 1) {
        this.$vux.toast.show({
          text: sum_success + "本书续借成功"
        });
      } else {
        this.$vux.toast.show({
          text: "续借失败",
          type: "warn"
        });
      }
    }
  },
  mounted: async function() {
    //每次返回到personalPage页面都去获取最新数据!
    // if (!this.$common.personalPage.isPast) {
    //   this.histroyBooks = this.$common.personalPage.histroyBooks;
    //   this.nowBorrowBooks = this.$common.personalPage.nowBorrowBooks;
    //   this.collectBooks = this.$common.personalPage.collectBooks;
    //   return;
    // }
    //弹出加载框
    this.$vux.loading.show({
      text: "搬运数据中...",
      time: 10000000
    });

    let self = this;
    /**@augments
     * 发出更新指令
     * 获取最新信息
     */

    let update_res = await axios({
      method: "post",
      url: this.$common.updateAll,
      data: {
        stuId: this.$common.person.stuId,
        pswd: this.$common.person.pswd
      },
      withCredentials: true
    });

    //更新失败
    if (!update_res.data.success) {
      console.log("更新失败:", update_res.data.message);
      this.$vux.loading.hide();
      return;
    }

    /**@augment's
     * 更新成功：
     * 获取当前节约
     * 获取历史借阅
     */
    let nowBorrow_res = await axios({
      method: "post",
      url: this.$common.nowBorrow,
      data: {},
      withCredentials: true
    });
    let hisBorrow_res = await axios({
      method: "post",
      url: this.$common.hisBorrow,
      data: {},
      withCredentials: true
    });
    let nowCollect_res = await axios({
      method: "post",
      url: this.$common.nowCollect,
      data: {},
      withCredentials: true
    });
    this.$vux.loading.hide();
    //获得即将到期的图书数量
    for (let i = 0; i < nowBorrow_res.data.length; i++) {
      //将归还时间转换为毫秒数
      let patt = /\d\d\d\d-\d\d-\d\d/g;
      let time = nowBorrow_res.data[i].lawBackDate.match(patt)[0];
      time = time + " 00:00:00";
      time = new Date(time).getTime();
      //获取当前时间
      let now = new Date().getTime();
      //计算时间差
      let bewteen = (time - now) / 1000 / 60 / 60 / 24;
      console.log(bewteen);
      //小于规定时间,列入提醒名单
      if (bewteen <= this.$common.warn_days) {
        this.warn_numbers++;
        nowBorrow_res.data[i].warn = true;
      } else {
        nowBorrow_res.data[i].warn = false;
      }
    }
    this.nowBorrowBooks = nowBorrow_res.data;
    this.histroyBooks = hisBorrow_res.data;
    this.collectBooks = nowCollect_res.data;
  },

  beforeDestroy: function() {
    const _this = this;
    this.$common.personalPage.histroyBooks = this.histroyBooks;
    this.$common.personalPage.nowBorrowBooks = this.nowBorrowBooks;
    this.$common.personalPage.collectBooks = this.collectBooks;
    this.$common.personalPage.isPast = false;
    setTimeout(() => {
      _this.$common.personalPage.isPast = true;
    }, _this.$common.personalPage.pastTime);
  }
};
</script>
<style scoped>
div {
  border: 0px solid #000000;
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
.scroller_h2 {
  font-size: 30px;
  padding-left: 25px;
  margin: 0;
  letter-spacing: 3px;
}
.btn_text {
  color: #e95628;
  font-size: 12px;
  padding-left: 25px;
  margin-top: 15px;
}
.books_scroller {
  margin-top: 20px;
}
</style>
