/* eslint-disable indent */
/* eslint-disable quotes */
const mockDef = {
  'reportId': 'RP0001',
  'reportName': '持仓分析表',
  'reportDataSource': '衡泰信用风险数据库',
  'table': {
    'dataUrl': 'http://192.168.202.201:8080/dmp/v1/report/data/RP0001',
    'queryItems': [{
      'title': '账户',
      'type': 'input',
      'paramName': 'account'
    }, {
      'title': '开始日期',
      'type': 'date',
      'paramName': 'startDate',
      'dateDef': {
        'type': 'date',
        'format': 'yyyy-MM-dd'
      }
    }, {
      'title': '结束日期',
      'type': 'date',
      'paramName': 'endDate',
      'dateDef': {
        'type': 'date',
        'format': 'yyyy-MM-dd'
      }
    }]
  },
  'reports': [{
    'reportId': 'RP0002',
    'reportName': '持仓券种',
    'reportDataSource': '衡泰信用风险数据库',
    'table': {
      'dataUrl': 'http://192.168.202.201:8080/dmp/v1/report/data/RP0002',
      'fields': [{
        'title': '债券品种',
        'key': 'bondType',
        'align': 'left',
        'visible': true
      },
        {
          'title': '债券品种',
          'key': 'positionTotal',
          'align': 'center',
          'visible': true
        }
      ]
    }
  }, {
    'reportId': 'RP0003',
    'reportName': '评级分析',
    'reportDataSource': '衡泰信用风险数据库',
    'table': {
      'dataUrl': 'http://192.168.202.201:8080/dmp/v1/report/data/RP0003',
      'fields': [{
        'title': '评级分类',
        'key': 'bondClass',
        'align': 'left',
        'visible': true
      },
        {
          'title': '债券品种',
          'key': 'positionTotal',
          'align': 'center',
          'visible': true
        }
      ]
    }
  }, {
    'reportId': 'RP0004',
    'reportName': '评级分析2',
    'reportDataSource': '衡泰信用风险数据库',
    'table': {
      'dataUrl': 'http://192.168.202.201:8080/dmp/v1/report/data/RP0003',
      'fields': [{
        'title': '评级分类',
        'key': 'bondClass',
        'align': 'left',
        'visible': true
      },
        {
          'title': '债券品种',
          'key': 'positionTotal',
          'align': 'center',
          'visible': true
        }
      ]
    }
  }]
}
export {mockDef}

const mockDef2 = {
  'reportId': 'RP0001',
  'reportName': '持仓分析表',
  'reportDataSource': '衡泰信用风险数据库',
  'table': {
    'dataUrl': 'http://192.168.202.201:8080/dmp/v1/report/data/RP0001',
    'queryItems': [{
      'title': '账户',
      'type': 'input',
      'paramName': 'account'
    }, {
      'title': '资产类型',
      'type': 'enums',
      'paramName': 'assetType',
      'enumsData': [{
        'label': '债券',
        'value': 'SPT_BD'
      }, {
        'label': '债券',
        'value': 'SPT_ABS'
      }]
    }, {
      'title': '开始日期',
      'type': 'date',
      'paramName': 'startDate',
      'dateDef': {
        'type': 'date',
        'format': 'yyyy-MM-dd'
      }
    }, {
      'title': '结束日期',
      'type': 'date',
      'paramName': 'endDate',
      'dateDef': {
        'type': 'date',
        'format': 'yyyy-MM-dd'
      }
    }],
    'fields': [{
      'title': '评级分类',
      'key': 'bondClass',
      'align': 'left',
      'visible': true
    },
      {
        'title': '债券品种',
        'key': 'positionTotal',
        'align': 'center',
        'visible': true
      }
    ]
  }
}
export {mockDef2}

