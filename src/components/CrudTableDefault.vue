<template>
  <div style="margin: 10px;">
    <Modal v-model="showCrudModal"
           :mask-closable="false" :closable="false" scrollable
           :title="modalMeta.name" ok-text="保存"
           :width="modalMeta.width + 40"
           @on-ok="submitData" @on-cancel="cancelSubmit">
      <Form :model="queryForm" :label-width="100">
        <Tabs v-if="modalMeta.tabFlag">
          <TabPane v-for="(mTab, tIndex) in tabColList"
                   :key="tIndex"
                   :label="mTab.name"
                   :name="mTab.code">
            <div :style="{ minHeight: modalMeta.minHeight + 'px',
                            overflowY:'auto',
                            maxHeight:modalMeta.maxHeight + 'px',
                            height: modalMeta.height + 'px',
                            width: modalMeta.width + 'px',
                            padding: '5px'
                          }">
              <Row v-for="(cList, rIndex) in mTab.colList"
                   :key="rIndex" type="flex" justify="start" align="top">
                <Col :span="cList[0].dataDef.formatType === 'textarea' ? 24 : (24 / Number.parseInt((modalMeta.columns || 2)+''))"
                     v-for="(cItem, cIndex) in cList" :key="cIndex">
                <FormItem :label="cItem.title" v-if="cItem.formElement.trim()==='InputText'">
                  <Input v-model="queryForm[cItem.key]"
                         clearable
                         :type="cItem.dataDef.formatType || 'text'"
                         :disabled="(editType === 'update') && !cItem.editable"
                         :placeholder="cItem.title"
                         :style="cItem.dataDef.formatType === 'textarea' ? '' : 'width:200px'"></Input>
                </FormItem>
                <FormItem :label="cItem.title" v-if="(cItem.formElement.trim()==='MultiSelect1')">
                  <Select v-model="queryForm[cItem.key]"
                          :multiple="cItem.dataDef.multiple"
                          style="width:200px"
                          :disabled="(editType === 'update') && !cItem.editable"
                          filterable clearable>
                    <Option v-for="item in cItem.dataDef.enumsData"
                            :value="item.value"
                            :key="item.value">
                      {{ item.label }}
                    </Option>
                  </Select>
                </FormItem>
                <FormItem :label="cItem.title" v-if="(cItem.formElement.trim()==='MultiSelect2') && (cItem.dataDef.multiple)">
                  <multiple-select @enums-modify="enumsModify"
                                   :disabled="(editType === 'update') && !cItem.editable"
                                   boxType="Tree"
                                   :selectData="cItem.dataDef.enumsData"
                                   :referName="cItem.key">
                  </multiple-select>
                </FormItem>
                <FormItem :label="cItem.title" v-if="(cItem.formElement.trim()==='MultiSelect3') && (cItem.dataDef.multiple)">
                  <multiple-select @enums-modify="enumsModify"
                                   :disabled="(editType === 'update') && !cItem.editable"
                                   :selectData="cItem.dataDef.enumsData"
                                   :referName="cItem.key">
                  </multiple-select>
                </FormItem>
                <FormItem :label="cItem.title" v-if="cItem.formElement.trim()==='DatePicker'">
                  <DatePicker @on-change="queryForm[cItem.key]=$event"
                              :value="queryForm[cItem.key]"
                              clearable
                              :disabled="(editType === 'update') && !cItem.editable"
                              :format="cItem.dateDef.format"
                              :type="cItem.dateDef.type"
                              :placeholder="cItem.title"
                              style="width:200px">
                  </DatePicker>
                </FormItem>
                </Col>
              </Row>
            </div>
          </TabPane>
        </Tabs>
      </Form>
    </Modal>
    <query-part :pQueryData="queryData"
                @btn-reset="resetInfo"
                @btn-search="searchInfo"
                style="margin-bottom: -15px"
                v-if="showQueryPart"></query-part>
    <Row style="margin: 10px;" type="flex" justify="start" align="top">
      <Col span="24">
      <Card :padding="0"
            icon="ios-list-outline">
        <p slot="title">{{tableDef.tableName || '|'}}</p>
        <div slot="extra">
          <div style="display: inline-block; margin-top: -5px;">
            <ButtonGroup style="display: inline-block;">
              <Button type="primary" v-for="(ac, idx) in actions.filter(a => (a.operation !== 'list') && (a.operation !== 'listPage') && (a.operation !== 'one'))"
                      :icon="ac.icon ? ac.icon : actionsIcons[ac.operation]"
                      :key="idx"
                      @click="triggerActions(ac)">{{ac.label}}</Button>
            </ButtonGroup>
            <i-table-plugin-search v-if="showSearch"
                                   style="margin: 0px 5px 0px 5px;"
                                   :search-width='searchWidth'
                                   :pluginTableData.sync="tableDef.tableData"
                                   :pluginTableColumns.sync="tableDef.tableCol">
            </i-table-plugin-search>
          </div>
          <Dropdown @on-click="exportData" trigger="click">
            <a href="javascript:void(0)">
              <Icon type="ios-upload-outline"></Icon>
              导出
            </a>
            <DropdownMenu slot="list">
              <DropdownItem name="current">当前页</DropdownItem>
              <DropdownItem name="select">选中行</DropdownItem>
              <DropdownItem name="all">所有数据</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <Table :columns="(tableDef.tableCol || []).filter(e => e.visible || e.fixShow)"
               :data="tableDef.tableData"
               :width="tableDef.width"
               :height="tableDef.height"
               border
               @on-selection-change="tableSelectChange">
        </Table>
        <Row style="margin: 10px 0px 10px 0px;" v-if="tableDef.pagenable">
          <Col span="24">
          <Page :total="(tableDef.allData || []).length"
                @on-change="pageChange"
                @on-page-size-change="pageSizeChange"
                placement="top"
                :page-size-opts="[10, 20, 50, 100]"
                style="float: right; margin-right: 20px;"
                show-elevator show-sizer show-total></Page>
          </Col>
        </Row>
      </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
