<template>
  <div style="margin: 10px;">
    <query-part :pQueryData="queryData"
                @btn-reset="resetInfo"
                @btn-search="searchInfo"
                @btn-exportall="exportData"
                style="margin-bottom: -10px"></query-part>
    <Card title="首创证券公司自营债券业务整体情况表" :padding="0"
          icon="ios-list-outline">
      <div slot="extra">
        <a href="#" slot="extra" @click.prevent="exportData">
          <Icon type="ios-upload-outline"></Icon>
          导出
        </a>
      </div>
      <div style="width:100%;overflow-x:auto;">
        <table id="cusTable" style="width: 2410px; margin-top: -40px;">
          <tr>
            <th style="width: 3.5%;"></th>
            <th style="width: 5.5px;"></th>
            <th style="width: 3.5%;"></th>
            <th style="width: 3.5%;"></th>
            <th style="width: 3.5%;"></th>
            <th style="width: 3.5%;"></th>
            <th style="width: 3.5%;"></th>
            <th style="width: 3.5%;"></th>
            <th style="width: 3.5%;"></th>
            <th style="width: 3.5%;"></th>
            <th style="width: 3.5%;"></th>
            <th style="width: 3.5%;"></th>
            <th style="width: 3.5%;"></th>
            <th style="width: 3.5%;"></th>
            <th style="width: 3.5%;"></th>
            <th style="width: 3.5%;"></th>
            <th style="width: 3.5%;"></th>
            <th style="width: 3.5%;"></th>
            <th style="width: 3.5%;"></th>
            <th style="width: 3.5%;"></th>
            <th style="width: 3.5%;"></th>
            <th style="width: 3.5%;"></th>
            <th style="width: 3.5%;"></th>
            <th style="width: 3.5%;"></th>
            <th style="width: 6%;"></th>
            <th style="width: 8%"></th>
          </tr>
          <tr>
            <th colspan="26">首创证券公司自营债券业务整体情况表</th>
          </tr>
          <tr>
            <th colspan="2">截至时间：{{tableData.tradeDate}}</th>
            <th colspan="24"></th>
          </tr>
          <tr>
            <th colspan="2" rowspan="2">业务模式</th>
            <th rowspan="2">规模</th>
            <th colspan="7">对手方</th>
            <th colspan="6">债券类型</th>
            <th colspan="2">交易场所</th>
            <th colspan="6">期限及对应利率</th>
            <th rowspan="2">债券正回购资金余额或逆回购资金余额占上月末净资产比例</th>
            <th rowspan="2">是否存在不符合《关于进一步加强证券基金经营机构</th>
          </tr>
          <tr>
            <th>银行</th>
            <th>证券（含资管）</th>
            <th>货币基金</th>
            <th>其他基金</th>
            <th>保险</th>
            <th>信托</th>
            <th>其他</th>
            <th>利率债</th>
            <th>地方政府债</th>
            <th>AAA</th>
            <th>AAA以下AA（含）以上</th>
            <th>AA以下BBB以上</th>
            <th>BBB以下</th>
            <th>银行间</th>
            <th>交易所</th>
            <th>隔夜</th>
            <th>利率（%）</th>
            <th>2至14天</th>
            <th>利率（%）</th>
            <th>14天以上</th>
            <th>利率（%）</th>
          </tr>
          <tr>
            <th colspan="2">债券持仓</th>
            <td style="vnd.ms-excel.numberformat:@" v-for="(t, i) in tableData.data[0]" :key="i">
              {{t}}
            </td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <th colspan="2">自有资金</th>
            <td style="vnd.ms-excel.numberformat:@" v-for="(t, i) in tableData.data[1]" :key="i">
              {{t}}
            </td>
            <td rowspan="19">债券正回购资金余额占上月末净资产比例：134.62%
              债券逆回购资金余额占上月末净资产比例：27.93.5%</td>
            <td rowspan="19">截至2017年12月末，债券正回购资金余额超过上月末净资产的120%，不符合《关于进一步加强证券基金经营机构
              债券交易监管的通知》的相关要求。我司计划逐步降低正回购规模，争取年内尽快达到监管要求。</td>
          </tr>
          <tr>
            <th rowspan="3">逆回购</th>
            <th>银行间回购（A）</th>
            <td style="vnd.ms-excel.numberformat:@" v-for="(t, i) in tableData.data[2]" :key="i">
              {{t}}
            </td>
          </tr>
          <tr>
            <th>交易所标准券回购(B)</th>
            <td style="vnd.ms-excel.numberformat:@" v-for="(t, i) in tableData.data[3]" :key="i">
              {{t}}
            </td>
          </tr>
          <tr>
            <th>合计(A+B）</th>
            <td style="vnd.ms-excel.numberformat:@" v-for="(t, i) in tableData.data[4]" :key="i">
              {{t}}
            </td>
          </tr>
          <tr>
            <th rowspan="3">正回购</th>
            <th>银行间回购（C）</th>
            <td style="vnd.ms-excel.numberformat:@" v-for="(t, i) in tableData.data[5]" :key="i">
              {{t}}
            </td>
          </tr>
          <tr>
            <th>交易所标准券回购(D)</th>
            <td style="vnd.ms-excel.numberformat:@" v-for="(t, i) in tableData.data[6]" :key="i">
              {{t}}
            </td>
          </tr>
          <tr>
            <th>合计(C+D）</th>
            <td style="vnd.ms-excel.numberformat:@" v-for="(t, i) in tableData.data[7]" :key="i">
              {{t}}
            </td>
          </tr>
          <tr>
            <th rowspan="6">已买入待返售</th>
            <th>协议（E）</th>
            <td style="vnd.ms-excel.numberformat:@" v-for="(t, i) in tableData.data[8]" :key="i">
              {{t}}
            </td>
          </tr>
          <tr>
            <th>T+0/T+1(F)</th>
            <td style="vnd.ms-excel.numberformat:@" v-for="(t, i) in tableData.data[9]" :key="i">
              {{t}}
            </td>
          </tr>
          <tr>
            <th>口头（G）</th>
            <td style="vnd.ms-excel.numberformat:@" v-for="(t, i) in tableData.data[10]" :key="i">
              {{t}}
            </td>
          </tr>
          <tr>
            <th>表内（H）</th>
            <td style="vnd.ms-excel.numberformat:@" v-for="(t, i) in tableData.data[11]" :key="i">
              {{t}}
            </td>
          </tr>
          <tr>
            <th>表外（I）</th>
            <td style="vnd.ms-excel.numberformat:@" v-for="(t, i) in tableData.data[12]" :key="i">
              {{t}}
            </td>
          </tr>
          <tr>
            <th>合计（E+F+G=H+I）</th>
            <td v-for="(t, i) in tableData.data[13]" :key="i">
              {{t}}
            </td>
          </tr>
          <tr>
            <th rowspan="6">已卖出待购回</th>
            <th>协议（J）</th>
            <td style="vnd.ms-excel.numberformat:@" v-for="(t, i) in tableData.data[14]" :key="i">
              {{t}}
            </td>
          </tr>
          <tr>
            <th>T+0/T+1(K)</th>
            <td style="vnd.ms-excel.numberformat:@" v-for="(t, i) in tableData.data[15]" :key="i">
              {{t}}
            </td>
          </tr>
          <tr>
            <th>口头（L）</th>
            <td style="vnd.ms-excel.numberformat:@" v-for="(t, i) in tableData.data[16]" :key="i">
              {{t}}
            </td>
          </tr>
          <tr>
            <th>表内（M）</th>
            <td style="vnd.ms-excel.numberformat:@" v-for="(t, i) in tableData.data[17]" :key="i">
              {{t}}
            </td>
          </tr>
          <tr>
            <th>表外（N）</th>
            <td style="vnd.ms-excel.numberformat:@" v-for="(t, i) in tableData.data[18]" :key="i">
              {{t}}
            </td>
          </tr>
          <tr>
            <th>合计（J+K+L=M+N）</th>
            <td style="vnd.ms-excel.numberformat:@" v-for="(t, i) in tableData.data[19]" :key="i">
              {{t}}
            </td>
          </tr>
          <tr>
            <td colspan="2">填表人：{{ tableData.reporter }}</td>
            <td colspan="2">电话：{{ tableData.phone }}</td>
            <td colspan="2"></td>
            <td colspan="5">业务负责人：{{ tableData.director }}</td>
            <td colspan="15"></td>
          </tr>
        </table>
      </div>
    </Card>
  </div>
</template>

<script>
import reportsApi from '../../../api/reports'
import ExportCsv from '../../../assets/js/export-csv'
import QueryPart from '../../../components/QueryPart'
export default {
  name: 'CustomOne',
  components: {
    'query-part': QueryPart
  },
  data () {
    return {
      tableData: {data: []},
      query: {},
      queryData: []
    }
  },
  created () {
    for (let i = 0; i < 20; i++) {
      let arr = []
      for (let j = 0; j < 22; j++) {
        arr.push(1)
      }
      this.tableData.data.push(arr)
    }
  },
  mounted () {
    let vm = this
    reportsApi.reportDef.r('CRPT0001').then((res) => {
      console.log('reportDef: %O', res)
      if (res.table.queryItems) {
        vm.queryData = []
        vm.queryData = res.table.queryItems
      }
    })
    this.$options.methods.queryInfo(this, {})
  },
  methods: {
    queryInfo (ctx, query) {
      console.log('query:', query)
      let params = {
        reportId: 'CRPT0001',
        query: query,
        loadAll: true,
        pageNo: 1,
        pageSize: 10
      }
      reportsApi.reportData.r(params).then((res) => {
        console.log(res)
        ctx.tableData = res
      })
    },
    searchInfo (query) {
      this.queryInfo(this, query)
    },
    resetInfo () {
      this.queryInfo(this, {})
    },
    exportData () {
      ExportCsv.download('首创证券公司自营债券业务整体情况表' + '.xls',
        '<table>' + document.getElementById('cusTable').innerHTML + '</table>')
    }
  }
}
</script>

<style scoped>
  table {
    border-collapse: collapse;
    /*border: 1px solid #000;*/
    text-align: center;
  }
  table td, table th {
    border: 1px solid #e3e8ee;
    height: 40px;
  }
  table th {
    background-color: #f5f7f9;
  }
  table tbody {
    vertical-align: middle;
    border-color: inherit;
  }
</style>
