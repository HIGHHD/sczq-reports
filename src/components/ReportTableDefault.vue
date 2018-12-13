<template>
  <div style="margin: 10px;" v-if="reportId !== 'CRPT0001' && reportId !== 'CRPT0002'">
    <query-part :pQueryData="queryData"
                @btn-reset="resetInfo"
                @btn-search="searchInfo"
                @btn-exportall="exportAll"
                style="margin-bottom: -10px"
                v-if="showQueryPart"></query-part>
    <Row v-for="(colList, index) in reportList" :key="index" :gutter="16"
         style="margin-bottom: 10px;" type="flex" justify="start" align="top">
      <Col :span="colSpan" v-for="(cItem, cIndex) in colList" :key="cIndex">
        <Card :title="cItem.reportName" :padding="0"
              icon="ios-list-outline">
          <div slot="extra">
            <!--此处pluginTableData.sync不能使用cItem写，导致不能更新，但pluginTableColumns.sync可以用cItem写，可以更新
            保险起见改为一个格式-->
            <div style="display: inline-block; margin-top: -5px;">
              <i-table-plugin-search v-if="showSearch"
                                     style="margin: 0px 5px 0px 5px;"
                                     :search-width='searchWidth'
                                     :pluginTableData.sync="reportList[index][cIndex].reportData"
                                     :pluginTableColumns.sync="reportList[index][cIndex].reportCol">
              </i-table-plugin-search>
            </div>
            <Dropdown @on-click="exportData" trigger="click">
              <a href="javascript:void(0)" @click.prevent="locationMe(index, cIndex)">
                <Icon type="ios-upload-outline"></Icon>
              导出
              </a>
              <DropdownMenu slot="list">
                <DropdownItem name="current">当前页</DropdownItem>
                <DropdownItem name="all">所有数据</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          <Table :columns="cItem.reportCol.filter(e => e.visible || e.fixShow)"
                 :data="cItem.reportData"
                 :width="cItem.width"
                 :height="cItem.height"
                 :loading="cItem.isLoading"
                 stripe
                 border>
            <div slot="footer" style="margin: 3px 10px 3px 10px;">
              <Row type="flex" justify="end" align="top">
                <Col span="8" v-for="(expData, exIndex) in cItem.extendData" :key="exIndex">
                  <Row type="flex" justify="end" align="top"
                       style="text-align: right; margin: 0px 20px 0px 20px; font-size: 14px;">
                    <Col span="12">
                      <strong>{{ expData.label }}：</strong>
                    </Col>
                    <Col span="12">
                      <strong>{{ expData.showValue }}</strong>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </Table>
          <Row style="margin: 10px 0px 10px 0px;" v-if="cItem.pagenable">
            <Col span="24">
            <Page :total="cItem.allData.length"
                  :current.sync="pageCurrent[index + '-' + cIndex]"
                  @click.native="locationMe(index, cIndex)"
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
  <div v-else-if="reportId === 'CRPT0001'">
    <custom-one></custom-one>
  </div>
  <div v-else-if="reportId === 'CRPT0002'">
    <custom-two></custom-two>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import reportsApi from '../api/reports'
import ITablePluginSearch from './ITablePluginSearch'
import QueryPart from './QueryPart'
import {deepcopy, exportXls, exportTableStr} from '../assets/js/util'
import ExportCsv from '../assets/js/export-csv'
import Csv from '../assets/js/csv'
import * as numeral from 'numeral'
import 'numeral/locales'

import CustomOne from '../views/main/reports/CustomOne'
import CustomTwo from '../views/main/reports/CustomTwo'

