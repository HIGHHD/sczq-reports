<style>
  @import './assets/css/common.css';
</style>
<template>
  <router-view id="app" @login="loginDirect" @logout="logoutDirect"></router-view>
</template>
<script>
import Vue from 'vue'
import instance from './api'
import userAuthApi from './api/userAuth'
import userPath from './router/fullpath'
import * as util from './assets/js/util'
// import * as mockData from './api/mockData'

let wallInterceptor

export default {
  data () {
    return {
      menuData: null,
      userData: null
    }
  },
  methods: {
    getPermission: function (userInfo) {
      let resourcePermission = {}
      if (Array.isArray(userInfo.resources)) {
        userInfo.resources.forEach(function (e, i) {
          let key = e.method.toLowerCase() + ',' + e.url
          resourcePermission[key] = true
        })
      }
      return resourcePermission
    },
    setInterceptor: function (resourcePermission) {
      let vm = this
      wallInterceptor = instance.interceptors.request.use(function (config) {
        // 得到请求路径
        let perName = config.url.replace(config.baseURL, '').replace('/GET', '').replace('/POST', '').split('?')[0]
        // 权限格式1 /path/${param}
        /* eslint-disable no-useless-escape */
        let reg1 = perName.match(/^(\/[^\/]+\/)[^\/]+$/)
        if (reg1) {
          perName = reg1[1] + '**'
        }
        // 权限格式2 /path/${param}/path
        let reg2 = perName.match(/^\/[^\/]+\/([^\/]+)\/[^\/]+$/)
        if (reg2) {
          perName = perName.replace(reg2[1], '*')
        }
        // 校验权限
        if (!resourcePermission[config.method + ',' + perName]) {
          // 调试信息
          console.warn(resourcePermission, config.method + ',' + perName)
          vm.$Message.warning({
            content: '无访问权限！'
          })
          // 拦截请求
          return Promise.reject(new Error({message: 'no permission'}))
        }
        return config
      })
    },
    getRoutes: function (authMenus) {
      // let vm = this
      let allowedRouter = []
      // 将菜单数据转成多维数组格式
      let arrayMenus = util.deepcopy(authMenus)
      // 将多维数组转成对象格式
      let hashMenus = {}
      let setMenu2Hash = function (array, base) {
        array.map(key => {
          if (key.route) {
            let hashKey = ((base ? base + '/' : '') + key.route).replace(/^\//, '')
            hashMenus['/' + hashKey] = true
            if (Array.isArray(key.children)) {
              setMenu2Hash(key.children, key.route)
            }
          }
        })
      }
      setMenu2Hash(arrayMenus)
      // 全局挂载hashMenus，用于实现路由守卫
      this.$root.hashMenus = hashMenus
      // 筛选本地路由方法
      let findLocalRoute = function (array, base) {
        let replyResult = []
        array.forEach(function (route) {
          let pathKey = (base ? base + '/' : '') + route.path
          if (hashMenus[pathKey]) {
            if (Array.isArray(route.children)) {
              route.children = findLocalRoute(route.children, route.path)
            }
            replyResult.push(route)
          }
        })
        if (base) {
          return replyResult
        } else {
          allowedRouter = allowedRouter.concat(replyResult)
        }
      }
      let originPath = util.deepcopy(userPath[0].children)
      findLocalRoute(originPath)
      return allowedRouter
    },
    extendRoutes: function (allowedRouter) {
      let vm = this
      let actualRouter = util.deepcopy(allowedRouter)
      actualRouter.map(e => {
        // 复制子菜单信息到meta用于实现导航相关效果，非必需
        if (e.children) {
          if (!e.meta) e.meta = {}
          e.meta.children = e.children
        }
        // 为动态路由添加独享守卫
        e.beforeEnter = function (to, from, next) {
          if (to.path.indexOf('reports') >= 0 || to.path.indexOf('crud') >= 0) {
            next()
          } else {
            if (vm.$root.hashMenus[to.path]) {
              next()
            } else {
              next('/401')
            }
          }
        }
        return e
      })
      let originPath = util.deepcopy(userPath)
      originPath[0].children = actualRouter
      // 注入路由
      vm.$router.addRoutes(originPath.concat([{
        path: '*',
        redirect: '/404'
      }]))
    },
    signin: function (callback) {
      let vm = this
      // 检查登录状态
      let localUser = {}
      localUser.token = util.appLocal('token')
      // localUser.token = util.docCookies.getItem('sczq-token')
      if (!localUser.token) {
        return vm.$router.push({path: '/login', query: {from: vm.$router.currentRoute.path}})
      }
      // 设置请求头统一携带token
      instance.defaults.headers.common['Authorization'] = 'Bearer ' + localUser.token
      // 获取用户信息及权限数据
      userAuthApi.authPermissions.r().then((res) => {
        console.log('permission:%O', res)
        // 获取用户信息及权限数据
        if (res.menus && res.menus.length > 0) {
          let userInfo = util.buildUserInfo(res)
          console.log('userInfo: %O', userInfo)
          let authMenus = util.buildMenu(userInfo.menus)
          // 取得资源权限对象
          let resourcePermission = vm.getPermission(userInfo)
          // 使用资源权限设置请求拦截
          // if (resourcePermission) {
          //   vm.setInterceptor(resourcePermission)
          // }
          // 获得实际路由
          let allowedRouter = vm.getRoutes(authMenus)
          // 若无可用路由限制访问
          if (!allowedRouter || !allowedRouter.length) {
            util.appLocal('token', '')
            // util.docCookies.removeItem('sczq-token', '', 'sc.local')
            // let retEL = document.body.innerHTML = ('<h1>账号访问受限！</h1>')
            // return retEL
            vm.$Message.warning({
              content: '账号无访问权限，请联系管理员！'
            })
          }
          // 保存数据用作他处，必需
          console.log('allowedRouter1:%O', allowedRouter)
          allowedRouter.forEach(e => {
            if (e.path === '/reports/:reportId') {
              let reports = authMenus.filter(fe => fe.id === '/reports/:reportId')[0].children
              reports.forEach(re => {
                re.path = re.url
                re.bread = re.name
                re.icon = re.icon || 'ios-list-outline'
                re.metaParent = '/reports'
              })
              reports.sort((a, b) => {
                if (a.priority > b.priority) {
                  return 1
                } else {
                  return -1
                }
              })
              this.$store.dispatch('reportsMenus', reports)
              e.meta.paths = reports
            }
            if (e.path === '/crud/:crudId') {
              let crud = authMenus.filter(fe => fe.id === '/crud/:crudId')[0].children
              crud.forEach(re => {
                re.path = re.url
                re.bread = re.name
                re.icon = re.icon || 'ios-list-outline'
                re.metaParent = '/crud'
              })
              crud.sort((a, b) => {
                if (a.priority > b.priority) {
                  return 1
                } else {
                  return -1
                }
              })
              this.$store.dispatch('crudMenus', crud)
              e.meta.paths = crud
            }
          })
          console.log('allowedRouter2:%O', allowedRouter)
          // 动态注入路由
          vm.extendRoutes(allowedRouter)
          vm.menuData = allowedRouter
          vm.userData = userInfo
          vm.username = util.appLocal('username')
          vm.token = util.appLocal('token')
          // vm.token = util.docCookies.getItem('sczq-token')
          // vm.username = util.docCookies.getItem('sczq-username')
          // 权限检验方法
          Vue.prototype.$_has = function (rArray) {
            let resources = []
            let permission = true
            // 提取权限数组
            if (Array.isArray(rArray)) {
              rArray.forEach(function (e) {
                resources = resources.concat(e.p)
              })
            } else {
              resources = resources.concat(rArray.p)
            }
            // 校验权限
            resources.forEach(function (p) {
              if (!resourcePermission[p]) {
                permission = false
                return permission
              }
            })
            return permission
          }
          // 执行回调
          typeof callback === 'function' && callback()
        } else {
          this.$router.replace({path: '/login'})
        }
      })
    },
    loginDirect: function (newPath) {
      this.signin(() => {
        this.$router.replace({path: newPath || '/'})
      })
    },
    logoutDirect: function () {
      // 清除local、session
      util.appLocal('token', '')
      // util.docCookies.removeItem('sczq-token', '', 'sc.local')
      util.appLocal('username', '')
      // util.docCookies.removeItem('sczq-username', '', 'sc.local')
      this.username = ''
      this.token = ''
      // 清除请求权限控制
      instance.interceptors.request.eject(wallInterceptor)
      // 清除菜单权限
      this.$root.hashMenus = {}
      // 删除添加的路由
      location.reload()
      // 清除请求头token
      instance.defaults.headers.common['Authorization'] = ''
      // 回到登录页
      this.$router.replace({path: '/login'})
    }
  },
  created: function (newPath) {
    this.$store.dispatch('allResource')
    this.$store.dispatch('allRoles')
    this.signin()
  }
}

</script>
