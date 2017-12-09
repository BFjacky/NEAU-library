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
const scrollBehavior = (to, from, savedPosition) => {
  if (savedPosition) {
    return savedPosition
  } else {
    return { x: 0, y: 0 }
  }
}
export default new Router({
  routes: [
    {
      path: '/',
      name: 'loginPage',
      component: loginPage,
     
    },
    {
      path: '/searchPage',
      name: 'searchPage',
      component: searchPage,
     
    },
    {
      path: '/searchResult',
      name: 'searchResult',
      component: searchResult,
     
    },
    {
      path: '/bookDetail',
      name: 'bookDetail',
      component: bookDetail,
     
    },
    {
      path: '/personalPage',
      name: 'personalPage',
      component: personalPage,
     
    },
    {
      path: '/bookMorePage',
      name: 'bookMorePage',
      component: bookMorePage,
     
    }
  ]
})
