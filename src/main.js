// import 'vue2-admin-lte/src/lib/css'
// import 'vue2-admin-lte/src/lib/script'
// import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'

import Vue from 'vue'
import iView from 'iview/'
import 'iview/dist/styles/iview.css'
import './assets/styles/layout.less' // 引入布局样式
import './assets/styles/cover.less' // 覆盖样式
import './assets/styles/base.less'

import App from './App'
import router from './router'
import store from './store'

var winWidth = document.documentElement.clientWidth
if (winWidth <= 600) {
  store.commit('CLOSE_SLIDEBAR')
} else {
  store.commit('OPEN_SLIDEBAR')
}
window.onresize = function () {
  winWidth = document.documentElement.clientWidth
  if (winWidth <= 600) {
    store.commit('CLOSE_SLIDEBAR')
  } else {
    store.commit('OPEN_SLIDEBAR')
  }
}

Vue.use(iView)
// 权限指令
Vue.directive('has', {
  bind: function (el, binding) {
    if (!Vue.prototype.$_has(binding.value)) {
      el.parentNode.removeChild(el)
    }
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