import crudApi from '../api/cruds'
import ITablePluginSearch from './ITablePluginSearch'
import QueryPart from './QueryPart'
import {deepcopy} from '../assets/js/util'
import ExportCsv from '../assets/js/export-csv'
import Csv from '../assets/js/csv'

export default {
  name: 'CrudTableDefault',
  components: {
    ITablePluginSearch,
    QueryPart
  },
  props: {
    styleType: {
      type: String,
      default: 'default'
    },
    showQueryPart: {
      type: Boolean,
      default: true
    },
    crudId: {
      type: String,
      default: ''
    },
    showSearch: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    crudId (newId) {
      this.$options.methods.defTable(this, newId)
    }
  },
  computed: {
    tabColList () {
      let vm = this
      let colSpan = vm.modalMeta.columns
      let fList = deepcopy(vm.modalMeta.fields)
      if (vm.modalMeta.tabFlag) {
        let tList = deepcopy(vm.modalMeta.tabs)
        console.log('tabsFields:%O', vm.modalMeta.fields)
        tList.forEach(te => {
          // let all = fList.filter(fe => (fe.tabIndex + '') === (te.index + ''))
          let all = []
          let textareas = []
          fList.forEach(fe => {
            if ((fe.tabIndex + '') === (te.index + '')) {
              vm.queryFormDefault[fe.key] = fe.dataDef.defaultValue
              if (fe.dataDef.formatType === 'textarea') {
                textareas.push([fe])
              } else {
                all.push(fe)
              }
            }
          })
          te.colList = []
          for (let i = 0, len = all.length; i < len; i += colSpan) {
            te.colList.push(all.slice(i, i + colSpan))
          }
          if (textareas.length > 0) {
            te.colList = te.colList.concat(textareas)
          }
        })
        return tList
      } else {
        return []
      }
    }
  },
  mounted () {
    this.$options.methods.defTable(this, this.crudId)
  },
  data () {
    return {
      queryData: [],
      queryForm: {},
      queryFormDefault: {},
      // tableDef中不用声明默认值，声明会导致ITablePluginSearch没有数据 bug
      tableDef: {},
      searchWidth: 300,
      editType: 'add',
      editDef: {},
      showCrudModal: false,
      editData: {},
      modalMeta: {},
      allData: [],
      selectData: [],
      pageSize: 10,
      pageNum: 1,
      query: {},
      nowTabValue: '',
      actions: [],
      baseUrl: '',
      actionsIcons: {
        add: 'plus',
        delete: 'trash-a',
        update: 'edit',
        other: 'ios-circle-filled'
      }
    }
  },
  methods: {
    defTable (ctx, crudId) {
      let vm = ctx
      vm.actions = []
      vm.baseUrl = ''
      crudApi.crudDef.r(crudId).then((res) => {
        vm.baseUrl = res.baseUrl
        vm.actions = Array.isArray(res.actions) ? res.actions.sort((a, b) => {
          return a.sort - b.sort
        }) : []
        vm.queryData = res.table.queryItems
        vm.modalMeta = res.table.formDefine
        vm.tableDef.width = res.table.width || ''
        vm.tableDef.height = res.table.height || ''
        vm.tableDef.tableName = res.entityTitle
        vm.tableDef.pagenable = res.table.pageFlag || false
        let col = deepcopy(res.table.fields)
        col.unshift({
          width: 60,
          type: 'selection',
          align: 'center',
          fixShow: true
        })
        vm.$set(vm.tableDef, 'tableCol', col)
        vm.$set(vm.tableDef, 'tableData', [])
        vm.queryInfo(vm, {}, true)
        vm.queryInfo(vm, {}, false)
      }).catch(err => {
        console.log('%O', err)
      })
    },
    triggerActions (opt) {
      let vm = this
      if (opt.operation === 'add') {
        vm.$options.methods.actionAdd(vm, opt)
      } else if (opt.operation === 'update') {
        vm.$options.methods.actionUpdate(vm, opt)
      } else if (opt.operation === 'delete') {
        vm.$options.methods.actionDelete(vm, opt)
      } else if (opt.operation === 'other') {
        vm.$options.methods.actionOther(vm, opt)
      } else {}
    },
    actionAdd (ctx, def) {
      let vm = ctx
      vm.editDef = def
      vm.$options.methods.buildModalForm(vm, vm.modalMeta.fields, vm.queryFormDefault)
      vm.editType = 'add'
      vm.nowTabValue = vm.tabColList[0].code
      console.log('tabValue:%O', vm.nowTabValue)
      vm.showCrudModal = true
    },
    actionUpdate (ctx, def) {
      let vm = ctx
      vm.editDef = def
      if (def.primaryKey) {
        if (vm.editData[def.primaryKey]) {
          vm.$options.methods.buildModalForm(vm, vm.modalMeta.fields, vm.editData)
          vm.editType = 'update'
          vm.nowTabValue = vm.tabColList[0].code
          console.log('tabValue:%O', vm.nowTabValue)
          vm.showCrudModal = true
        } else {
          vm.$Modal.warning({
            title: '提示',
            content: '只能选择一项信息更新'
          })
        }
      }
    },
    actionDelete (ctx, def) {
      let vm = ctx
      if (def.primaryKey) {
        if (vm.editData[def.primaryKey]) {
          vm.$Modal.confirm({
            title: '提示',
            content: '<p>确认删除？</p>',
            onOk: () => {
              let param = {
                query: vm.editData[def.primaryKey]
              }
              crudApi.getQuery(def, param, vm.baseUrl, vm.crudId).then(res => {
                vm.queryInfo(vm, vm.query, true)
                vm.queryPage(vm, vm.query, false, vm.pageNum, vm.pageSize)
                vm.editData = {}
              })
            },
            onCancel: () => {
            }
          })
        } else {
          vm.$Modal.warning({
            title: '提示',
            content: '只能选择一项信息删除'
          })
        }
      }
    },
    actionOther (ctx, def) {
      let vm = ctx
      if (def.primaryKey) {
        if (vm.editData[def.primaryKey]) {
          let param = {
            query: vm.editData[def.primaryKey]
          }
          crudApi.getQuery(def, param, vm.baseUrl, vm.crudId).then(res => {
            vm.queryInfo(vm, vm.query, true)
            vm.queryPage(vm, vm.query, false, vm.pageNum, vm.pageSize)
            vm.editData = {}
          })
        } else {
          vm.$Modal.warning({
            title: '提示',
            content: '只能选择一项信息操作'
          })
        }
      } else {
        crudApi.getQuery(def, {}, vm.baseUrl, vm.crudId).then(res => {
          vm.queryInfo(vm, vm.query, true)
          vm.queryPage(vm, vm.query, false, vm.pageNum, vm.pageSize)
          vm.editData = {}
        })
      }
    },
    pageChange (page) {
      this.pageNum = page
      this.queryPage(this, this.query, false, page, this.pageSize)
    },
    pageSizeChange (size) {
      this.pageSize = size
      this.queryPage(this, this.query, false, this.pageNum, size)
    },
    queryInfo (ctx, query, loadAll) {
      let pageNum = ctx.pageNum || 1
      let pageSize = ctx.pageSize || 10
      ctx.queryPage(ctx, query, loadAll, pageNum, pageSize)
    },
    queryPage (ctx, query, loadAll, page, size) {
      let vm = ctx
      let listDef = vm.actions.find(ac => ac.operation === 'list')
      // let pageDef = vm.actions.find(ac => ac.operation === 'listPage')
      let param = {
        query: query,
        loadAll: loadAll,
        pageNo: page,
        pageSize: size
      }
      if (loadAll) {
        crudApi.getQuery(listDef, param, vm.baseUrl, vm.crudId).then((res) => {
          let resArr = Array.isArray(res) ? res : Array.isArray(res.data) ? res.data : []
          vm.$set(vm.tableDef, 'allData', resArr)
          console.log('queryPage-all:%O,params:%O', resArr, param)
        })
      } else {
        crudApi.getQuery(listDef, param, vm.baseUrl, vm.crudId).then((res) => {
          let resArr = Array.isArray(res) ? res : Array.isArray(res.data) ? res.data : []
          vm.$set(vm.tableDef, 'tableData', resArr)
          console.log('queryPage-page:%O,params:%O', resArr, param)
        })
      }
    },
    exportData (name) {
      let exData = {}
      exData.tableName = this.tableDef.tableName || '报表'
      exData.tableCol = this.tableDef.tableCol.filter(fe => {
        return !fe.fixShow
      })
      if (name === 'all') {
        exData.tableData = this.tableDef.allData
      } else if (name === 'current') {
        exData.tableData = this.tableDef.tableData
      } else if (name === 'select') {
        exData.tableData = this.selectData
      }
      this.$Modal.confirm({
        title: '提示',
        content: `将要导出${exData.tableData.length}行数据`,
        onOk: () => {
          let cData = Csv(exData.tableCol, exData.tableData)
          ExportCsv.download(exData.tableName + '.csv', cData)
        }
      })
    },
    tableSelectChange (selection) {
      this.selectData = selection
      if (selection.length === 1) {
        this.editData = deepcopy(selection[0])
      } else {
        this.editData = {}
      }
    },
    searchInfo (query) {
      this.queryInfo(this, query, true)
      this.queryInfo(this, query, false)
      this.query = deepcopy(query)
    },
    resetInfo () {
      this.queryInfo(this, {}, true)
      this.queryInfo(this, {}, false)
      this.query = {}
    },
    submitData () {
      let vm = this
      let subData = {}
      if (vm.editType === 'add') {
        subData = deepcopy(vm.queryForm)
      } else if (vm.editType === 'update') {
        let keys = Object.keys(vm.queryForm)
        for (let item in vm.editData) {
          subData[item] = keys.includes(item) ? vm.queryForm[item] : vm.editData[item]
        }
      }
      let param = {
        query: subData
      }
      crudApi.getQuery(vm.editDef, param, vm.baseUrl, vm.crudId).then(res => {
        vm.queryInfo(vm, vm.query, true)
        vm.queryPage(vm, vm.query, false, vm.pageNum, vm.pageSize)
        vm.editDef = {}
      }).catch(err => {
        console.log('suberr: %O', err)
        vm.editDef = {}
      })
    },
    cancelSubmit () {
      this.showCrudModal = false
    },
    buildModalForm (vm, list, data) {
      list.forEach(l => {
        let type = l.formElement.trim()
        if (type === 'InputText') {
          let val = data ? data[l.key] : ''
          vm.$set(vm.queryForm, l.key, val)
        } else if (type === 'MultiSelect1') {
          if (l.dataDef.multiple) {
            let val = data ? data[l.key] : []
            vm.$set(vm.queryForm, l.key, val)
          } else {
            let val = data ? data[l.key] : ''
            vm.$set(vm.queryForm, l.key, val)
          }
        } else if (type === 'MultiSelect2') {
          let val = data ? data[l.key] : []
          vm.$set(vm.queryForm, l.key, val)
        } else if (type === 'DatePicker') {
          let val = data ? data[l.key] : ''
          vm.$set(vm.queryForm, l.key, '')
        }
      })
    },
    // 自定义多选的触发事件
    enumsModify (param) {
      let name = param.name
      let val = param.value
      this.queryForm[name] = val
    }
  }
}
</script>

<style scoped>
</style>
