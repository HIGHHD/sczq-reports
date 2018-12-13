import * as util from '../../assets/js/util'

const app = {
  state: {
    sidebar: {
      opened: !+util.appLocal('sidebarStatus'),
      minOpen: false // 小屏时菜单状态
    },
    username: ''
  },
  mutations: {
    /**
     * 菜单的缩展
     */
    TOGGLE_SIDEBAR: state => {
      let winWidth = document.documentElement.clientWidth
      if (winWidth <= 600) {
        state.sidebar.minOpen = !state.sidebar.minOpen
        state.sidebar.opened = false
        util.appLocal('sidebarStatus', 0)
      } else {
        if (state.sidebar.opened) {
          util.appLocal('sidebarStatus', 1)
        } else {
          util.appLocal('sidebarStatus', 0)
        }
        state.sidebar.opened = !state.sidebar.opened
      }
    },
    CLOSE_SLIDEBAR: state => {
      util.appLocal('sidebarStatus', 0)
      state.sidebar.opened = false
      state.sidebar.minOpen = false
    },
    OPEN_SLIDEBAR: state => {
      util.appLocal('sidebarStatus', 1)
      state.sidebar.opened = true
    },
    USERNAME: (state, payload) => {
      state.username = payload
    }
  },
  actions: {
    ToggleSideBar: ({commit}) => {
      commit('TOGGLE_SIDEBAR')
    }
  }
}

export default app