export default {
  name: 'ReportTableDefault',
  components: {
    ITablePluginSearch,
    'i-table-plugin-search': ITablePluginSearch,
    'query-part': QueryPart,
    CustomOne,
    CustomTwo
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
    reportId: {
      type: String,
      default: ''
    },
    showSearch: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    reportId (newId) {
      this.reportList = [[]]
      if (newId !== 'CRPT0001' && newId !== 'CRPT0002') {
        this.$options.methods.defTable(this, newId)
        this.pageCurrent = 1
      }
    }
  },
  mounted () {
    numeral.locale('chs')
    if (this.reportId !== 'CRPT0001' && this.reportId !== 'CRPT0002') {
      this.$options.methods.defTable(this, this.reportId)
    }
  },
  data () {
    return {
      queryData: [],
      reportList: [],
      colSpan: 24,
      searchWidth: 300,
      editType: 'add',
      modalMeta: {},
      tableLoca: {
        idx: 0,
        cIdx: 0
      },
      pageSize: 10,
      pageNum: 1,
      query: {},
      pageCurrent: {},
      thisReportName: ''
    }
  },
  methods: {
    defTable (ctx, reportId) {
      let vm = ctx
      reportsApi.reportDef.r(reportId).then((res) => {
        console.log('reportDef: %O', res)
        vm.thisReportName = res.reportName
        if (res.table.queryItems) {
          vm.queryData = []
          vm.queryData = res.table.queryItems
        } else {
          vm.queryData = []
        }
        if (res.reports && res.reports.length > 1) {
          let allList = []
          let splitStep = res.columns || 2
          vm.colSpan = 24 / Number.parseInt((res.columns || 2) + '')
          vm.searchWidth = 200
          res.reports.forEach(e => {
            let item = {}
            item.reportId = e.reportId
            item.reportName = e.reportName
            item.width = e.table.width || ''
            item.height = e.table.height || ''
            // item.reportCol = deepcopy(e.table.fields)
            let col = deepcopy(e.table.fields)
            let extendIdx = 0
            col.forEach((ce, idx, arr) => {
              ce.align = ce.align || 'center'
              if (ce.dataType === 'array') {
                extendIdx = idx
                if (e.subQueryFlag) {
                  ce.subColumns = e.subReport.table.fields
                  ce.subColumns.align = ce.subColumns.align || 'center'
                  ce.subWidth = e.subReport.table.width || 800
                  ce.fixShow = true
                  ce.width = ce.width || 120
                  ce.type = 'expand'
                  ce.render = (h, params) => {
                    return h('Table', {
                      props: {
                        width: ce.subWidth,
                        columns: ce.subColumns,
                        data: params.row[ce.key]
                      }
                    })
                  }
                }
              }
              if (ce.dataFormat) {
                ce.render = vm.$options.methods.defRender(vm, ce.key, ce.dataFormat)
              }
            })
            if (e.subQueryFlag) {
              col.splice(0, 0, col.splice(extendIdx, 1)[0])
            }
            item.reportCol = col.filter(e => !e.subQueryFlag)
            item.pagenable = e.table.pageFlag || false
            item.reportData = []
            item.allData = []
            item.extendFields = e.table.extendQueryFlag ? (e.table.extendFields || []) : []
            allList.push(item)
          })
          let finalList = []
          for (let i = 0, len = allList.length; i < len; i += splitStep) {
            finalList.push(allList.slice(i, i + splitStep))
          }
          vm.reportList = finalList
          console.log('group:%O', finalList)
        } else {
          vm.colSpan = 24 / Number.parseInt((res.columns || 1) + '')
          vm.searchWidth = 300
          let item = {}
          item.reportId = res.reportId
          item.reportName = res.reportName
          item.width = res.table.width || ''
          item.height = res.table.height || ''
          let col = deepcopy(res.table.fields)
          let extendIdx = 0
          col.forEach((ce, idx, arr) => {
            ce.align = ce.align || 'center'
            if (ce.dataType === 'array') {
              extendIdx = idx
              if (res.subQueryFlag) {
                ce.subColumns = res.subReport.table.fields
                ce.subColumns.align = ce.subColumns.align || 'center'
                ce.subWidth = res.subReport.table.width || 800
                ce.fixShow = true
                ce.type = 'expand'
                ce.width = ce.width || 120
                ce.render = (h, params) => {
                  return h('Table', {
                    props: {
                      width: ce.subWidth,
                      columns: ce.subColumns,
                      data: params.row[ce.key]
                    }
                  })
                }
              }
            }
            if (ce.dataFormat) {
              ce.render = vm.$options.methods.defRender(vm, ce.key, ce.dataFormat)
            }
          })
          if (res.subQueryFlag) {
            col.splice(0, 0, col.splice(extendIdx, 1)[0])
          }
          item.reportCol = col.filter(e => !e.subQueryFlag)
          item.pagenable = res.table.pageFlag || false
          item.reportData = []
          item.allData = []
          item.extendFields = res.table.extendQueryFlag ? (res.table.extendFields || []) : []
          vm.reportList = [[item]]
          console.log('single:%O', vm.reportList)
        }
        vm.queryInfo(vm, {}, true)
        vm.queryInfo(vm, {}, false)
      }).catch(err => {
        console.log('%O', err)
      })
    },
    defRender (ctx, rowFlag, formate) {
      let func = (h, params) => {
        if (!isNaN(params.row[rowFlag])) {
          return h('span', numeral(params.row[rowFlag]).format(formate))
        } else {
          return h('span', params.row[rowFlag])
        }
      }
      return func
    },
    exportData (name) {
      let item = this.reportList[this.tableLoca.idx][this.tableLoca.cIdx]
      let exData = {}
      exData.reportId = item.reportId
      exData.reportName = item.reportName || '报表'
      exData.reportCol = item.reportCol.filter(fe => {
        return (!fe.fixShow || fe.type === 'expand')
      })
      let expData = item.extendData
      if (name === 'all') {
        exData.reportData = item.allData
      } else if (name === 'current') {
        exData.reportData = item.reportData
      }
      this.$Modal.confirm({
        title: '提示',
        content: `将要导出${exData.reportData.length}行数据`,
        onOk: () => {
          exportXls(exData.reportName, exportTableStr(exData.reportId, exData.reportName, exData.reportCol, exData.reportData, item.extendData))
        }
      })
    },
    exportAll () {
      let xlsStr = ''
      this.reportList.forEach(r => {
        r.forEach(e => {
          let exData = {}
          exData.reportId = e.reportId
          exData.reportName = e.reportName || '报表'
          exData.reportCol = e.reportCol.filter(fe => {
            return (!fe.fixShow || fe.type === 'expand')
          })
          exData.reportData = e.allData
          xlsStr += exportTableStr(exData.reportId, exData.reportName, exData.reportCol, exData.reportData, e.extendData)
        })
      })
      exportXls(this.thisReportName, xlsStr)
    },
    exportData2 (name) {
      let item = this.reportList[this.tableLoca.idx][this.tableLoca.cIdx]
      console.log('exportItem: %O', item)
      let exData = {}
      exData.reportName = item.reportName || '报表'
      exData.reportCol = item.reportCol.filter(fe => {
        return (!fe.fixShow || fe.type === 'expand')
      })
      let expKey = ''
      let expIdx = exData.reportCol.findIndex(e => {
        if (e.type === 'expand') {
          expKey = e.key
          return true
        }
        return false
      })
      if (expIdx >= 0) {
        exData.reportCol.splice(expIdx, 0, ...(exData.reportCol.splice(expIdx, 1)[0].subColumns))
      }
      function makeSubData (mData) {
        mData.forEach(ed => {
          console.log('expData:%O', ed[expKey])
          ed[expKey].forEach(e => {
            Object.keys(e).forEach(ek => {
              if (ed[ek] === undefined) {
                ed[ek] = ''
              } else {
                if (e[ek] !== undefined) {
                  ed[ek] = ed[ek] + e[ek] + '   '
                }
              }
            })
          })
        })
      }

      let expData = item.extendData
      if (name === 'all') {
        exData.reportData = item.allData
        if (expKey) {
          makeSubData(exData.reportData)
        }
        expData.forEach(ex => {
          exData.reportData.push({
            [exData.reportCol[0].key]: ex.label,
            [exData.reportCol[exData.reportCol.length - 1].key]: ex.value
          })
        })
      } else if (name === 'current') {
        exData.reportData = item.reportData
        if (expKey) {
          makeSubData(exData.reportData)
        }
        expData.forEach(ex => {
          exData.reportData.push({
            [exData.reportCol[0].key]: ex.label,
            [exData.reportCol[exData.reportCol.length - 1].key]: ex.value
          })
        })
      }
      this.$Modal.confirm({
        title: '提示',
        content: `将要导出${exData.reportData.length}行数据`,
        onOk: () => {
          let cData = Csv(exData.reportCol, exData.reportData)
          ExportCsv.download(exData.reportName + '.csv', cData)
        }
      })
    },
    queryInfo (ctx, query, loadAll) {
      let vm = ctx
      let qBool = true
      let keys = Object.keys(query)
      for (let i = keys.length - 1; i >= 0; i--) {
        qBool = query[keys[i]] && qBool
      }
      if (qBool) {
        vm.reportList.forEach((e, idx, arr) => {
          e.forEach((ee, eIdx, eArr) => {
            let pageNum = vm.pageNum || 1
            let pageSize = vm.pageSize || 10
            vm.queryPage(vm, {idx: idx, cIdx: eIdx}, query, loadAll, pageNum, pageSize)
          })
        })
      } else {
        ctx.$Modal.warning({
          title: '提示',
          content: '查询参数不能为空'
        })
      }
    },
    queryPage (ctx, loca, query, loadAll, page, size) {
      let vm = ctx
      let item = vm.reportList[loca.idx][loca.cIdx]
      item.isLoading = true
      let params = {
        reportId: item.reportId,
        query: query,
        loadAll: loadAll,
        pageNo: page,
        pageSize: size
      }
      if (loadAll) {
        reportsApi.reportData.r(params).then((res) => {
          let resArr = Array.isArray(res) ? res : Array.isArray(res.data) ? res.data : []
          item.allData = resArr
          item.isLoading = false
          let expArr = Array.isArray(res.extendData) ? res.extendData : []
          item.extendData = []
          if (expArr.length > 0) {
            if (item.extendFields.length > 0) {
              item.extendFields.forEach(ex => {
                expArr.forEach(ea => {
                  Object.keys(ea).forEach(ek => {
                    if (ex.key === ek) {
                      item.extendData.push({
                        label: ex.title,
                        value: ea[ek],
                        showValue: numeral(ea[ek]).format('$0,0.00')
                      })
                    }
                  })
                })
              })
            } else {
              expArr.forEach(ea => {
                console.log('ea:%O', ea)
                Object.keys(ea).forEach(ek => {
                  item.extendData.push({
                    label: '合计',
                    value: ea[ek],
                    showValue: numeral(ea[ek]).format('$0,0.00')
                  })
                })
              })
            }
          }
        })
      } else {
        reportsApi.reportData.r(params).then((res) => {
          let resArr = Array.isArray(res) ? res : Array.isArray(res.data) ? res.data : []
          item.reportData = resArr
          item.isLoading = false
          let expArr = Array.isArray(res.extendData) ? res.extendData : []
          item.extendData = []
          if (expArr.length > 0) {
            if (item.extendFields.length > 0) {
              item.extendFields.forEach(ex => {
                expArr.forEach(ea => {
                  Object.keys(ea).forEach(ek => {
                    if (ex.key === ek) {
                      item.extendData.push({
                        label: ex.title,
                        value: ea[ek],
                        showValue: numeral(ea[ek]).format('$0,0.00')
                      })
                    }
                  })
                })
              })
            } else {
              expArr.forEach(ea => {
                console.log('ea:%O', ea)
                Object.keys(ea).forEach(ek => {
                  item.extendData.push({
                    label: '合计',
                    value: ea[ek],
                    showValue: numeral(ea[ek]).format('$0,0.00')
                  })
                })
              })
            }
          }
        })
      }
    },
    searchInfo (query) {
      this.pageNum = 1
      this.pageSize = 10
      this.queryInfo(this, query, true)
      this.queryInfo(this, query, false)
      this.pageCurrent = {}
      this.query = deepcopy(query)
    },
    resetInfo () {
      this.pageNum = 1
      this.pageSize = 10
      this.queryInfo(this, {}, true)
      this.queryInfo(this, {}, false)
      this.pageCurrent = {}
      this.query = {}
    },
    pageChange (page) {
      this.pageNum = page
      this.queryPage(this, this.tableLoca, this.query, false, page, this.pageSize)
    },
    pageSizeChange (size) {
      this.pageSize = size
      this.queryPage(this, this.tableLoca, this.query, false, this.pageNum, size)
      console.log('pagesize: %O', size)
    },
    locationMe (idx, cIdx) {
      this.tableLoca.idx = idx
      this.tableLoca.cIdx = cIdx
      this.pageCurrent[idx + '-' + cIdx] = 1
    }
  }
}
</script>

<style scoped>
  .clear-fix:after {
    display: block;
    visibility: hidden;
    height: 0;
    content: " ";
    clear: both;
  }

  .clear-fix {
    zoom: 1;
  }

  .float-p {
    float: left;
    width: 100px;
    height: 100px;
    margin: 20px;
    background-color: green;
  }
</style>
