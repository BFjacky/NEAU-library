<template>
    <div class="parent_container">
        <div class="book_scroller">
            <div class="one_book" v-for="book in myBooks" :key="book.key">
                <img class="book_img" v-bind:src="book.imgUrl">
                <div class="book_bottom_mask" v-show="book.warn">即将到期</div>
                <span class="book_name" >{{book.bookName}}</span>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  props: ["books"],
  data: function() {
    return {
      myBooks: []
    };
  },
  watch: {
    books: async function() {
      for (let i = 0; i < this.books.length; i++) {
        this.books[i].imgUrl = await this.$common.getbookImgUrl(
          this.books[i].bookId
        );
        //如果要监听myBooks的变化，则需要从引用上改变，而不是改变this.books
        this.myBooks = [];
        this.myBooks = this.books;
      }
      this.myBooks = this.books;
    }
  },
  created: async function() {}
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
  box-sizing: border-box;
  border: 1px solid black;
  border-radius: 20px;
  width: 119px;
  height: 168px;
}
.book_bottom_mask {
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  width: 119px;
  height: 32px;
  background-color: #e95628;
  position: relative;
  bottom: 36px;
  opacity: 1;
  color: white;
  font-size: 12px;
  text-align: center;
  padding-top: 6px;
  letter-spacing: 1px;
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
