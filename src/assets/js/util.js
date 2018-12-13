import Vue from 'vue'
import iView from 'iview'
import * as numeral from 'numeral'
Vue.use(iView)

// sessionStorage
export const session = function (key, value) {
  key = 'sczq_report_' + key
  if (value === void (0)) {
    var lsVal = sessionStorage.getItem(key)
    if (lsVal && lsVal.indexOf('autostringify-') === 0) {
      return JSON.parse(lsVal.split('autostringify-')[1])
    } else {
      return lsVal
    }
  } else {
    if (typeof (value) === 'object' || Array.isArray(value)) {
      value = 'autostringify-' + JSON.stringify(value)
    }
    return sessionStorage.setItem(key, value)
  }
}
// localStorage
export const appLocal = function (key, value) {
  key = 'sczq_report_' + key
  if (value === void (0)) {
    var lsVal = localStorage.getItem(key)
    if (lsVal && lsVal.indexOf('autostringify-') === 0) {
      return JSON.parse(lsVal.split('autostringify-')[1])
    } else {
      return lsVal
    }
  } else {
    if (typeof (value) === 'object' || Array.isArray(value)) {
      value = 'autostringify-' + JSON.stringify(value)
    }
    return localStorage.setItem(key, value)
  }
}
export const typeOf = function (obj) {
  const toString = Object.prototype.toString
  const map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  }
  return map[toString.call(obj)]
}
// 清空
export const clearData = function (source) {
  for (let item in source) {
    if (typeOf(source[item]) === 'object') {
      clearData(source[item])
    } else if (typeOf(source[item]) === 'array') {
      source[item] = []
    } else {
      source[item] = null
    }
  }
}
// 深拷贝
export const deepcopy = function (source) {
  if (!source) {
    return source
  }
  let sourceCopy = source instanceof Array ? [] : {}
  for (let item in source) {
    sourceCopy[item] = typeof source[item] === 'object' ? deepcopy(source[item]) : source[item]
  }
  return sourceCopy
}
// 转换后台传来的权限json
export const buildUserInfo = function (res) {
  let resources = []
  let menus = []
  if (typeOf(res.perms) === 'array') {
    res.perms.forEach(e => {
      let re = {
        method: '',
        url: ''
      }
      let mothed = (e.code || '').split(':')
      if (mothed.length === 2) {
        re.method = mothed[1].toUpperCase()
        re.url = e.url
      }
      resources.push(re)
    })
  }
  if (typeOf(res.menus) === 'array') {
    res.menus.forEach(e => {
      let idx = res.menus.find(fe => fe.id === e.parentId)
      if (idx) {
        e.parent = idx.code
      }
      e.idx = e.code
      e.route = e.code
    })
    res.menus.forEach(e => {
      e.id = e.idx
    })
    console.log('buildMenu:%O', res.menus)
  }
  menus = res.menus
  return {
    resources: resources,
    menus: menus
  }
}
// 多选数组数据组织
export const buildMultiSelect = function (array, ckey, id, expand) {
  // 这里删除k的操作导致不停的触发组件计算属性
  ckey = ckey || 'parent'
  id = id || 'value'
  let returnData = []
  let indexKeys = Array.isArray(array) ? array.map((e) => {
    return e[id]
  }) : []
  array.forEach(function (e, i) {
    // 一级菜单
    if (!e[ckey] || (e[ckey] === e[id])) {
      delete e[ckey]
      returnData.push(deepcopy(e)) // 深拷贝
    } else if (Array.isArray(indexKeys)) {
      // 检测ckey有效性
      let parentIndex = indexKeys.findIndex(function (id) {
        return id === e[ckey]
      })
      if (parentIndex === -1) {
        e.title = e.label
        e.expand = false
        returnData.push(e)
      }
    }
  })
  let findChildren = function (parentArr) {
    if (Array.isArray(parentArr) && parentArr.length) {
      parentArr.forEach(function (parentNode) {
        array.forEach(function (node) {
          node.title = node.label
          node.expand = false
          if (parentNode[id] === node[ckey]) {
            if (parentNode.children) {
              parentNode.children.push(node)
            } else {
              parentNode.children = [node]
            }
          }
        })
        if (parentNode.children) {
          findChildren(parentNode.children)
        }
      })
    }
  }
  findChildren(returnData)
  console.log('tree-returnData:%O', returnData)
  return returnData
}

