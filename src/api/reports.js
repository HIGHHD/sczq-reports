import instance from './index'

const reportDef = {
  r: param => {
    return instance.get(`dmp/v1/report/definition/${param}`)
  }
}

const reportData = {
  r: param => {
    let jsonParams = JSON.stringify(param.query)
    return instance.get(`dmp/v1/report/data/${param.reportId}`, {
      params: {
        'parameters': jsonParams,
        'pageSize': param.pageSize,
        'pageNo': param.pageNo,
        'loadAll': param.loadAll
      }
    })
  }
}

export default {
  reportDef,
  reportData
}
