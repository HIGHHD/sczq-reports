<template>
  <div style="margin-top: 20px;">
    <Modal :closable="false" v-model="showAuthModal"
           :mask-closable="false"
           title="编辑权限资源"
           scrollable
           width="600"
           @on-ok="submitAuth" @on-cancel="cancelSubmit">
      <Form :model="authInfo" :label-width="100">
        <FormItem label="上级菜单" v-show="subAction==='add'">
          <Input type="text"
                 disabled
                 v-model="authInfo.parentName"></Input>
        </FormItem>
        <FormItem label="资源名称">
          <Input type="text"
                 required
                 v-model="authInfo.resourceName" placeholder="资源名称"></Input>
        </FormItem>
        <FormItem label="资源类型">
          <Select v-model="authInfo.resourceType">
            <Option v-for="te in resourceTypeEnum"
                    :value="te.value"
                    :key="te.value">
              {{ te.label }}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="URL路径">
          <Input type="text"
                 v-model="authInfo.resourceUri" placeholder="URL路径"></Input>
        </FormItem>
        <FormItem label="权限字符串">
          <Input type="text"
                 v-model="authInfo.resourcePermission" placeholder="权限字符串"></Input>
        </FormItem>
        <FormItem label="描述">
          <Input type="text"
                 v-model="authInfo.resourceDesc" placeholder="描述..."></Input>
        </FormItem>
      </Form>
    </Modal>
    <Button type="primary" icon="ios-loop-strong" @click="refreshInfo">刷新</Button>
    <Tree :data="treeData" :render="renderContent"></Tree>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import userAuth from '../../../api/userAuth'
import * as util from '../../../assets/js/util'

