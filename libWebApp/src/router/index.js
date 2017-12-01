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
import infiniteScroll from 'vue-infinite-scroll'
import loginPage from '@/components/loginPage/login'
import bookMorePage from '@/components/personalPage/bookMorePage'
import { LoadingPlugin, ToastPlugin } from 'vux'
Vue.use(LoadingPlugin)
Vue.use(ToastPlugin)
Vue.use(Router)
Vue.use(infiniteScroll)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'loginPage',
      component: loginPage,
      index: 0,
    },
    {
      path: '/searchPage',
      name: 'searchPage',
      component: searchPage,
      index: 1,
    },
    {
      path: '/searchResult',
      name: 'searchResult',
      component: searchResult,
      index: 2,
    },
    {
      path: '/bookDetail',
      name: 'bookDetail',
      component: bookDetail,
      index: 3,
    },
    {
      path: '/personalPage',
      name: 'personalPage',
      component: personalPage,
      index: 1,
    },
    {
      path: '/bookMorePage',
      name: 'bookMorePage',
      component: bookMorePage,
      index: 2,
    }
  ]
})
