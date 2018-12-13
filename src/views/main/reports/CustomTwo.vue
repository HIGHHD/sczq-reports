<template>
  <div style="margin: 10px;">
    <query-part :pQueryData="queryData"
                @btn-reset="resetInfo"
                @btn-search="searchInfo"
                @btn-exportall="exportData"
                style="margin-bottom: -10px"></query-part>
    <Card title="自营业务模式数据报送表格——数据报送主表" :padding="0"
          icon="ios-list-outline">
      <div slot="extra">
        <a href="#" slot="extra" @click.prevent="exportData">
          <Icon type="ios-upload-outline"></Icon>
          导出
        </a>
      </div>
      <div style="width:100%;overflow-x:auto;">
        <table id="cusTable" style="width: 100%; margin-top: -40px;">
          <tr>
            <th style="width: 15%"></th>
            <th style="width: 20%"></th>
            <th style="width: 20%"></th>
            <th style="width: 5%"></th>
            <th style="width: 20%"></th>
            <th style="width: 20%"></th>
          </tr>
          <tr><th colspan="6">
            自营业务模式数据报送表格——数据报送主表
          </th></tr>
          <tr>
            <th>填制单位：</th>
            <th colspan="2">首创证券有限责任公司</th>
            <th></th>
            <th>填制日期：</th>
            <th>{{ tableData.reportDate }}</th>
          </tr>
          <tr>
            <th colspan="6">一、自有债券量(会计口径，注1）</th>
          </tr>
          <tr>
            <th colspan="3" rowspan="2">种类</th>
            <th rowspan="2">行次</th>
            <th colspan="2">月末持有量（面值；亿元）</th>
          </tr>
          <tr>
            <th>上交所</th>
            <th>深交所</th>
          </tr>
          <tr>
            <th colspan="3">利率债</th>
            <td>1</td>
            <td style="vnd.ms-excel.numberformat:@">{{ tableData.data[0].col1 }}</td>
            <td style="vnd.ms-excel.numberformat:@">{{ tableData.data[0].col2 }}</td>
          </tr>
          <tr>
            <th colspan="3">信用债</th>
            <td>2</td>
            <td style="vnd.ms-excel.numberformat:@">{{ tableData.data[1].col1 }}</td>
            <td style="vnd.ms-excel.numberformat:@">{{ tableData.data[1].col2 }}</td>
          </tr>
          <tr>
            <th colspan="3">种类</th>
            <th>行次</th>
            <th colspan="2">银行间</th>
          </tr>
          <tr>
            <th colspan="3">利率债</th>
            <td>3</td>
            <td style="vnd.ms-excel.numberformat:@" colspan="2">{{ tableData.data[2].col1 }}</td>
          </tr>
          <tr>
            <th colspan="3">信用债</th>
            <td>4</td>
            <td colspan="2">{{ tableData.data[3].col1 }}</td>
          </tr>
          <tr>
            <th colspan="6">其中：（一）交易所市场债券入库、质押及冻结情况（月末；折算前面值；亿元）</th>
          </tr>
          <tr>
            <th colspan="3">1、债券质押式回购已入库数量（面值）</th>
            <th></th>
            <th>上交所</th>
            <th>深交所</th>
          </tr>
          <tr>
            <th colspan="3">利率债</th>
            <td>5</td>
            <td style="vnd.ms-excel.numberformat:@">{{ tableData.data[4].col1 }}</td>
            <td style="vnd.ms-excel.numberformat:@">{{ tableData.data[4].col2 }}</td>
          </tr>
          <tr>
            <th colspan="3">信用债</th>
            <td>6</td>
            <td style="vnd.ms-excel.numberformat:@">{{ tableData.data[5].col1 }}</td>
            <td style="vnd.ms-excel.numberformat:@">{{ tableData.data[5].col2 }}</td>
          </tr>
          <tr>
            <th colspan="3">2、债券质押式协议回购质押冻结数量（面值）</th>
            <th></th>
            <th>上交所</th>
            <th>深交所</th>
          </tr>
          <tr>
            <th colspan="3">利率债</th>
            <td>7</td>
            <td style="vnd.ms-excel.numberformat:@">{{ tableData.data[6].col1 }}</td>
            <td style="vnd.ms-excel.numberformat:@">{{ tableData.data[6].col2 }}</td>
          </tr>
          <tr>
            <th colspan="3">信用债</th>
            <td>8</td>
            <td style="vnd.ms-excel.numberformat:@">{{ tableData.data[7].col1 }}</td>
            <td style="vnd.ms-excel.numberformat:@">{{ tableData.data[7].col2 }}</td>
          </tr>
          <tr>
            <th colspan="3">3、其他质押或冻结债券数量（面值）</th>
            <th></th>
            <th>上交所</th>
            <th>深交所</th>
          </tr>
          <tr>
            <th colspan="3">利率债</th>
            <td>9</td>
            <td style="vnd.ms-excel.numberformat:@">{{ tableData.data[8].col1 }}</td>
            <td style="vnd.ms-excel.numberformat:@">{{ tableData.data[8].col2 }}</td>
          </tr>
          <tr>
            <th colspan="3">信用债</th>
            <td>10</td>
            <td style="vnd.ms-excel.numberformat:@">{{ tableData.data[9].col1 }}</td>
            <td style="vnd.ms-excel.numberformat:@">{{ tableData.data[9].col2 }}</td>
          </tr>
          <tr>
            <th colspan="6">（二）银行间市场债券质押、冻结或买断式正回购的情况（月末；折算前面值；亿元）</th>
          </tr>
          <tr>
            <th colspan="3">1、因银行间市场债券质押式回购被质押冻结数量（面值）</th>
            <th></th>
            <th colspan="2">银行间</th>
          </tr>
          <tr>
            <th colspan="3">利率债</th>
            <td>11</td>
            <td colspan="2" style="vnd.ms-excel.numberformat:@">{{ tableData.data[10].col1 }}</td>
          </tr>
          <tr>
            <th colspan="3">信用债</th>
            <td>12</td>
            <td colspan="2" style="vnd.ms-excel.numberformat:@">{{ tableData.data[11].col1 }}</td>
          </tr>
          <tr>
            <th colspan="3">2、其他质押或冻结数量（面值）</th>
            <th></th>
            <th colspan="2">银行间</th>
          </tr>
          <tr>
            <th colspan="3">利率债</th>
            <td>13</td>
            <td colspan="2" style="vnd.ms-excel.numberformat:@">{{ tableData.data[12].col1 }}</td>
          </tr>
          <tr>
            <th colspan="3">信用债</th>
            <td>14</td>
            <td colspan="2" style="vnd.ms-excel.numberformat:@">{{ tableData.data[13].col1 }}</td>
          </tr>
          <tr>
            <th colspan="3">3、买断式正回购的卖出回购数量（面值）</th>
            <th></th>
            <th colspan="2">银行间</th>
          </tr>
          <tr>
            <th colspan="3">利率债</th>
            <td>15</td>
            <td colspan="2" style="vnd.ms-excel.numberformat:@">{{ tableData.data[14].col1 }}</td>
          </tr>
          <tr>
            <th colspan="3">信用债</th>
            <td>16</td>
            <td colspan="2" style="vnd.ms-excel.numberformat:@">{{ tableData.data[15].col1 }}</td>
          </tr>
          <tr>
            <th colspan="6">二、回购未到期余额（月末）</th>
          </tr>
          <tr>
            <th>种类</th>
            <th>方向</th>
            <th></th>
            <th>行次</th>
            <th colspan="2">未到期余额（月末，亿元）</th>
          </tr>
          <tr>
            <th rowspan="4">上交所 </th>
            <th rowspan="2">债券质押式回购</th>
            <th>正回购</th>
            <td>17</td>
            <td colspan="2" style="vnd.ms-excel.numberformat:@">{{ tableData.data[16].col1 }}</td>
          </tr>
          <tr>
            <th>逆回购</th>
            <td>18</td>
            <td colspan="2" style="vnd.ms-excel.numberformat:@">{{ tableData.data[17].col1 }}</td>
          </tr>
          <tr>
            <th rowspan="2">债券质押式协议回购</th>
            <th>正回购</th>
            <td>19</td>
            <td colspan="2" style="vnd.ms-excel.numberformat:@">{{ tableData.data[18].col1 }}</td>
          </tr>
          <tr>
            <th>正回购</th>
            <td>20</td>
            <td colspan="2" style="vnd.ms-excel.numberformat:@">{{ tableData.data[19].col1 }}</td>
          </tr>
          <tr>
            <th>种类</th>
            <th>方向</th>
            <th></th>
            <th>行次</th>
            <td colspan="2">未到期余额（月末，亿元）</td>
          </tr>
          <tr>
            <th rowspan="4">深交所 </th>
            <th rowspan="2">债券质押式回购</th>
            <th>正回购</th>
            <td>21</td>
            <td colspan="2" style="vnd.ms-excel.numberformat:@">{{ tableData.data[20].col1 }}</td>
          </tr>
          <tr>
            <th>逆回购</th>
            <td>22</td>
            <td colspan="2" style="vnd.ms-excel.numberformat:@">{{ tableData.data[21].col1 }}</td>
          </tr>
          <tr>
            <th rowspan="2">债券质押式协议回购</th>
            <th>正回购</th>
            <td>23</td>
            <td colspan="2" style="vnd.ms-excel.numberformat:@">{{ tableData.data[22].col1 }}</td>
          </tr>
          <tr>
            <th>正回购</th>
            <td>24</td>
            <td colspan="2" style="vnd.ms-excel.numberformat:@">{{ tableData.data[23].col1 }}</td>
          </tr>
          <tr>
            <th>种类</th>
            <th>方向</th>
            <th></th>
            <th>行次</th>
            <td colspan="2">未到期余额（月末，亿元）</td>
          </tr>
          <tr>
            <th rowspan="4">银行间 </th>
            <th rowspan="2">债券质押式回购</th>
            <th>正回购</th>
            <td>25</td>
            <td colspan="2" style="vnd.ms-excel.numberformat:@">{{ tableData.data[24].col1 }}</td>
          </tr>
          <tr>
            <th>逆回购</th>
            <td>26</td>
            <td colspan="2">{{ tableData.data[25].col1 }}</td>
          </tr>
          <tr>
            <th rowspan="2">债券买断式回购</th>
            <th>正回购</th>
            <td>27</td>
            <td colspan="2" style="vnd.ms-excel.numberformat:@">{{ tableData.data[26].col1 }}</td>
          </tr>
          <tr>
            <th>正回购</th>
            <td>28</td>
            <td colspan="2" style="vnd.ms-excel.numberformat:@">{{ tableData.data[27].col1 }}</td>
          </tr>
          <tr>
            <th colspan="6">三、资产负债情况</th>
          </tr>
          <tr>
            <th colspan="3">项目</th>
            <th>行次</th>
            <th colspan="2">月末（亿元）</th>
          </tr>
          <tr>
            <th colspan="3">总资产</th>
            <td>29</td>
            <td colspan="2" style="vnd.ms-excel.numberformat:@">{{ tableData.data[28].col1 }}</td>
          </tr>
          <tr>
            <th colspan="3">净资产</th>
            <td>30</td>
            <td colspan="2" style="vnd.ms-excel.numberformat:@">{{ tableData.data[29].col1 }}</td>
          </tr>
          <tr>
            <th colspan="3">总负债</th>
            <td>31</td>
            <td colspan="2" style="vnd.ms-excel.numberformat:@">{{ tableData.data[30].col1 }}</td>
          </tr>
          <tr>
            <th colspan="6">四、杠杆倍数</th>
          </tr>
          <tr>
            <th rowspan="5">杠杆倍数</th>
            <th rowspan="4">回购杠杆</th>
            <th>上交所</th>
            <td>32</td>
            <td colspan="2" style="vnd.ms-excel.numberformat:@">{{ tableData.data[31].col1 }}</td>
          </tr>
          <tr>
            <th>深交所</th>
            <td>33</td>
            <td colspan="2" style="vnd.ms-excel.numberformat:@">{{ tableData.data[32].col1 }}</td>
          </tr>
          <tr>
            <th>银行间</th>
            <td>34</td>
            <td colspan="2" style="vnd.ms-excel.numberformat:@">{{ tableData.data[33].col1 }}</td>
          </tr>
          <tr>
            <th>债券全市场</th>
            <td>35</td>
            <td colspan="2" style="vnd.ms-excel.numberformat:@">{{ tableData.data[34].col1 }}</td>
          </tr>
          <tr>
            <th colspan="2">总体杠杆</th>
            <td>36</td>
            <td colspan="2" style="vnd.ms-excel.numberformat:@">{{ tableData.data[35].col1 }}</td>
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
  name: 'CustomTwo',
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
    for (let i = 0; i < 36; i++) {
      let col = {
        col1: -1,
        col2: -2
      }
      this.tableData.data.push(col)
    }
  },
  mounted () {
    let vm = this
    reportsApi.reportDef.r('CRPT0002').then((res) => {
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
        reportId: 'CRPT0002',
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
      ExportCsv.download('自营业务模式数据报送表格——数据报送主表' + '.xls',
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
