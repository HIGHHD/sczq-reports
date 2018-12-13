import Vue from 'vue'
import Rooter from 'vue-router'
import store from '../store'

import Login from '../views/Login'
import P401 from '../views/401'
import P404 from '../views/404'
import iView from 'iview'

Vue.use(Rooter)

let baseRoute = [
  {
    path: '/login',
    name: 'login',
    component: Login
  }, {
    path: '/401',
    name: '401',
    component: P401
  }, {
    path: '/404',
    name: '404',
    component: P404
  }
]

let router = new Rooter({
  routes: baseRoute
})

router.beforeEach((to, from, next) => {
  let routeName = to.meta.name || to.name
  // window.document.title = (routeName ? routeName + ' - ' : '') + '信息管理系统'
  window.document.title = (routeName ? routeName + ' - ' : '') + '报表系统'
  if (document.documentElement.clientWidth <= 600) {
    store.commit('CLOSE_SLIDEBAR')
  }
  iView.LoadingBar.start()
  next()
})
router.afterEach((to, from) => {
  iView.LoadingBar.finish()
})
export default router
