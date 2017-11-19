import Vue from 'vue'
import Router from 'vue-router'
import searchResult from '@/components/searchPageContent/searchResult'
import searchPage from '@/components/searchPageContent/searchPage'
import searchRemind from '@/components/searchPageContent/searchRemind'
import booksResult from '@/components/searchPageContent/booksResult'
import bookDetail from '@/components/bookDetail'
import booksScroller from '@/components/personalPage/booksScroller'
import personalPage from '@/components/personalPage/personalPage'
import classBookDetail from '@/components/searchPageContent/classBookDetail'
import { LoadingPlugin, ToastPlugin } from 'vux'
Vue.use(LoadingPlugin)
Vue.use(ToastPlugin)
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'searchPage',
      component: searchPage
    },
    {
      path: '/searchResult',
      name: 'searchResult',
      component: searchResult
    },
    {
      path: '/bookDetail',
      name: 'bookDetail',
      component: bookDetail
    },
    {
      path: '/booksScroller',
      name: 'booksScroller',
      component: booksScroller
    },
    {
      path: '/classBookDetail',
      name: 'classBookDetail',
      component: classBookDetail
    },
    {
      path: '/personalPage',
      name: 'personalPage',
      component: personalPage
    },
  ]
})
