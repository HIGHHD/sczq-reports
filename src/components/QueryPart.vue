<template>
  <Form :model="queryForm" :label-width="100" label-position="right">
    <Row v-for="(colList, index) in queryFormData" :key="index" type="flex" justify="start" align="top">
      <Col :span="colSpan" v-for="(cItem, cIndex) in colList" :key="cIndex">
        <FormItem :label="cItem.title" v-if="cItem.formElement==='InputText'">
          <Input v-model="queryForm[cItem.paramName]"
                 clearable
                 :placeholder="cItem.title"
                 style="width:200px"></Input>
        </FormItem>
        <FormItem :label="cItem.title" v-if="(cItem.formElement==='MultiSelect1')">
          <Select v-model="queryForm[cItem.paramName]"
                  :multiple="cItem.dataDef.multiple"
                  style="width:200px"
                  filterable clearable>
            <Option v-for="item in cItem.dataDef.enumsData"
                    :value="item.value"
                    :key="item.value">
              {{ item.label }}
            </Option>
          </Select>
        </FormItem>
        <FormItem :label="cItem.title" v-if="(cItem.formElement==='MultiSelect2') && (cItem.dataDef.multiple)">
          <multiple-select @enums-modify="enumsModify"
                           box-type="Tree"
                           :selectData="cItem.dataDef.enumsData"
                           :referName="cItem.paramName">
          </multiple-select>
        </FormItem>
        <FormItem :label="cItem.title" v-if="(cItem.formElement==='MultiSelect3') && (cItem.dataDef.multiple)">
          <multiple-select @enums-modify="enumsModify"
                           :selectData="cItem.dataDef.enumsData"
                           :referName="cItem.paramName">
          </multiple-select>
        </FormItem>
        <FormItem :label="cItem.title" v-if="cItem.formElement==='DatePicker'">
          <DatePicker @on-change="queryForm[cItem.paramName] = $event"
                      :value="queryForm[cItem.paramName]"
                      clearable
                      :format="cItem.dataDef.format || 'yyyy-MM-dd'"
                      :type="cItem.dataDef.type"
                      :placeholder="cItem.title"
                      style="width:200px">
          </DatePicker>
        </FormItem>
        <FormItem v-if="cItem.formElement==='btn'">
          <ButtonGroup style="margin-left: -70px;">
            <Button :type="styleType" icon="ios-search" @click="searchInfo">查询</Button>
            <Button :type="styleType" icon="ios-loop-strong" @click="resetInfo">重置</Button>
            <Button :type="styleType" icon="ios-upload-outline" @click="exportAll">导出</Button>
          </ButtonGroup>
        </FormItem>
      </Col>
    </Row>
  </Form>
</template>

<script>
import {deepcopy, formatDate} from '../assets/js/util'
import MultipleSelect from './MultipleSelect'
export default {
  name: 'QueryPart',
  components: {
    MultipleSelect
  },
  props: {
    pQueryData: {
      type: Array,
      default: () => []
    },
    styleType: {
      type: String,
      default: 'primary'
    }
  },
  data () {
    return {
      queryForm: {},
      queryFormData: []
    }
  },
  watch: {
    pQueryData (newData) {
      this.queryFormData = []
      this.queryForm = {}
      this.$options.methods.renderQueryPart(this, newData)
    }
  },
  computed: {
    colSpan () {
      return this.pQueryData.length <= 3 ? 6 : 8
    }
  },
  methods: {
    searchInfo () {
      let res = deepcopy(this.queryForm)
      this.$emit('btn-search', res)
    },
    resetInfo () {
      this.queryForm = {}
      this.queryFormData = []
      this.$options.methods.renderQueryPart(this, this.pQueryData)
      this.$emit('btn-reset')
    },
    exportAll () {
      this.$emit('btn-exportall')
    },
    enumsModify (param) {
      let name = param.name
      let val = param.value
      this.queryForm[name] = val
    },
    renderQueryPart (ctx, data) {
      let vm = ctx
      let finalList = []
      let sList = deepcopy(data)
      if (sList.length >= 0) {
        sList.push({formElement: 'btn'})
      }
      if (sList.length === 4) {
        buildQueryForm(sList)
        vm.queryFormData = [sList]
      } else {
        for (let i = 0, len = sList.length; i < len; i += 3) {
          let sl = sList.slice(i, i + 3)
          finalList.push(sl)
          buildQueryForm(sl)
        }
        vm.queryFormData = finalList
      }
      function buildQueryForm (list) {
        list.forEach(l => {
          if (l.formElement === 'InputText') {
            vm.$set(vm.queryForm, l.paramName, '')
          } else if (l.formElement === 'MultiSelect1') {
            if (l.dataDef.multiple) {
              vm.$set(vm.queryForm, l.paramName, [])
            } else {
              vm.$set(vm.queryForm, l.paramName, '')
            }
          } else if (l.formElement === 'MultiSelect2') {
            vm.$set(vm.queryForm, l.paramName, [])
          } else if (l.formElement === 'DatePicker') {
            vm.$set(vm.queryForm, l.paramName, formatDate(new Date(), 'yyyy-MM-dd'))
          }
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
