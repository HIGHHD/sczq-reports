import createAxiosIns from './axIns'
import instance from './index'

const crudDef = {
  r: param => {
    return instance.get(`dmp/v1/crud/${param}/definition`)
  }
}

const getQuery = function (def, param, base, crudId) {
  let method = def.method
  let path = def.path
  let operation = def.operation
  let primaryKey = def.primaryKey
  let ins = createAxiosIns(base)
  let url = path ? `${crudId}/${path}` : `${crudId}`
  if (method === 'get') {
    let jsonParams = JSON.stringify(param.query)
    if (operation === 'list') {
      return ins.get(url, {
        params: {
          'parameters': jsonParams,
          'pageSize': param.pageSize,
          'pageNo': param.pageNo,
          'loadAll': param.loadAll
        }
      })
    } else {
      return ins.get(primaryKey ? `${url}/${param.query}` : url)
    }
  } else if (method === 'post') {
    return ins.post(url, param.query)
  } else if (method === 'put') {
    return ins.put(url, param.query)
  } else if (method === 'delete') {
    return ins.delete(primaryKey ? `${url}/${param.query}` : url)
  }
}

export default {
  crudDef,
  getQuery
}
