<template>
  <!--这是搜索首页-->
  <div class="search_page">
      <div class="search_page_header"></div>
      <div class="search_page_main">
        <input type='text' class="login_input" placeholder="学号" v-model="account">
        <input type='password' class="login_input" placeholder="密码(默认为身份证后6位)" v-model="password">
        <input type='text' class="login_input" placeholder="姓名" v-model="name">
          <div class="search_title" v-on:click="confirm">确认绑定</div>
        <img class="books_img" src="../../assets/bookBackground.png">
        <img class="jser_logo" src="../../assets/JSER.png">
      </div>
      <div class="search_mask"></div>
  </div>
</template>
<script>
const axios = require("axios");
//toast_time 显示时间
const toast_time = 1000;

export default {
  data: function() {
    return {
      account: "",
      password: "",
      name: ""
    };
  },
  created: async function() {
    //页面初建时帮助用户自助登陆
    /**@augments
     * ?????如何在前端页面接受 dnxn的token，然后由前端转发给后端
     */
    this.$vux.loading.show({
      text: "自助登陆中..."
    });
    let login_res = await axios({
      url: this.$common.checkUserUrl,
      method: "post",
      withCredentials: true,
      data: {}
    });
    this.$vux.loading.hide();
    console.log("checkUser_result:" + login_res.data.userLogin);
    if (login_res.data.userLogin) {
      this.$vux.toast.show({
        text: "登陆成功",
        time: toast_time
      });
      setTimeout(() => {
        this.$router.push({ name: "searchPage" });
      }, toast_time);
    } else {
      this.$vux.toast.show({
        text: "登陆失败,请重新绑定信息",
        time: 2000,
        type: "warn"
      });
    }
  },
  methods: {
    confirm: async function() {
      console.log(this.account, this.password, this.name);
      //loading 框显示出来
      this.$vux.loading.show({
        text: "正在绑定",
        isShowMask: true
      });
      let result = await axios({
        method: "post",
        data: {
          stuId: this.account,
          pswd: this.password,
          name: this.name
        },
        withCredentials: true,
        url: this.$common.rebindUrl
      });
      if (result.data.success) {
        //绑定成功
        this.$vux.loading.hide();
        this.$vux.toast.show({
          text: "绑定成功",
          type: "success",
          isShowMask: true,
          time: toast_time
        });
        //绑定成功，主动跳转至searchPage主页面
        setTimeout(() => {
          this.$router.push({ name: "searchPage" });
        }, toast_time);
      } else {
        //绑定失败
        this.$vux.loading.hide();
        this.$vux.toast.show({
          text: result.data.err.msg,
          type: "cancel",
          isShowMask: true,
          time: toast_time
        });
      }
      console.log(result.data);
    }
  },
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
  text-align: right;
  left: 50%;
  width: 60%;
  transform: translateX(-50%);
  top: 7%;
  font-size: 120%;
  font-weight: bold;
  color: white;
  letter-spacing: 2px;
}
input::-webkit-input-placeholder,
textarea::-webkit-input-placeholder {
  /* WebKit*/
  color: #efefef;
  font-size: 90%;
}
.login_input {
  position: relative;
  border-width: 0px;
  border-bottom: 1px solid white;
  background-color: transparent;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 6%;
  z-index: 100;
  margin-top: 7%;
  outline: none;
  font-size: 120%;
  padding-left: 0px;
  padding-right: 0px;
  color: #ffffff;
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
