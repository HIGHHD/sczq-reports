<template>
  <div>
    <Modal :closable="false" v-model="showTagsModal"
           :mask-closable="false"
           title="分配角色"
           scrollable
           width="600"
           @on-ok="submitEditRole" @on-cancel="cancelSubmit">
      <Table :columns="tableRoleColumns"
             :data="tableRoleData"
             ref="roleTable"
             @on-selection-change="tableRoleSelectChange"
             height="400"></Table>
    </Modal>
    <Row style="margin-top: 20px;">
      <Col span="6">
      <Input v-model="userKey"
             size="large"
             icon="ios-search"
             @on-click="handleSearch"
             @on-enter="handleSearch"
             style="width: 300px;"
             placeholder="用户名/姓名/手机号/部门/邮箱">
      </Input>
      </Col>
      <Col span="3">
      <Button type="primary" icon="ios-loop-strong" @click="allUserInfo">当前全部用户</Button>
      </Col>
    </Row>
    <Table :columns="tableColumns"
           :data="tableData"
           height="600"
           border stripe
           style="margin-top: 10px;"></Table>
  </div>
</template>

<script>
import userAuth from '../../../api/userAuth'
import { mapGetters } from 'vuex'
import * as util from '../../../assets/js/util'
import RoleTags from '../../../components/RoleTags'
import Vue from 'vue'
import axios from 'axios'

Vue.component('role-tags', RoleTags)

export default {
  name: 'UserManager',
  mounted () {
    let vm = this
    userAuth.userAll.r().then((res) => {
      let cls = res
      if (Array.isArray(cls)) {
        vm.$data.tableData = cls
      }
    }).catch(err => {
      console.log('%O', err)
    })
  },
  computed: {
    ...mapGetters([
      'authRoles'
    ])
  },
  methods: {
    cancelSubmit () {
    },
    allUserInfo () {
      let vm = this
      userAuth.userAll.r().then((res) => {
        let cls = res
        if (Array.isArray(cls)) {
          vm.$data.tableData = cls
        }
      }).catch(err => {
        console.log('%O', err)
      })
    },
    submitEditRole () {
      let vm = this
      console.log('postAddRole:%O', vm.editUser)
      let userId = vm.editUser.userId
      let addStr = vm.editUser.addIds
      let delStr = vm.editUser.delIds

      function refreshUserTable () {
        if (vm.$data.userKey) {
          userAuth.userQuery.r({keyword: vm.$data.userKey}).then((res) => {
            let cls = res
            if (Array.isArray(cls)) {
              vm.$data.tableData = cls
            }
          }).catch(err => {
            console.log('%O', err)
          })
        } else {
          userAuth.userAll.r().then((res) => {
            let cls = res
            if (Array.isArray(cls)) {
              vm.$data.tableData = cls
            }
          }).catch(err => {
            console.log('%O', err)
          })
        }
      }

      if (addStr && !delStr) {
        userAuth.userAdd.r({
          userId: userId,
          roles: addStr
        }).then((res) => {
          refreshUserTable()
          vm.$Message.success({
            content: '分配角色成功！'
          })
        }).catch(err => {
          console.log('%O', err)
          vm.$Message.error({
            content: '分配角色失败！'
          })
        })
      } else if (!addStr && delStr) {
        userAuth.userDelete.r({
          userId: userId,
          roles: delStr
        }).then((res) => {
          refreshUserTable()
          vm.$Message.success({
            content: '分配角色成功！'
          })
        }).catch(err => {
          console.log('%O', err)
          vm.$Message.error({
            content: '分配角色失败！'
          })
        })
      } else if (addStr && delStr) {
        axios.all([userAuth.userAdd.r({
          userId: userId,
          roles: addStr
        }), userAuth.userDelete.r({
          userId: userId,
          roles: delStr
        })]).then(axios.spread(function (acct, perms) {
          refreshUserTable()
          console.log('acct:%O', acct)
          console.log('perms:%O', perms)
          vm.$Message.success({
            content: '分配角色成功！'
          })
        }))
      } else {}
    },
    tableRoleSelectChange (selection) {
      let vm = this
      let addArr = []
      let delArr = []
      if (vm.editUser.userRoleIds) {
        delArr = vm.editUser.userRoleIds.split(',')
      }
      selection.forEach(e => {
        let idx = delArr.findIndex(re => re === (e.roleId + ''))
        if (idx >= 0) {
          delArr.splice(idx, 1)
        } else {
          addArr.push(e.roleId)
        }
      })
      vm.editUser.addIds = addArr.join(',')
      vm.editUser.delIds = delArr.join(',')
    },
    handleSearch () {
      let vm = this
      if (!vm.$data.userKey) {
        vm.$Modal.warning({
          title: '提示',
          content: '查询信息不能为空！'
        })
      }
      userAuth.userQuery.r({keyword: vm.$data.userKey}).then((res) => {
        let cls = res
        if (Array.isArray(cls)) {
          vm.$data.tableData = cls
        }
      }).catch(err => {
        console.log('%O', err)
      })
    },
    editRole (roleIds, userId) {
      let vm = this
      vm.$data.editUser.userId = userId
      vm.$data.editUser.userRoleIds = ''
      vm.$data.tableRoleData = util.deepcopy(vm.authRoles)
      let myTags = []
      if (roleIds) {
        myTags = roleIds.split(',')
        vm.$data.editUser.userRoleIds = roleIds
      }
      vm.$data.tableRoleData.forEach((item, index, arr) => {
        item._checked = false
        let fIndex = myTags.findIndex((mt) => mt === (item.roleId + ''))
        if (fIndex >= 0) {
          item._checked = true
        }
      })
      vm.showTagsModal = true
    }
  },
  data () {
    return {
      userAuth,
      showTagsModal: false,
      userKey: '',
      editUser: {
        userRoleIds: '',
        userId: '',
        delIds: '',
        addIds: ''
      },
      tableData: [],
      tableRoleData: [],
      tableRoleColumns: [{
        width: 60,
        type: 'selection'
      }, {
        title: '角色名称',
        key: 'roleName',
        align: 'center',
        width: 100
      }, {
        title: '角色描述',
        key: 'roleDesc',
        align: 'center',
        width: 400
      }],
      tableColumns: [{
        title: '姓名',
        key: 'realName',
        align: 'center',
        width: 100
      }, {
        title: '用户名',
        key: 'username',
        align: 'center',
        width: 100
      }, {
        title: '部门',
        key: 'department',
        align: 'center',
        width: 150
      }, {
        title: '邮箱',
        key: 'email',
        align: 'center',
        width: 200
      }, {
        title: '分配角色',
        align: 'center',
        width: 600,
        render: (h, params) => {
          return h('span', [
            h('role-tags', {
              props: {
                tags: params.row.userRoleIds || params.row.roleIds,
                propAllTags: this.authRoles
              },
              style: {
                display: 'inline-block',
                width: '80%'
              }
            }),
            h('Button', {
              props: {
                icon: 'edit',
                type: 'dashed',
                size: 'small'
              },
              style: {
                display: 'inline-block',
                width: '20%'
              },
              on: {
                click: () => {
                  this.editRole(params.row.userRoleIds || params.row.roleIds, params.row.userId)
                }
              }
            }, '分配角色')
          ])
        }
      }]
    }
  }
}
</script>

<style scoped>

</style>
