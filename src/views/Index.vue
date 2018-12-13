<template>
  <div class="app-wrapper" :class="{hideSidebar:!state.sidebar.opened,hoverSideBar:state.sidebar.minOpen}">
    <!-- 左侧 -->
    <div class="side-wrapper" :class="{hover:!state.sidebar.minOpen,light:theme=='light'}">
      <!-- logo -->
      <!--<div style="height:50px;" class="logo-box">-->
        <!--&lt;!&ndash;<h4 v-show="state.sidebar.opened" style="font-weight: 300;color: #f00310;">报表系统</h4>&ndash;&gt;-->
        <!--<img :src="require('../assets/imgs/walllogo.png')"-->
             <!--alt="" height="48" v-show="state.sidebar.opened" style="padding: 1px;">-->
        <!--<img :src="require('../assets/imgs/sczq-logo.png')" alt="" height="40" width="40"-->
             <!--style="position: absolute;top: 5px;left: 0px;" v-show="!state.sidebar.opened">-->
      <!--</div>-->
      <!-- logo /-->
      <!-- 左侧导航 -->
      <nav-bar style="top: 0px">
        <div style="border-right:2px solid #d7dde4; height: 100%">
          <Menu :theme="theme"
                :active-name="$route.path"
                :open-names="[$route.meta.metaParent]"
                @on-open-change="showOpen"
                width="239px"
                @on-select="onItemSelect">
            <template v-for="(route, index) in menus">
              <template v-if="route.children">
                <Submenu :key="index" :name="route.meta.path">
                  <template slot="title">
                    <Icon :type="route.meta.icon ? route.meta.icon : 'folder'"></Icon>
                    {{ route.meta.name }}
                  </template>
                  <MenuItem v-for="(cRoute, cIndex) in route.children"
                            :key="cIndex"
                            :name="cRoute.meta.path">
                    <Icon :key="cIndex" :type="cRoute.meta.icon ? cRoute.meta.icon : 'folder'"></Icon>
                    {{ cRoute.meta.name }}
                  </MenuItem>
                </Submenu>
              </template>
              <template v-else-if="route.meta.paths || route.meta.paths.length > 0">
                <Submenu :key="index" :name="route.meta.path">
                  <template slot="title">
                    <Icon :type="route.meta.icon ? route.meta.icon : 'folder'"></Icon>
                    {{ route.meta.name }}
                  </template>
                  <MenuItem v-for="(mpRoute, mpIndex) in route.meta.paths"
                            :key="mpIndex"
                            :name="mpRoute.path">
                    <Icon :key="mpIndex" :type="mpRoute.icon ? mpRoute.icon : 'folder'"></Icon>
                    {{ mpRoute.name }}
                  </MenuItem>
                </Submenu>
              </template>
              <template v-else>
                <MenuItem :key="index" :name="route.meta.path">
                  <Icon :key="index" :type="route.meta.icon ? route.meta.icon : 'folder'"></Icon>
                  {{ route.meta.name }}
                </MenuItem>
              </template>
            </template>
          </Menu>
        </div>
      </nav-bar>
      <div class="theme-switch" :class="{hidden:!state.sidebar.opened}" style="margin-top: 0px;">
        切换主题
        <i-switch size="large" @on-change="themeChange" v-model="themeBool">
          <span slot="open">Light</span>
          <span slot="close">Dark</span>
        </i-switch>
      </div>
      <!-- 左侧导航 /-->
    </div>
    <!-- 左侧 /-->
    <!-- 主体 -->
    <div class="main-wrapper">
      <!-- 头部 -->
      <t-header>
        <!-- 用户信息 -->
        <Dropdown class="userBox" slot='right'>
          <a href="javascript:void(0)">
            {{username}}
            <Icon type="arrow-down-b"></Icon>
          </a>
          <Dropdown-menu slot="list">
            <Dropdown-item @click.native="logout">退出登录</Dropdown-item>
          </Dropdown-menu>
        </Dropdown>
        <!-- 用户信息 /-->
        <!--<div class="messageBox" slot='msg-icon'>-->
          <!--<Row>-->
            <!--<Col :xs='{span:0}' :sm='{span:24}'>-->
            <!--<div class="iconBox">-->

              <!--<Badge count="3">-->
                <!--<Tooltip placement="bottom" content="通知">-->
                  <!--<Icon type="ios-bell">-->
                  <!--</Icon>-->
                <!--</Tooltip>-->
              <!--</Badge>-->

            <!--</div>-->
            <!--</Col>-->
          <!--</Row>-->
        <!--</div>-->
      </t-header>
      <!-- 头部 /-->
      <!-- 内容部分 -->
      <div class="main-container">
        <container>
          <!-- 面包屑 -->
          <Breadcrumb>
            <Breadcrumb-item to="/">
              <Icon type="ios-home-outline"></Icon>
              首页
            </Breadcrumb-item>
            <Breadcrumb-item v-for="(b, index) in breads" :key="index" :to="b.pathValue">
              {{ b.name }}
            </Breadcrumb-item>
          </Breadcrumb>
          <!-- 面包屑 /-->
          <!-- 路由 -->
          <transition name="fade" mode="out-in">
            <router-view id="main">
            </router-view>
          </transition>
          <!-- 路由/ -->
        </container>
      </div>
      <!-- 内容部分 /-->
    </div>
  </div>
