import * as util from './util'
export const historyData = function (sData, count) {
  let finalList = []
  let logList = sData.schedulerExecutedLogList
  for (let i = 0; i < count; i++) {
    let date = util.timeForMat(i)
    let thisDay = {
      date: date,
      oaDate: '未执行',
      oaStatus: 0,
      zxDate: '未执行',
      zxStatus: 0,
      hsDate: '未执行',
      hsStatus: 0,
      gtDate1: '未执行',
      gtStatus1: 0,
      gtDate2: '未执行',
      gtStatus2: 0,
      zxgbDate: '未执行',
      zxgbStatus: 0,
      zylsDate: '未执行',
      zylsStatus: 0
    }
    let thisDayLog = logList.filter(function (logItem) {
      let eTime = util.formatDate(new Date(logItem.executedTime), 'yyyy-MM-dd')
      console.log('eTime:%O--date:%O', eTime, date)
      return eTime === date
    })
    console.log('thisDayLog:%O', thisDayLog)
    thisDayLog.forEach(function (item, index, arr) {
      let aItem = makeLogData(item)
      if (item.schedulerId === 'SCH0001') {
        thisDay.oaDate = aItem.realTime
        thisDay.oaStatus = aItem.executeStatus
      } else if (item.schedulerId === 'SCH0002') {
        thisDay.zxDate = aItem.realTime
        thisDay.zxStatus = aItem.executeStatus
      } else if (item.schedulerId === 'SCH0003') {
        thisDay.hsDate = aItem.realTime
        thisDay.hsStatus = aItem.executeStatus
      } else if (item.schedulerId === 'SCH0004') {
        thisDay.gtDate1 = aItem.realTime
        thisDay.gtStatus1 = aItem.executeStatus
      } else if (item.schedulerId === 'SCH0005') {
        thisDay.gtDate2 = aItem.realTime
        thisDay.gtStatus2 = aItem.executeStatus
      } else if (item.schedulerId === 'SCH0006') {
        thisDay.zxgbDate = aItem.realTime
        thisDay.zxgbStatus = aItem.executeStatus
      } else if (item.schedulerId === 'SCH0007') {
        thisDay.zylsDate = aItem.realTime
        thisDay.zylsStatus = aItem.executeStatus
      } else {}
    })
    finalList.push(thisDay)
  }
  return finalList
}

const makeLogData = function (data) {
  let item = {}
  if (data.executedTime) {
    item.realTime = util.formatDate(new Date(data.executedTime), 'yyyy-MM-dd hh:mm:ss')
  } else {
    item.realTime = '未执行'
  }
  if (data.executeStatus) {
    if (data.executeStatus === 'SUCCEED') {
      item.executeStatus = 1
    } else {
      item.executeStatus = -1
    }
  } else {
    item.executeStatus = 0
  }
  return item
}

export const todayData = function (sData) {
  let sList = sData.schedulerList
  let logList = sData.schedulerExecutedLogList
  let finalList = []
  // 记得加未执行的状况
  sList.forEach(function (item, index, arr) {
    let log = logList.filter(function (logItem) {
      return logItem.schedulerId === item.schedulerId
    })
    if (log.length === 1) {
      let aItem = makeLogData(log[0])
      item.executeStatus = aItem.executeStatus
      item.realTime = aItem.realTime
    } else {
      item.realTime = '未执行'
      item.executeStatus = 0
    }
  })
  for (let i = 0, len = sList.length; i < len; i += 3) {
    finalList.push(sList.slice(i, i + 3))
  }
  return finalList
}
