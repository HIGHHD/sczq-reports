import userAuth from '../../api/userAuth'

const appAuth = {
  state: {
    authResource: [],
    authRoles: [],
    reportsMenus: [],
    crudMenus: []
  },
  mutations: {
    RESOURCE: (state, res) => {
      state.authResource = res
    },
    ROLES: (state, res) => {
      state.authRoles = res
    },
    REPORTS_MENUS: (state, res) => {
      state.reportsMenus = res
    },
    CRUD_MENUS: (state, res) => {
      state.crudMenus = res
    }
  },
  getters: {
    authResource: (state) => state.authResource,
    authRoles: (state) => state.authRoles,
    reportsMenus: (state) => state.reportsMenus,
    crudMenus: (state) => state.crudMenus
  },
  actions: {
    allResource: ({commit}) => {
      userAuth.resourceAll.r().then((res) => {
        if (Array.isArray(res)) {
          commit('RESOURCE', res)
        }
      })
    },
    allRoles: ({commit}) => {
      userAuth.rolesAll.r().then((res) => {
        if (Array.isArray(res)) {
          commit('ROLES', res)
        }
      })
    },
    reportsMenus: ({commit}, payload) => {
      commit('REPORTS_MENUS', payload)
    },
    crudMenus: ({commit}, payload) => {
      commit('CRUD_MENUS', payload)
    }
  }
}

export default appAuth
