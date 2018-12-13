<template>
  <Dropdown trigger="click">
    <Button :type="styleType" :disabled="disabled">
      {{ btnText }}
      <Icon type="arrow-down-b"></Icon>
    </Button>
    <DropdownMenu slot="list">
      <div style="min-height:40px;overflow-y:auto;max-height:300px;padding: 5px;">
        <div v-if="boxType === 'CheckboxGroup'"
          style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
          <Checkbox
            :indeterminate="indeterminate"
            :value="checkAll"
            @click.prevent.native="handleCheckAll">{{checkAll ? '全不选' : '全选'}}</Checkbox>
        </div>
        <CheckboxGroup v-model="returnArray"
                       v-if="boxType === 'CheckboxGroup'"
                       @on-change="cgChange">
          <Checkbox v-for="cItem in selectData"
                    :label="cItem.value"
                    :key="cItem.value">
            <span>{{cItem.label}}</span>
          </Checkbox>
        </CheckboxGroup>
        <Tree :data="treeData"
              v-if="boxType === 'Tree'"
              @on-check-change="checkTreeNode"
              show-checkbox multiple></Tree>
      </div>
    </DropdownMenu>
  </Dropdown>
</template>

<script>
import * as util from '../assets/js/util'
export default {
  name: 'MultipleSelect',
  props: {
    selectData: {
      type: Array,
      default: () => []
    },
    referName: {
      type: String,
      default: ''
    },
    styleType: {
      type: String,
      default: 'default'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    boxType: {
      type: String,
      default: 'CheckboxGroup'
    }
  },
  data () {
    return {
      returnArray: [],
      indeterminate: false,
      checkAll: false,
      preSelects: [
        '/reports/GRPT0001',
        '/reports/RPT0024',
        '/reports/RPT0023',
        '/reports/GRPT0007',
        '/reports/GRPT0008'
      ]
    }
  },
  computed: {
    btnText () {
      let vm = this
      let fData = util.deepcopy(vm.selectData)
      if (vm.returnArray.length > 0) {
        let selected = fData.filter(e => {
          let idx = vm.returnArray.findIndex(fe => fe === e.value)
          return idx > -1
        }).map(e => e.label)
        let txt = selected.join(',').slice(0, 12) + '...'
        return txt
      } else {
        return '请选择'
      }
    },
    treeData () {
      let fData = util.deepcopy(this.selectData)
      return util.buildMultiSelect(fData)
    }
  },
  methods: {
    handleCheckAll () {
      if (this.indeterminate) {
        this.checkAll = false
      } else {
        this.checkAll = !this.checkAll
      }
      this.indeterminate = false
      if (this.checkAll) {
        this.returnArray = this.selectData.map(e => e.value)
      } else {
        this.returnArray = []
      }
      let param = {
        name: this.referName,
        value: this.returnArray
      }
      this.$emit('enums-modify', param)
    },
    cgChange (arr) {
      if (arr.length === this.selectData.length) {
        this.indeterminate = false
        this.checkAll = true
      } else if (arr.length > 0) {
        this.indeterminate = true
        this.checkAll = false
      } else {
        this.indeterminate = false
        this.checkAll = false
      }
      let param = {
        name: this.referName,
        value: this.returnArray
      }
      this.$emit('enums-modify', param)
    },
    checkTreeNode (checked) {
      console.log('treeChecked:%O', checked)
      let vm = this
      vm.returnArray = []
      checked.forEach(x => {
        vm.returnArray.push(x.value)
      })
      let param = {
        name: this.referName,
        value: this.returnArray
      }
      console.log('treeCheckedParam:%O', param)
      this.$emit('enums-modify', param)
    }
  },
  watch: {
    '$route' () {
      console.log('multi-route:%O', this.$route.path)
      let vm = this
      if (vm.preSelects.indexOf(vm.$route.path) > -1) {
        this.returnArray = ['JYB_NBZJ', 'LH_NBZJ', 'LH_NBZJ_ZJYW', 'ZY_NBZJ', 'ZY_NBZJ_ZJYW']
        this.indeterminate = true
        this.checkAll = false
      } else {
        this.returnArray = []
        this.indeterminate = false
        this.checkAll = false
      }
      let param = {
        name: this.referName,
        value: this.returnArray
      }
      this.$emit('enums-modify', param)
    },
    'selectData' (newValue) {
      console.log('multi-selectData:%O', newValue)
      let vm = this
      if (vm.preSelects.indexOf(vm.$route.path) > -1) {
        this.returnArray = ['JYB_NBZJ', 'LH_NBZJ', 'LH_NBZJ_ZJYW', 'ZY_NBZJ', 'ZY_NBZJ_ZJYW']
        this.indeterminate = true
        this.checkAll = false
      } else {
        this.returnArray = []
        this.indeterminate = false
        this.checkAll = false
      }
      let param = {
        name: this.referName,
        value: this.returnArray
      }
      this.$emit('enums-modify', param)
    }
  },
  created () {
    let vm = this
    if (vm.preSelects.indexOf(vm.$route.path) > -1) {
      this.returnArray = ['JYB_NBZJ', 'LH_NBZJ', 'LH_NBZJ_ZJYW', 'ZY_NBZJ', 'ZY_NBZJ_ZJYW']
      this.indeterminate = true
      this.checkAll = false
    } else {
      this.returnArray = []
      this.indeterminate = false
      this.checkAll = false
    }
    let param = {
      name: this.referName,
      value: this.returnArray
    }
    this.$emit('enums-modify', param)
  }
}
</script>

<style scoped>

</style>
