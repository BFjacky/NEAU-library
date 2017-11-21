<template>
    <div class="parent_container">
        <div class="book_scroller">
            <div class="one_book" v-for="book in books" :key="book.key">
                <img class="book_img" v-bind:src="book.imgUrl">
                <span class="book_name" >{{book.title}}</span>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  props: ["books"],
  created: function() {},
  watch: {
    books: function() {
      console.log(this.books);
    }
  }
};
</script>
<style scoped>
div {
  border: 0px solid black;
  box-sizing: border-box;
}
.book_scroller {
  display: flex;
  overflow-x: scroll;
  overflow-y: hidden;
  height: 240px;
}
.one_book {
  height: 225px;
  width: 119px;
  margin-left: 25px;
}
.book_img {
  width: 119px;
  height: 168px;
}
.book_name {
  margin-top: 10px;
  color: #555555;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.parent_container {
  height: 225px;
  overflow: hidden;
}
</style>
