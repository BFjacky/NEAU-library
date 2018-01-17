<template>
  <div id="app">
  <transition v-bind:name="transitionName" mode="">
    <router-view class="router_view"></router-view>
  </transition>
  </div>
</template>

<script>
import $ from "jquery";
import { Indicator } from "mint-ui";
export default {
  name: "app",
  data: function() {
    return {
      isback: false,
      transitionName: "forwardMov"
    };
  },
  created: function() {
    console.log("app is created");
  },
  watch: {
    $route: function() {
      //监听每次路由的变换是是否为后退
      this.isback = this.$common.isBackUrl(this.$route.name);
      if (this.isback) {
        this.transitionName = "backMov";
      } else {
        this.transitionName = "forwardMov";
      }
      //每当路由变化时都要隐藏掉loading 组件
      this.$vux.loading.hide();
      Indicator.close();
    }
  }
};
</script>
<style>
body,
html {
  margin: 0;
  padding: 0;
}
#app {
  height: 100vh;
  width: 100vw;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  position: absolute;
}
.forwardMov-enter-active {
  animation: forwardMov-in 0.4s;
}
.forwardMov-leave-active {
  animation: forwardMov-out 0.4s;
}
@keyframes forwardMov-in {
  0% {
    /* transform: translateX(100%);  */
    opacity: 0;
  }
  100% {
    /* transform: translateX(0%); */
    opacity: 1;
  }
}
@keyframes forwardMov-out {
  0% {
    /* transform: translateX(0%); */
    opacity: 1;
  }
  100% {
    /* transform: translateX(-100%); */
    opacity: 0;
  }
}

.backMov-enter-active {
  animation: backMov-in 0.4s;
}
.backMov-leave-active {
  animation: backMov-out 0.4s;
}
@keyframes backMov-in {
  0% {
    /* transform: translateX(-100%); */
    opacity: 0;
  }
  100% {
    /* transform: translateX(0%); */
    opacity: 1;
  }
}
@keyframes backMov-out {
  0% {
    /* transform: translateX(0%); */
    opacity: 1;
  }
  100% {
    /* transform: translateX(100%); */
    opacity: 0;
  }
}
.router_view {
  position: absolute;
}
</style>
