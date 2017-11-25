<template>
  <div class='search_box' v-on:click="toSearchInfoPage">
    <input class='searchInput' type = 'text' placeholder="输入书名关键字" v-model="searchStr" >
      <img class="search_icon" src="../../assets/searchSympol.png" v-on:click="doSearch"></img>
  </div>
</template>
<script>
export default {
  props: ["searchStrFromFather"],
  data: function() {
    return {
      searchStr: ""
    };
  },
  methods: {
    doSearch: function() {
      //console.log("发出了搜索事件！");
      this.$emit("search", this.searchStr);
    },
    //从首页展示跳转到搜索信息展示区
    toSearchInfoPage: function() {
      //console.log("发出了跳转事件！");
      this.$emit("gotoinfo");
    }
  },
  watch: {
    searchStr: function() {
      this.doSearch();
    }
  },
  created: function() {
    this.searchStr = this.searchStrFromFather;
  }
};
</script>
<style scoped>
.search_box {
  padding: 0;
  height: 50px;
  width: 90%;
}
.search_icon {
  height: 30px;
  width: 30px;
  transform: translateY(-40px);
  margin-left: 88%;
}

.searchInput {
  margin: 0;
  padding-left: 20px;
  font-size: 15px;
  height: 50px;
  width: 100%;
  border: 0px solid black;
  box-sizing: border-box;
  border-radius: 10px;
  background-color: white;
  box-shadow: 0px 8px 15px rgba(6, 113, 91, 0.2);
  outline: none;
}
</style>
