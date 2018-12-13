import axios from 'axios'
import * as util from '../assets/js/util'
import Vue from 'vue'
import iView from 'iview'
Vue.use(iView)

const instance = axios.create({
  // baseURL: 'http://192.168.202.16:8080/',
  baseURL: 'http://192.168.1.168:8001/',
  timeout: 30000
})

instance.defaults.headers.post['Content-Type'] = 'application/json'
// 错误处理
instance.interceptors.request.use(function (config) {
  iView.LoadingBar.start()
  return config
}, util.catchError)

instance.interceptors.response.use(function (response) {
  iView.LoadingBar.finish()
  return util.resError(response)
  // return response
}, util.catchError)

export default instance
