<template>
  <div style="margin-top: 20px;">
    <Modal :closable="false" v-model="showRoleModal"
           :mask-closable="false"
           title="角色信息"
           scrollable
           width="500"
           ok-text="提交" @on-ok="submitRoles" @on-cancel="cancelSubmitRole">
      <Form :model="roleInfo" :label-width="100">
        <FormItem label="角色名称" required>
          <Input v-model="roleInfo.roleName" size="large" type="text" placeholder="角色名称"></Input>
        </FormItem>
        <FormItem label="角色代码" required>
          <Input v-model="roleInfo.roleCode" size="large" type="text" placeholder="角色代码"></Input>
        </FormItem>
        <FormItem label="角色描述">
          <Input v-model="roleInfo.roleDesc" size="large" type="textarea" placeholder="角色描述..."></Input>
        </FormItem>
      </Form>
    </Modal>
    <Modal :closable="false" v-model="showResModal"
           :mask-closable="false"
           :title="treeTitle"
           scrollable
           width="500"
           ok-text="提交" @on-ok="submitRes" @on-cancel="cancelSubmitRes">
      <div style="min-height:400px;overflow-y:auto;max-height:500px;">
        <Tree :data="treeData"
              @on-check-change="checkTreeNode"
              ref="resTree"
              show-checkbox multiple></Tree>
      </div>
    </Modal>
    <ButtonGroup style="padding-bottom: 10px;">
      <Button type="primary" icon="plus" @click="addInfo"
              >新增</Button>
      <Button type="primary" icon="edit" @click="updateInfo"
              >修改</Button>
      <Button type="primary" icon="trash-a" @click="removeInfo"
              >删除</Button>
      <Button type="primary" icon="key" @click="distributeRes"
              >分配资源</Button>
      <Button type="primary" icon="ios-loop-strong" @click="refreshInfo">刷新</Button>
    </ButtonGroup>
    <Table :columns="tableColumns.filter(e => e.visible || e.fixShow)"
           :data="authRoles"
           @on-selection-change="tableSelectChange"
           height="600"
           border stripe></Table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as util from '../../../assets/js/util'
import userAuth from '../../../api/userAuth'
import axios from 'axios'

