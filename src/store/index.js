import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import enums from './modules/enums'
import appAuth from './modules/appAuth'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    enums,
    appAuth
  }
})

export default store
