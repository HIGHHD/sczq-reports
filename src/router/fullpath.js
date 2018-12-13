import Index from '../views/Index'
import Reports from '../views/main/Reports'
import Cruds from '../views/main/Cruds'
import SystemManager from '../views/main/SystemManager'
import UserManager from '../views/main/systemManager/UserManager'
import RoleManager from '../views/main/systemManager/RoleManager'
import AuthManager from '../views/main/systemManager/AuthManager'

export default [{
  path: '/',
  name: '首页',
  component: Index,
  children: [{
    path: '/reports/:reportId',
    name: 'reports',
    meta: {
      name: '报表',
      path: '/reports',
      metaParent: '/reports',
      bread: '/报表',
      icon: 'ios-paper-outline',
      paths: []
    },
    component: Reports
  }, {
    path: '/crud/:crudId',
    name: 'crud',
    meta: {
      name: '信息维护',
      path: '/crud',
      metaParent: '/crud',
      bread: '/信息维护',
      icon: 'ios-paper-outline',
      paths: []
    },
    component: Cruds
  }, {
    path: '/system-manager',
    name: 'system-manager',
    meta: {
      name: '系统管理',
      path: '/system-manager',
      metaParent: '/',
      bread: '/系统管理',
      icon: 'ios-gear-outline'
    },
    component: SystemManager,
    children: [{
      path: 'user-manager',
      name: 'user-manager',
      meta: {
        name: '用户管理',
        path: '/system-manager/user-manager',
        metaParent: '/system-manager',
        bread: '/系统管理/用户管理',
        icon: 'ios-people-outline'
      },
      component: UserManager
    }, {
      path: 'role-manager',
      name: 'role-manager',
      meta: {
        name: '角色管理',
        path: '/system-manager/role-manager',
        metaParent: '/system-manager',
        bread: '/系统管理/角色管理',
        icon: 'ios-settings'
      },
      component: RoleManager
    }, {
      path: 'auth-manager',
      name: 'auth-manager',
      meta: {
        name: '权限管理',
        path: '/system-manager/auth-manager',
        metaParent: '/system-manager',
        bread: '/系统管理/权限管理',
        icon: 'ios-settings'
      },
      component: AuthManager
    }]
  }]
}]
