import axios from 'axios'
import * as util from '../assets/js/util'
import Vue from 'vue'
import iView from 'iview'
Vue.use(iView)

const createAxiosIns = function (baseUrl) {
  let instance = axios.create({
    baseURL: baseUrl,
    timeout: 30000
  })
  instance.defaults.headers.post['Content-Type'] = 'application/json'
  instance.interceptors.request.use(function (config) {
    iView.LoadingBar.start()
    return config
  }, util.catchError)
  instance.interceptors.response.use(function (response) {
    iView.LoadingBar.finish()
    return util.resError(response)
    // return response
  }, util.catchError)
  return instance
}

export default createAxiosIns
