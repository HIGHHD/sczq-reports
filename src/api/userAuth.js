import axios from 'axios'
import * as util from '../assets/js/util'
import Vue from 'vue'
import iView from 'iview'
Vue.use(iView)

const instance = axios.create({
  // baseURL: 'http://192.168.202.201:9969/',
  baseURL: 'http://192.168.1.170:9969/',
  timeout: 30000
})

const token = util.appLocal('token')
const appCode = 'report-app'

instance.defaults.headers.common['Authorization'] = 'Bearer ' + token
// instance.defaults.headers.post['Content-Type'] = 'multipart/form-data'
// instance.defaults.headers.put['Content-Type'] = 'multipart/form-data'
// 错误处理
instance.interceptors.request.use(function (config) {
  iView.LoadingBar.start()
  console.log('auth-config:%O', config)
  return config
}, util.catchError)

instance.interceptors.response.use(function (response) {
  iView.LoadingBar.finish()
  return util.resError(response)
  // return response
}, util.catchError)

// 用户
const userAll = {
  p: ['get,/auth/v1/user/roles/**'],
  r: param => {
    return instance.get(`/auth/v1/user/roles/${appCode}`)
  }
}
const userQuery = {
  p: ['get,/auth/v1/user/roles/query/**'],
  r: param => {
    return instance.get(`/auth/v1/user/roles/query/${appCode}`, {params: param})
  }
}
const userAdd = {
  p: ['post,/auth/v1/user/roles/**'],
  r: param => {
    let fd = new FormData()
    for (let argu in param) {
      if (param[argu]) {
        fd.append(argu, param[argu])
      }
    }
    /*
    * userId: string,
    * roles: string,
    * */
    return instance.post(`/auth/v1/user/roles/${appCode}`, fd)
  }
}
const userDelete = {
  p: ['delete,/auth/v1/user/roles/**'],
  r: param => {
    let fd = new FormData()
    for (let argu in param) {
      if (param[argu]) {
        fd.append(argu, param[argu])
      }
    }
    /*
    * userId: string,
    * roles: string,
    * */
    return instance.delete(`/auth/v1/user/roles/${appCode}`, {params: param})
  }
}
// 角色
const rolesAll = {
  p: ['get,/auth/v1/roles/**'],
  r: param => {
    return instance.get(`/auth/v1/roles/${appCode}`)
  }
}
const rolesAdd = {
  p: ['post,/auth/v1/roles/**'],
  r: param => {
    let fd = new FormData()
    for (let argu in param) {
      if (param[argu]) {
        fd.append(argu, param[argu])
      }
    }
    /*
    * roleId: integer,roleCode: string,
    * roleName: string,roleDesc: string,
    * */
    return instance.post(`/auth/v1/roles/${appCode}`, param)
  }
}
const rolesUpdate = {
  p: ['put,/auth/v1/roles/**'],
  r: param => {
    let fd = new FormData()
    for (let argu in param) {
      if (param[argu]) {
        fd.append(argu, param[argu])
      }
    }
    /*
    * roleId: integer,roleCode: string,
    * roleName: string,roleDesc: string,
    * */
    return instance.put(`/auth/v1/roles/${appCode}`, param)
  }
}
const rolesDetails = {
  p: ['get,/auth/v1/roles/**'],
  r: param => {
    return instance.get(`/auth/v1/roles/${appCode}/${param}`)
  }
}
const rolesDelete = {
  p: ['delete,/auth/v1/roles/**'],
  r: param => {
    return instance.delete(`/auth/v1/roles/${appCode}/${param}`)
  }
}
// 资源
const resourceAll = {
  p: ['get,/auth/v1/resource/**'],
  r: param => {
    return instance.get(`/auth/v1/resource/${appCode}`)
  }
}
const resourceAdd = {
  p: ['post,/auth/v1/resource/**'],
  r: param => {
    let fd = new FormData()
    for (let argu in param) {
      if (param[argu]) {
        fd.append(argu, param[argu])
      }
    }
    return instance.post(`/auth/v1/resource/${appCode}`, param)
  }
}
const resourceUpdate = {
  p: ['put,/auth/v1/resource/**'],
  r: param => {
    let fd = new FormData()
    for (let argu in param) {
      if (param[argu]) {
        fd.append(argu, param[argu])
      }
    }
    return instance.put(`/auth/v1/resource/${appCode}`, param)
  }
}
const resourceDetails = {
  p: ['get,/auth/v1/resource/**'],
  r: param => {
    return instance.get(`/auth/v1/resource/${appCode}/${param}`)
  }
}
const resourceDelete = {
  p: ['delete,/auth/v1/resource/**'],
  r: param => {
    return instance.delete(`/auth/v1/resource/${appCode}/${param}`)
  }
}
// 权限
const authUser = {
  r: param => {
    return instance.get(`/auth/v1/auth/authorize/`, {params: {appCode: appCode}})
  }
}
const authResourceLoad = {
  r: param => {
    return instance.get(`/auth/v1/auth/loadResources/`, {params: {appCode: appCode}})
  }
}
const authPermissions = {
  r: param => {
    return instance.get(`/auth/v1/auth/permissions`, {params: {appCode: appCode}})
  }
}
// 权限
const rrAdd = {
  r: param => {
    let fd = new FormData()
    for (let argu in param) {
      if (param[argu]) {
        fd.append(argu, param[argu])
      }
    }
    return instance.post(`/auth/v1/role/resources/${appCode}`, fd)
  }
}
const rrDelete = {
  r: param => {
    return instance.delete(`/auth/v1/role/resources/${appCode}`, {params: param})
  }
}
const rrGet = {
  r: param => {
    return instance.get(`/auth/v1/role/resources/${appCode}/${param}`)
  }
}
export default {
  userAll,
  userQuery,
  userAdd,
  userDelete,
  rolesAll,
  rolesAdd,
  rolesUpdate,
  rolesDetails,
  rolesDelete,
  resourceAll,
  resourceAdd,
  resourceUpdate,
  resourceDetails,
  resourceDelete,
  authUser,
  authResourceLoad,
  authPermissions,
  rrAdd,
  rrDelete,
  rrGet
}