const crudDef = {
  'reportId': 'RP0001',
  'reportName': '持仓分析表',
  'reportDataSource': '衡泰信用风险数据库',
  'table': {
    'queryItems': [{
      'title': '账户',
      'type': 'input',
      'paramName': 'account'
    }, {
      'title': '资产类型',
      'type': 'enums',
      'paramName': 'assetType',
      'enumDef': {
        'multiple': true,
        'enumsData': [{
          'label': '债券',
          'value': 'SPT_BD'
        }, {
          'label': 'ABS债券',
          'value': 'SPT_ABS'
        }]
      }
    }, {
      'title': '开始日期',
      'type': 'date',
      'paramName': 'startDate',
      'dateDef': {
        'type': 'date',
        'format': 'yyyy-MM-dd'
      }
    }, {
      'title': '结束日期',
      'type': 'date',
      'paramName': 'endDate',
      'dateDef': {
        'type': 'date',
        'format': 'yyyy-MM-dd'
      }
    }],
    'fields': [{
      'title': '评级分类',
      'key': 'bondClass',
      'align': 'left',
      'visible': true
    },
      {
        'title': '债券品种',
        'key': 'positionTotal',
        'align': 'center',
        'visible': true
      }
    ],
    'modalMeta': {
      'isTabs': true,
      'colSpan': 3,
      'tableId': 'RP0001',
      'tableName': '持仓分析表',
      'rowId': '1',
      'modalName': 'tianjia',
      'modalWidth': '1000',
      'tabs': [{
        tabId: 'tab1',
        tabName: 'TAB1',
        colList: [{
          'title': '账户',
          'type': 'input',
          'paramName': 'account'
        }, {
          'title': '资产类型',
          'type': 'enums',
          'paramName': 'assetType',
          'enumDef': {
            'multiple': true,
            'enumsData': [{
              'label': '债券',
              'value': 'SPT_BD'
            }, {
              'label': 'ABS债券',
              'value': 'SPT_ABS'
            }]
          }
        }]
      }]
    }
  }
}
export {crudDef}

const crudData = [{
  bondClass: '1',
  positionTotal: 'A'
}, {
  bondClass: '1',
  positionTotal: 'A'
}]
export {crudData}

const cData = [{
  TRADER: 'SPT_BD',
  PARTYNAME: 'SPT_BD',
  PARTYNAME1: 'SPT_BD',
  PARTYNAME2: 'SPT_BD',
  PARTYNAME3: 'SPT_BD'
}, {
  TRADER: 'SPT_BD',
  PARTYNAME: 'SPT_BD',
  PARTYNAME1: 'SPT_BD',
  PARTYNAME2: 'SPT_BD',
  PARTYNAME3: 'SPT_BD'
}, {
  TRADER: 'SPT_BD',
  PARTYNAME: 'SPT_BD',
  PARTYNAME1: 'SPT_BD',
  PARTYNAME2: 'SPT_BD',
  PARTYNAME3: 'SPT_BD'
}]
export {cData}

const cDef = {
  "entityName": "MetaDictionaryType",
  "genericType": "com.dmp.entity.MetaDictionaryType",
  "entityTitle": "数据字典类型",
  "table": {
    "height": 500,
    "width": 500,
    "queryItems": [{
      "title": "字典名称",
      "type": "input",
      "paramName": "dictTypeName"
    }],
    "fields": [{
      "title": "字典名称",
      "key": "dictTypeName",
      "width": 200,
      "align": "left",
      "visible": true
    }],
    "formDefine": {
      "name": "字典表",
      "code": "metaDictionaryType",
      "width": 500,
      "minWidth": 500,
      "height": 500,
      "minHeight": 500,
      "columns": 2,
      "tabFlag": false,
      "tabNumber": 2,
      "tabs": [{
        "index": 1,
        "name": "基础信息",
        "code": "baseTab"
      }, {
        "index": 2,
        "name": "扩展信息",
        "code": "extendTab"
      }],
      "fields": [{
        "title": "字典名称",
        "key": "dictTypeName",
        "align": "left",
        "visible": true,
        "editable": true,
        "tabIndex": 1,
        "formElement": "input",
        "dataSource": "input",
        "inputDef": {
          "formatType": "text"
        }
      }]
    }
  }
}
export {cDef}
