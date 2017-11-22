<template>
  <div class="personalPage">
     <div class="one_scroller">
         <h1 class="scroller_h1">正在阅读5本书</h1>
         <books-scroller class="books_scroller" v-bind:books="nowBorrowBooks"></books-scroller>
     </div>
     <div class="one_scroller">
         <h1 class="scroller_h1">正在阅读5本书</h1>
         <books-scroller class="books_scroller" v-bind:books="histroyBooks"></books-scroller>
     </div>
     <div class="one_scroller">
         <h1 class="scroller_h1">正在阅读5本书</h1>
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
      nowBorrowBooks: [],
      histroyBooks: [],
      collectBooks: []
    };
  },
  created: async function() {
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
      }
    });

    //更新失败
    if (!update_res.data.success) {
      console.log("更新失败:", update_res.data.message);
      return;
    }

    /**@augments
     * 更新成功：
     * 获取当前节约
     * 获取历史借阅
     */
    let nowBorrow_res = await axios({
      method: "get",
      url: this.$common.nowBorrow,
      params: {
        stuId: this.$common.person.stuId
      }
    });
    let hisBorrow_res = await axios({
      method: "get",
      url: this.$common.hisBorrow,
      params: {
        stuId: this.$common.person.stuId
      }
    });
    
    this.nowBorrowBooks = nowBorrow_res.data;
    this.histroyBooks = hisBorrow_res.data;
  }
};
</script>
<style scoped>
div {
  border: 1px solid #000000;
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
.books_scroller {
  margin-top: 28px;
}
</style>