</template>
<script>
import THeader from '../components/THeader'
import NavBar from '../components/NavBar'
import Container from '../components/Container'

export default {
  name: 'Index',
  components: {
    't-header': THeader,
    'nav-bar': NavBar,
    'container': Container
  },
  data () {
    return {
      username: '',
      menus: [],
      theme: 'light', // 主题
      themeBool: true,
      formItem: {
        input: '',
        select: '',
        radio: 'male',
        checkbox: [],
        switch: true,
        date: '',
        time: '',
        slider: [20, 50],
        textarea: ''
      }
    }
  },
  created () {
    let user = this.$parent.username
    let token = this.$parent.token
    if (token && user) {
      this.username = user
    } else {
      this.$router.push({ path: '/login' })
    }
    let menus = this.$parent.menuData
    if (menus) {
      this.menus = menus
      console.log('menus:%O', menus)
    }
  },
  computed: {
    state () {
      return this.$store.state.app
    },
    breadsMap () {
      let res = {}
      this.$route.meta.paths.forEach(e => {
        let key = e.id
        let val = e.bread
        res[key] = val
      })
      return res
    },
    breads () {
      let vm = this
      let bs = (this.$route.path || '').split('/').filter((x) => {
        if (x !== '') {
          return x
        }
      })
      let bns = (this.$route.meta.bread || '').split('/').filter((x) => {
        if (x !== '') {
          return x
        }
      })
      if (bs.length >= 2) {
        if (bs[bs.length - 2] === 'reports') {
          bns = [vm.breadsMap[bs[bs.length - 1]]]
          bs = bs.filter(e => e !== 'reports')
          bs[bs.length - 1] = 'reports/' + bs[bs.length - 1]
        }
        if (bs[bs.length - 2] === 'crud') {
          bns = [vm.breadsMap[bs[bs.length - 1]]]
          bs = bs.filter(e => e !== 'crud')
          bs[bs.length - 1] = 'crud/' + bs[bs.length - 1]
        }
        console.log('bns-bs:%O,%O', bns, bs)
      }
      const bdata = []
      if (bs.length >= 1 && bs.length === bns.length) {
        var addPathValue = '/'
        for (let i = 0; i < bs.length; i++) {
          let bread = {}
          if (i === bs.length - 1) {
            addPathValue += bs[i]
          } else {
            addPathValue += bs[i] + '/'
          }
          bread.pathValue = addPathValue
          bread.name = bns[i]
          bdata.push(bread)
        }
      }
      console.log('path-bread:%O', bdata)
      return bdata
    }
  },
  methods: {
    /**
     * 选择菜单
     */
    showOpen (names) {
      console.log('names: %O', names)
    },
    onItemSelect (a) {
      console.log('aPth:%O', a)
      this.$router.push({
        path: a
      })
    },
    /**
     *退出
     */
    logout () {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确认退出？</p>',
        onOk: () => {
          this.$emit('logout')
        },
        onCancel: () => {
        }
      })
    },
    themeChange (state) {
      if (state) {
        this.theme = 'light'
      } else {
        this.theme = 'dark'
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
