<template>
  <div class="search_remind">
      <div class="search_remind_header">
          <img class="search_remind_icon" src = "../../assets/hotLend_icon.png">
          <div class="search_remind_title">热门分类</div>
      </div>
      <div class="search_remind_content">
          <div class="search_remind_class" v-for="item in classes" v-bind:key="item.key">
            <div class="class_title">{{item.className}}</div>
            <div class="class_devideLine" v-show="!isLast(item.order)"></div>
          </div>
      </div>
  </div>
</template>
<script>
export default {
  props: ["classes"],
  data: function() {
    return {};
  },
  methods: {
    isLast: function(order) {
      if (order === this.classes.length - 1) {
        return true;
      }
    }
  }
};
</script>
<style scoped>
div {
  border: 0px solid black;
  box-sizing: border-box;
}
.search_remind {
  width: 325px;
}
.search_remind_header {
  display: flex;
  height: 20px;
  width: 100%;
}
.search_remind_content {
  margin-top: 16px;
  margin-left: 29px;
  width: 296px;
}
.search_remind_icon {
  width: 18px;
  height: 18px;
}
.search_remind_title {
  margin-left: 11px;
  height: 20px;
  color: #5fc998;
  font-size: 15px;
  font-weight: bold;
  letter-spacing: 2px;
  line-height: 20px;
}
.class_title {
  font-size: 15px;
  height: 22px;
  color: #555555;
  letter-spacing: 2px;
}
.class_devideLine {
  margin-top: 12px;
  margin-bottom: 12px;
  border-top: 1px solid #dcdcdc;
}
</style>
