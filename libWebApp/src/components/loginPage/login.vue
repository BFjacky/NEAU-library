<template>
  <!--这是搜索首页-->
  <div class="search_page">
      <div class="search_page_header"></div>
      <div class="search_page_main">
        <div class="search_title" >登陆图书馆</div>
        <input type='text' class="login_input" placeholder=" 学号">
        <input type='password' class="login_input" placeholder="密码(默认为身份证后6位)">
        <input type='text' class="login_input" placeholder="姓名">
        <img class="books_img" src="../../assets/bookBackground.png">
        <img class="jser_logo" src="../../assets/JSER.png">
      </div>
      <div class="search_mask"></div>
  </div>
</template>
<script>
export default {
  data: function() {
    return {};
  },
  methods: {},
  components: {}
};
</script>
<style scoped>
div {
  border: 0px solid black;
  box-sizing: border-box;
}
.search_title {
  z-index: 100;
  position: relative;
  text-align: center;
  left: 50%;
  width: 90%;
  transform: translateX(-50%);
  top: 93px;
  font-size: 30px;
  font-weight: bold;
  color: white;
  letter-spacing: 2px;
}
.login_input {
  position: relative;
  border: 1px solid greenyellow;
  background-color: rgba(f, f, f, 0.5);
  border-radius: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 70%;
  height: 6%;
  z-index: 100;
  top: 100px;
  margin-top:10%;
  outline: none;
  font-size:130%;
  padding-left:10px;
  padding-right:10px;
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
.search_page {
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: #00c8ad;
}
.search_page_header {
  height: 6.8%;
  width: 100%;
}
.search_page_main {
  position: relative;
  height: 93.2%;
  width: 100%;
}
</style>