// 菜单数据组织
export const buildMenu = function (array, ckey) {
  let menuData = []
  let indexKeys = Array.isArray(array) ? array.map((e) => {
    return e.id
  }) : []
  ckey = ckey || 'parent'
  array.forEach(function (e, i) {
    // 一级菜单
    if (!e[ckey] || (e[ckey] === e.id)) {
      delete e[ckey]
      menuData.push(deepcopy(e)) // 深拷贝
    } else if (Array.isArray(indexKeys)) {
      // 检测ckey有效性
      let parentIndex = indexKeys.findIndex(function (id) {
        return id === e[ckey]
      })
      if (parentIndex === -1) {
        menuData.push(e)
      }
    }
  })
  let findChildren = function (parentArr) {
    if (Array.isArray(parentArr) && parentArr.length) {
      parentArr.forEach(function (parentNode) {
        array.forEach(function (node) {
          if (parentNode.id === node[ckey]) {
            if (parentNode.children) {
              parentNode.children.push(node)
            } else {
              parentNode.children = [node]
            }
          }
        })
        if (parentNode.children) {
          findChildren(parentNode.children)
        }
      })
    }
  }
  findChildren(menuData)
  return menuData
}
// 树形遍历 pkey:parent标识 ikey:每项的唯一标识 childKey:计划生成的children的标识
export const treeBuild = function (array, pkey, ikey, childKey, extra) {
  if (!(typeof extra === 'function')) {
    extra = function (ex) {
      ex.expand = true
      ex.title = ex.resourceName
      ex.parentName = ex.resourceName
      if (ex[pkey] === 0) {
        ex.parentName = '报表系统'
      }
      return ex
    }
  }
  let resData = []
  let indexKeys = Array.isArray(array) ? array.map((e) => { return e[ikey] }) : []
  pkey = pkey || 'parent'
  array.forEach(function (e, i) {
    // 一级菜单
    if (!e[pkey] || (e[pkey] === e[ikey])) {
      delete e[pkey]
      let ae = deepcopy(e)
      resData.push(extra(ae)) // 深拷贝
    } else if (Array.isArray(indexKeys)) {
      // 检测pkey有效性
      let parentIndex = indexKeys.findIndex(function (id) {
        return id === e[pkey]
      })
      if (parentIndex === -1) {
        resData.push(e)
      }
    } else {}
  })
  let findChildren = function (parentArr) {
    if (Array.isArray(parentArr) && parentArr.length) {
      parentArr.forEach(function (parentNode) {
        array.forEach(function (node) {
          node = extra(node)
          if (parentNode[ikey] === node[pkey]) {
            if (parentNode[childKey]) {
              parentNode[childKey].push(node)
            } else {
              parentNode[childKey] = [node]
            }
          }
        })
        if (parentNode[childKey]) {
          findChildren(parentNode[childKey])
        }
      })
    }
  }
  findChildren(resData)
  return resData
}
// 非ajax错误处理
export const resError = function (res) {
  console.log('rootRes:%O', res)
  let resData = res.data
  if (resData) {
    if (resData.errorCode !== undefined) {
      switch (resData.errorCode) {
        case '0':case 0:
          return resData.data || resData.attachment || resData
        case '1':case 1:
          return resData.data || resData.attachment || resData
        case '2':case 2:
          Vue.prototype.$Message.error({
            content: resData.msg || resData.message || '请求参数异常！'
          })
          break
        case '10':case 10:
          Vue.prototype.$Message.error({
            content: 'token异常，请联系管理员！'
          })
          break
        case '11':case 11:
          appLocal('token', '')
          appLocal('username', '')
          Vue.prototype.$Message.error({
            content: 'token失效，需要重新登录！'
          })
          break
        case '12':case 12:
          Vue.prototype.$Message.error({
            content: '无此权限，请向管理员确认！'
          })
          break
        default:
          Vue.prototype.$Message.error({
            content: '未知错误!'
          })
          break
      }
    } else {
      return resData
    }
  }
  return resData
}

