<template>
  <div id="app">
  <transition name="bounce">
    <router-view/>
  </transition>
  </div>
</template>

<script>
export default {
  name: "app",
  watch: {
    $route: function() {
      //每当路由变化时都要隐藏掉loading 组件
      this.$vux.loading.hide();
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
}
.bounce-enter-active {
  animation: bounce-in 0.2s;
}
.bounce-leave-active {
  animation: bounce-out 0.2s;
}
@keyframes bounce-in {
  0% {
    transform: translateX(100%);
    opacity: 0;
  }
  50% {
    transform: translateX(50%);
    opacity: 0.5;
  }
  100% {
    transform: translateX(0%);
    opacity: 1;
  }
}
@keyframes bounce-out {
  0% {
    transform: translateX(0%);
    opacity: 1;
  }
  50% {
    transform: translateX(-50%);
    opacity: 0.5;
  }
  100% {
    transform: translateX(-100%);
    opacity: 0;
  }
}
</style>