export default {
  name: 'RoleManager',
  methods: {
    refreshInfo () {
      this.$store.dispatch('allRoles')
      this.$store.dispatch('allResource')
    },
    tableSelectChange (selection) {
      let vm = this
      if (selection.length === 1) {
        vm.$data.nowItem = util.deepcopy(selection[0])
      } else {
        vm.$data.nowItem = {}
      }
    },
    submitRoles () {
      let subData = {}
      subData.roleName = this.roleInfo.roleName
      subData.roleCode = this.roleInfo.roleCode
      subData.roleDesc = this.roleInfo.roleDesc
      util.clearData(this.roleInfo)
      if (subData.roleName && subData.roleCode) {
        if (this.subAction === 'add') {
          userAuth.rolesAdd.r(subData).then((res) => {
            this.$store.dispatch('allRoles')
            this.$Modal.success({
              title: '提示',
              content: '添加成功'
            })
          }).catch(err => {
            console.log('%O', err)
          })
        }
        if (this.subAction === 'edit') {
          subData.roleId = this.nowItem.roleId
          userAuth.rolesUpdate.r(subData).then((res) => {
            this.$store.dispatch('allRoles')
            this.$Modal.success({
              title: '提示',
              content: '保存成功'
            })
            this.roleInfo = {}
          }).catch(err => {
            console.log('%O', err)
          })
        }
      } else {
        this.$Modal.warning({
          title: '提示',
          content: '提交失败，缺少必填信息'
        })
      }
    },
    submitRes () {
      let vm = this
      let addArr = []
      let delArr = util.deepcopy(vm.nowTreeArr)
      vm.nowTreeArr = []
      console.log('delArr:%O', delArr)
      let resTreeArr = vm.$refs['resTree'].getCheckedNodes()
      resTreeArr.forEach(e => {
        let idx = delArr.findIndex(re => re === e.resourceId)
        if (idx >= 0) {
          delArr.splice(idx, 1)
          let pdx = delArr.findIndex(re => re === e.resourceParentId)
          if (pdx >= 0) {
            delArr.splice(pdx, 1)
          }
        } else {
          if (e.resourceId !== undefined) {
            addArr.push(e.resourceId)
          }
        }
      })
      let bool1 = addArr.length > 0
      let bool2 = delArr.length > 0
      let addData = {
        roleId: vm.nowItem.roleId,
        resources: addArr.join(',')
      }
      let delData = {
        roleId: vm.nowItem.roleId,
        resources: delArr.join(',')
      }
      console.log('add:%O;del:%O', addData, delData)
      if (bool1 && !bool2) {
        userAuth.rrAdd.r(addData).then((res) => {
          console.log('roleAddRes:%O', res)
          vm.$Message.success({
            content: '分配资源成功'
          })
        })
      } else if (!bool1 && bool2) {
        userAuth.rrDelete.r(delData).then((res) => {
          console.log('roleDelRes:%O', res)
          vm.$Message.success({
            content: '分配资源成功'
          })
        })
      } else if (bool1 && bool2) {
        axios.all([userAuth.rrAdd.r(addData), userAuth.rrDelete.r(delData)])
          .then(axios.spread(function (acct, perms) {
            console.log('acct:%O', acct)
            console.log('perms:%O', perms)
            vm.$Message.success({
              content: '分配资源成功'
            })
          }))
      }
    },
    cancelSubmitRole () {
      this.roleInfo = {}
    },
    cancelSubmitRes () {
      this.nowTreeArr = []
    },
    addInfo () {
      util.clearData(this.roleInfo)
      this.roleInfo.roleName = ''
      this.roleInfo.roleCode = ''
      this.roleInfo.roleDesc = ''
      this.subAction = 'add'
      this.showRoleModal = true
    },
    updateInfo () {
      util.clearData(this.roleInfo)
      if (this.nowItem.roleId) {
        this.roleInfo.roleName = this.nowItem.roleName
        this.roleInfo.roleCode = this.nowItem.roleCode
        this.roleInfo.roleDesc = this.nowItem.roleDesc
        this.subAction = 'edit'
        this.showRoleModal = true
      } else {
        this.$Modal.warning({
          title: '提示',
          content: '只能选择一项信息更改'
        })
      }
    },
    removeInfo () {
      let vm = this
      let itemId = vm.nowItem.roleId
      if (itemId) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认删除？',
          onOk: function () {
            userAuth.rolesDelete.r(itemId).then((res) => {
              vm.$store.dispatch('allRoles')
              util.clearData(vm.nowItem)
              vm.$Message.success({
                title: '提示',
                content: '删除成功'
              })
            })
          }
        })
      } else {
        this.$Modal.warning({
          title: '提示',
          content: '只能选择一项信息删除'
        })
      }
    },
    checkTreeNode (checked) {
      console.log('treeChecked:%O', checked)
    },
    distributeRes () {
      let vm = this
      vm.treeData = []
      vm.nowTreeArr = []
      let itemId = vm.nowItem.roleId
      let allAuth = util.deepcopy(vm.authResource)
      if (itemId) {
        vm.treeTitle = vm.nowItem.roleName + '-权限分配'
        userAuth.rrGet.r(itemId).then((res) => {
          let resRes = res.resources || res
          if (Array.isArray(resRes)) {
            allAuth.forEach((e) => {
              // 解决iview不能部分选择的问题
              let idx = resRes.findIndex(re => re.resourceId === e.resourceId)
              let pdx = vm.childNodeArr.findIndex(re => re === e.resourceId)
              e.checked = false
              if (idx >= 0) {
                console.log('resourceId:%O', e)
                vm.nowTreeArr.push(e.resourceId)
              }
              if (idx >= 0 && pdx >= 0) {
                e.checked = true
                console.log('1dxandpdx:%O', e)
              }
            })
            let tdChildren = util.treeBuild(allAuth, 'resourceParentId', 'resourceId', 'children')
            vm.treeData = [{
              expand: true,
              selected: true,
              resourceType: 0,
              resourceName: '报表系统',
              title: '报表系统',
              resourceUri: 'URL路径',
              resourcePermission: '权限字符串',
              resourceDesc: '描述',
              children: tdChildren
            }]
            vm.showResModal = true
          }
        })
      } else {
        vm.$Modal.warning({
          title: '提示',
          content: '只能选择一项信息更改'
        })
      }
    }
  },
  computed: {
    ...mapGetters([
      'authRoles',
      'authResource'
    ]),
    childNodeArr () {
      let res = []
      let allAuth = util.deepcopy(this.authResource)
      allAuth.forEach(e => {
        let idx = allAuth.findIndex(re => re.resourceParentId === e.resourceId)
        if (idx < 0) {
          res.push(e.resourceId)
        }
      })
      return res
    }
  },
  data () {
    return {
      userAuth,
      showRoleModal: false,
      showResModal: false,
      treeTitle: '权限分配',
      treeData: [],
      nowTreeArr: [],
      subAction: '',
      nowItem: {},
      roleInfo: {
        roleName: '',
        roleCode: '',
        roleDesc: ''
      },
      tableColumns: [{
        width: 60,
        type: 'selection',
        fixShow: true
      }, {
        title: '角色名称',
        key: 'roleName',
        align: 'center',
        visible: true,
        width: 150
      }, {
        title: '角色代码',
        key: 'roleCode',
        align: 'center',
        visible: true,
        width: 200
      }, {
        title: '角色描述',
        key: 'roleDesc',
        align: 'center',
        visible: true,
        width: 300
      }]
    }
  }
}
</script>

<style scoped>

</style>