// ajax错误处理
export const catchError = function (error) {
  if (error.response) {
    iView.LoadingBar.error()
    switch (error.response.status) {
      case 400:
        Vue.prototype.$Message.error({
          content: error.response.data.message || '请求参数异常'
        })
        break
      case 401:
        Vue.prototype.$Message.warning({
          content: error.response.data.message || '密码错误或账号不存在！',
          onClose: function () {
            location.reload()
          }
        })
        break
      case 403:
        Vue.prototype.$Message.warning({
          content: error.response.data.message || '无访问权限，请联系企业管理员'
        })
        break
      default:
        Vue.prototype.$Message.error({
          content: error.response.data.message || '服务端异常，请联系技术支持'
        })
    }
  }
  return Promise.reject(error)
}

export function formatDate (date, fmt) {
  if (typeof (date) === 'string') {
    date = new Date(date)
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    'S': date.getMilliseconds()
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

export function timeForMat (count) {
  // 拼接时间
  // let time1 = new Date()
  // time1.setTime(time1.getTime() - (24 * 60 * 60 * 1000))
  // let Y1 = time1.getFullYear()
  // let M1 = ((time1.getMonth() + 1) > 10 ? (time1.getMonth() + 1) : '0' + (time1.getMonth() + 1))
  // let D1 = (time1.getDate() > 10 ? time1.getDate() : '0' + time1.getDate())
  // let timer1 = Y1 + '-' + M1 + '-' + D1 // 当前时间
  let time2 = new Date()
  time2.setTime(time2.getTime() - (24 * 60 * 60 * 1000 * count))
  let Y2 = time2.getFullYear()
  let M2 = ((time2.getMonth() + 1) > 10 ? (time2.getMonth() + 1) : '0' + (time2.getMonth() + 1))
  let D2 = (time2.getDate() > 10 ? time2.getDate() : '0' + time2.getDate())
  let timer2 = Y2 + '-' + M2 + '-' + D2 // 之前的7天或者30天
  // return {
  //   t1: timer1,
  //   t2: timer2
  // }
  return timer2
}
/* eslint-disable no-useless-escape */
/* eslint-disable quotes */
/* eslint-disable semi */
export const docCookies = {
  getItem: function (sKey) {
    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, '\\$&') + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null
  },
  setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
    var sExpires = "";
    if (vEnd) {
      switch (vEnd.constructor) {
        case Number:
          sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
          break;
        case String:
          sExpires = "; expires=" + vEnd;
          break;
        case Date:
          sExpires = "; expires=" + vEnd.toUTCString();
          break;
      }
    }
    document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
    return true;
  },
  removeItem: function (sKey, sPath, sDomain) {
    if (!sKey || !this.hasItem(sKey)) { return false; }
    document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
    return true;
  },
  hasItem: function (sKey) {
    return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
  },
  keys: /* optional method: you can safely remove it! */ function () {
    var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
    for (var nIdx = 0; nIdx < aKeys.length; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
    return aKeys;
  }
};

export function exportTableStr (tableId, tableName, fields, data, eData) {
  let expKey = ''
  let heads = []
  let commons = []
  let expands = []
  fields.forEach((f, i, arr) => {
    if (f.type === 'expand') {
      expKey = f.key
      f.subColumns.forEach(s => {
        expands.push({
          type: 'expand',
          key: s.key,
          title: s.title,
          dataFormat: s.dataFormat,
          rowspan: 0
        })
      })
    } else {
      commons.push({
        type: 'common',
        key: f.key,
        title: f.title,
        dataFormat: f.dataFormat,
        rowspan: 0
      })
    }
  })
  heads = commons

  if (tableId === 'RPT0011') {
    let idx = commons.findIndex(e => e.key === 'ENDVALUE')
    heads.splice(idx + 1, 0, ...expands)
  } else if (tableId === 'RPT0012') {
    let idx = commons.findIndex(e => e.key === 'ENDVALUE')
    heads.splice(idx + 1, 0, ...expands)
  } else if (tableId === 'RPT0015') {
    let idx = commons.findIndex(e => e.key === 'SUBJECTVALUE')
    heads.splice(idx + 1, 0, ...expands)
  } else if (tableId === 'RPT0019A') {
    let idx = commons.findIndex(e => e.key === 'TRADETYPE')
    heads.splice(idx + 1, 0, ...expands)
  } else if (tableId === 'RPT0020A') {
    let idx = commons.findIndex(e => e.key === 'TRADETYPE')
    heads.splice(idx + 1, 0, ...expands)
  } else {
    heads = [...commons, ...expands]
  }

  let tableData = []
  tableData.push(heads)
  function formateData (f, d) {
    if (f === '$0,0.00' || f === '0,0.00' || f === '0.00') {
      return numeral(d).format('0.00')
    } else if (f === '$0,0.0000' || f === '0,0.0000' || f === '0.0000') {
      return numeral(d).format('0.0000')
    } else if (f === '$0,0.000' || f === '0,0.000' || f === '0.000') {
      return numeral(d).format('0.000')
    } else if (f === '0.00%') {
      return numeral(d).format('0.00%')
    } else if (f === '$0,0' || f === '0,0') {
      return d
    } else {
      return d
    }
  }
  data.forEach(d => {
    let trowspan = 0
    if (expKey !== '' && Array.isArray(d[expKey])) {
      trowspan = d[expKey].length
      d[expKey].forEach((dd, di, darr) => {
        let dl = []
        if (di === 0) {
          heads.forEach(he => {
            if (he.type === 'common') {
              let rt = ''
              if (he.dataFormat) {
                rt = formateData(he.dataFormat, d[he.key])
              } else {
                rt = d[he.key] || ''
              }
              let t = {
                title: rt,
                rowspan: trowspan
              }
              dl.push(t)
            }
            if (he.type === 'expand') {
              let rt = ''
              if (he.dataFormat) {
                rt = formateData(he.dataFormat, dd[he.key])
              } else {
                rt = dd[he.key] || ''
              }
              let t = {
                title: rt,
                rowspan: 0
              }
              dl.push(t)
            }
          })
        } else {
          heads.forEach(he => {
            if (he.type === 'expand') {
              let rt = ''
              if (he.dataFormat) {
                rt = formateData(he.dataFormat, dd[he.key])
              } else {
                rt = dd[he.key] || ''
              }
              let t = {
                title: rt,
                rowspan: 0
              }
              dl.push(t)
            }
          })
        }
        tableData.push(dl)
      })
    } else {
      let dl = []
      heads.forEach(he => {
        if (he.type === 'common') {
          let rt = ''
          if (he.dataFormat) {
            rt = formateData(he.dataFormat, d[he.key])
          } else {
            rt = d[he.key] || ''
          }
          let t = {
            title: rt,
            rowspan: 0
          }
          dl.push(t)
        }
      })
      tableData.push(dl)
    }
  })
  console.log('tablexls:%O', tableData)
  let tb = `<table><tr><td>${tableName}</td></tr>`
  tableData.forEach(t => {
    let trs = '<tr>'
    t.forEach(td => {
      if (td.rowspan !== 0) {
        trs += `<td style="vnd.ms-excel.numberformat:@" rowspan="${td.rowspan}">${td.title}</td>`
      } else {
        trs += `<td style="vnd.ms-excel.numberformat:@">${td.title}</td>`
      }
    })
    trs += '</tr>'
    tb += trs
  })
  console.log('tablexlseData:%O', eData)
  if (Array.isArray(eData)) {
    eData.forEach(ed => {
      tb += `<tr><td>${ed.label}</td><td style="vnd.ms-excel.numberformat:@">${formateData('0.00', ed.value)}</td></tr>`
    })
  }
  tb += '</table>'
  return tb
}

export function exportXls (filename, str) {
  let html = '<html><head><meta charset=\'utf-8\' /></head><body>' +
    str + '</body></html>'
  var blob = new Blob([html], { type: "application/vnd.ms-excel" })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename + '.xls'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
