<template>
  <!--这是搜索首页-->
  <div class="search_page">
      <div class="search_page_header"></div>
      <div class="search_page_main">
        <div class="search_title" >搜索图书馆馆藏</div>
        <search-box-only-show  class="search_box"  v-on:gotoinfo="tosearchInfo" ></search-box-only-show>
        <!--search-box class="search_box"  v-on:gotoinfo="tosearchInfo" ></search-box-->
        <div class="btn_myLib" v-on:click="gotoPersonalPage">我的图书 >></div>
        <img class="books_img" src="https://neau-lib.dyycyf.top/neau-lib/imgs/bookBackground.png">
        <img class="jser_logo" src="../../assets/JSER.png">
      </div>
      <div class="search_mask"></div>
  </div>
</template>
<script>
import searchBox from "./searchBox";
import searchBoxOnlyShow from "./searchBoxOnlyShow";
export default {
  data: function() {
    return {
      flag: "123123123"
    };
  },
  methods: {
    tosearchInfo: function() {
      //收到了点击搜索框的请求,如果是首页则跳转到搜索信息页面
      if (this.$router.history.current.name === "searchPage") {
        this.$router.push({ name: "searchResult" });
      }
    },
    gotoPersonalPage: function() {
      //跳转到个人信息页面
      this.$router.push({ name: "personalPage" });
    }
  },
  components: {
    searchBox,
    searchBoxOnlyShow
  }
};
</script>
<style scoped>
div {
  border: 0px solid black;
  box-sizing: border-box;
}
.search_title {
  z-index: 100;
  position: absolute;
  left: 50%;
  width: 90%;
  transform: translateX(-50%);
  top: 93px;
  font-size: 30px;
  font-weight: bold;
  color: white;
  letter-spacing: 2px;
}
.books_img {
  width: 160%;
  height: 58%;
  z-index: 1;
  position: absolute;
  top: 60%;
  left: 50%;
  transform: translateX(-50%);
}
.jser_logo {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 99px;
  height: 40px;
  z-index: 100;
}
.search_mask {
  height: 100%;
  width: 100%;
  background-size: 100%;
  background-image: url(../../assets/searchPage_background2.png);
  background-repeat: no-repeat;
  position: absolute;
  top: 0px;
  opacity: 1;
  z-index: 10;
}
.search_box {
  z-index: 100;
  width: 90%;
  height: 7%;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 148px;
}
.btn_myLib {
  color: #ffffff;
  z-index: 100;
  font-weight: bold;
  position: relative;
  width: 90%;
  left: 50%;
  transform: translateX(-50%);
  text-align: right;
  top: 220px;
}
.search_page {
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: #00c8ad;
  position: fixed;
  top: 0;
}
.search_page_header {
  height: 0%;
  width: 100%;
}
.search_page_main {
  position: relative;
  height: 100%;
  width: 100%;
}
</style>