export default {
  name: 'AuthManager',
  computed: {
    ...mapGetters([
      'authResource'
    ]),
    treeData () {
      let res = util.treeBuild(this.authResource, 'resourceParentId', 'resourceId', 'children')
      return [{
        expand: true,
        resourceType: 0,
        resourceName: '报表系统',
        parentName: '报表系统',
        resourceUri: 'URL路径',
        resourcePermission: '权限字符串',
        resourceDesc: '描述',
        children: res
      }]
    }
  },
  methods: {
    refreshInfo () {
      this.$store.dispatch('allResource')
    },
    addNode (data) {
      let vm = this
      util.clearData(vm.authInfo)
      vm.authInfo.resourceType = 1
      vm.authInfo.resourceName = ''
      vm.authInfo.resourceUri = ''
      vm.authInfo.resourcePermission = ''
      vm.authInfo.resourceDesc = ''
      vm.authInfo.resourceParentId = data.resourceParentId
      vm.authInfo.resourceId = data.resourceId
      vm.authInfo.parentName = data.parentName
      vm.subAction = 'add'
      vm.showAuthModal = true
    },
    editNode (data) {
      let vm = this
      util.clearData(vm.authInfo)
      vm.authInfo.resourceType = data.resourceType
      vm.authInfo.resourceName = data.resourceName
      vm.authInfo.resourceUri = data.resourceUri
      vm.authInfo.resourcePermission = data.resourcePermission
      vm.authInfo.resourceDesc = data.resourceDesc
      vm.authInfo.resourceParentId = data.resourceParentId
      vm.authInfo.resourceId = data.resourceId
      vm.authInfo.parentName = data.parentName
      vm.subAction = 'edit'
      vm.showAuthModal = true
    },
    deleteNode (data) {
      let vm = this
      vm.$Modal.confirm({
        title: '提示',
        content: '确认删除？',
        onOk: function () {
          userAuth.resourceDelete.r(data.resourceId).then((res) => {
            vm.$store.dispatch('allResource')
            vm.$Message.success({
              title: '提示',
              content: '删除成功'
            })
          })
        }
      })
    },
    submitAuth () {
      let subData = {}
      subData.resourceName = this.authInfo.resourceName
      subData.resourceType = this.authInfo.resourceType
      subData.resourceUri = this.authInfo.resourceUri
      subData.resourcePermission = this.authInfo.resourcePermission
      subData.resourceDesc = this.authInfo.resourceDesc
      if (subData.resourceName) {
        if (this.subAction === 'add') {
          subData.resourceParentId = this.authInfo.resourceId
          util.clearData(this.authInfo)
          userAuth.resourceAdd.r(subData).then((res) => {
            this.$store.dispatch('allResource')
            this.$Modal.success({
              title: '提示',
              content: '保存成功'
            })
          })
        }
        if (this.subAction === 'edit') {
          subData.resourceId = this.authInfo.resourceId
          util.clearData(this.authInfo)
          userAuth.resourceUpdate.r(subData).then((res) => {
            this.$store.dispatch('allResource')
            this.$Modal.success({
              title: '提示',
              content: '保存成功'
            })
          })
        }
      } else {
        this.$Modal.warning({
          title: '提示',
          content: '保存失败，缺少必填信息'
        })
      }
    },
    cancelSubmit () {
      util.clearData(this.authInfo)
    },
    renderContent (h, { root, node, data }) {
      let bool1 = data.resourceType === 1
      let bool2 = data.resourceType === 2
      let typeIcon = bool1 ? 'ios-folder-outline' : bool2 ? 'ios-paper-outline' : 'ios-folder-outline'
      let typeText = bool1 ? '菜单' : bool2 ? '权限' : '类型'
      let addBtn = h('Button', {
        props: Object.assign({}, this.buttonProps, {
          icon: 'ios-plus-empty',
          type: 'primary'
        }),
        on: {
          click: () => { this.addNode(data) }
        }
      }, '增加子节点')
      let editBtn = h('Button', {
        props: Object.assign({}, this.buttonProps, {
          icon: 'edit',
          type: 'warning'
        }),
        on: {
          click: () => { this.editNode(data) }
        }
      }, '修改')
      let delBtn = h('Button', {
        props: Object.assign({}, this.buttonProps, {
          icon: 'ios-minus-empty',
          type: 'error'
        }),
        on: {
          click: () => { this.deleteNode(data) }
        }
      }, '删除')
      function btnf () {
        if (bool1) {
          if (Array.isArray(data.children) && data.children) {
            return [addBtn, editBtn]
          } else {
            return [addBtn, editBtn, delBtn]
          }
        } else if (bool2) {
          return [editBtn, delBtn]
        } else {
          return [addBtn]
        }
      }
      let btns = btnf()
      return h('span', {
        style: {
          display: 'inline-block',
          width: '100%',
          marginBottom: '6px',
          paddingBottom: '6px',
          borderBottom: '1px solid #e9e9e9'
        }
      }, [
        h('span', {
          style: {
            width: '20%',
            marginRight: '30px'
          }
        }, [
          h('Icon', {
            props: {
              type: typeIcon
            },
            style: {
              marginRight: '8px'
            }
          }),
          h('span', data.resourceName)
        ]),
        h('span', {
          style: {
            display: 'inline-block',
            float: 'right',
            width: '80%'
          }
        }, [
          h('Row', [
            h('Col', {
              props: {
                span: 2
              }
            }, typeText),
            h('Col', {
              props: {
                span: 4
              }
            }, data.resourceUri || '...'),
            h('Col', {
              props: {
                span: 6
              }
            }, data.resourcePermission || '...'),
            h('Col', {
              props: {
                span: 6
              }
            }, data.resourceDesc || '...'),
            h('Col', {
              props: {
                span: 6
              }
            }, [
              h('ButtonGroup', btns)
            ])
          ])
        ])
      ])
    }
  },
  data () {
    return {
      showAuthModal: false,
      subAction: '',
      resourceTypeEnum: [{
        label: '菜单',
        value: 1
      }, {
        label: '权限',
        value: 2
      }],
      authInfo: {
        resourceId: '',
        resourceType: 1,
        resourceName: '',
        resourceUri: '',
        resourcePermission: '',
        resourceDesc: '',
        resourceParentId: '',
        parentName: ''
      },
      buttonProps: {
        size: 'small'
      }
    }
  }
}
</script>

<style scoped>

</style>
