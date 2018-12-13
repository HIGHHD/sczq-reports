<template>
  <div style="position: relative; display: inline-block">
    <span style="margin-right: 5px; display: inline-block">
      <Dropdown trigger="click">
        <Button :type="styleType">
          <Icon type="grid"></Icon>
          <Icon type="arrow-down-b"></Icon>
        </Button>
        <DropdownMenu slot="list">
          <Table :columns="dropDownColumns"
                 :data="tableColumnsClone.filter(e => {e._checked = e.visible; return !e.fixShow})"
                 height="300"
                 @on-selection-change="dropSelectChange">
          </Table>
        </DropdownMenu>
      </Dropdown>
    </span>
    <span  style="display: inline-block" v-if="showSearch">
      <Input :placeholder="tableSearchColumns.map(e => e.title).join('/')"
             :style="'width:'+searchWidth+'px;'"
             icon="ios-search"
             @on-click="handleSearch"
             @on-blur="onBlurEvent"
             v-model="searchContent"
             @on-enter="handleSearch">
      </Input>
    </span>
  </div>
</template>
<script>
/* 使用步骤：
 *  1.需要搜索的tableColumns,需要fixShow、visible属性, fixShow表示selection、expend等type的列
 *  2.组件属性pluginTableData.sync=目标tabledata、同理pluginTableColumns
 *  3.目标table tableColumns=tableColumns.filter(e => e.visible || e.fixShow)
 */
export default {
  name: 'ITablePluginSearch',
  props: {
    pluginTableData: {
      type: Array,
      default: () => []
    },
    pluginTableColumns: {
      type: Array,
      default: () => []
    },
    styleType: {
      type: String,
      default: 'default'
    },
    showSearch: {
      type: Boolean,
      default: true
    },
    searchWidth: {
      type: Number || String,
      default: 300
    }
  },
  data () {
    return {
      searchColumns: [],
      tableDataClone: this.pluginTableData,
      tableColumnsClone: this.pluginTableColumns,
      searchContent: '',
      dropDownColumns: [{
        type: 'selection',
        width: 60,
        align: 'center'
      }, {
        title: '列名',
        key: 'title',
        align: 'center',
        width: 150
      }]
    }
  },
  methods: {
    search: function (data, argumentObj) {
      let res = data
      let dataClone = data
      res = dataClone.filter(d => {
        let bool = false
        for (let argu in argumentObj) {
          if (argumentObj[argu].length > 0) {
            if (typeof d[argu] === 'string') {
              bool = bool || d[argu].indexOf(argumentObj[argu]) > -1
            }
          }
        }
        return bool
      })
      return res
    },
    handleSearch () {
      let vm = this
      let finalObj = {}
      vm.tableSearchColumns.map(e => e.key).forEach(function (item) {
        finalObj[item] = vm.searchContent
      })
      let res = this.search(this.tableDataClone, finalObj) // 执行搜索，获取搜索结果
      console.log('searchplugin-res:%O', res)
      this.$emit('update:pluginTableData', res) // 更新表格数据为搜索结果
    },
    onBlurEvent () {
      if (!this.searchContent) {
        this.$emit('on-blur-search')
      }
    },
    dropSelectChange (selection) {
      let nowShowColumns = selection
      let vm = this
      vm.tableColumnsClone.forEach(e => {
        let idx = nowShowColumns.findIndex(de => de.key === e.key)
        if (idx > -1) {
          e.visible = true
        } else {
          e.visible = false
        }
      })
      this.$emit('update:pluginTableColumns', vm.tableColumnsClone)
    }
  },
  watch: {
    pluginTableData (newTableData) {
      if (newTableData.length > 0 && this.tableDataClone.length === 0) {
        this.tableDataClone = newTableData
      }
    },
    pluginTableColumns (newData) {
      this.tableColumnsClone = newData
    }
  },
  computed: {
    tableSearchColumns () {
      return this.tableColumnsClone.filter(e => e.visible)
    }
  }
}
</script>

<style scoped>
</style>
