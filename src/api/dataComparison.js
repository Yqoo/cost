import http from './http'
import QS from 'qs'

function strSplicing(params) {
  let url = ''
  if (params) {
    Object.keys(params).forEach(key => {
      url += `${key}=${params[key]}&`
    })
    url = url.slice(0, -1)
  }
  return url
}

export function getLeftTree() {
  return http.get('/dataCompare/tree')
}

export function addCategory(params) {
  return http.post('/dataCompare/addCategory', QS.stringify(params))
}

export function categoryInfo(params) {
  return http.get(`/dataCompare/getCategory?${strSplicing(params)}`)
}

export function updateCategory(params) {
  return http.post('/dataCompare/updateCategory', QS.stringify(params))
}

export function delCategory(params) {
  return http.post('/dataCompare/deleteCategory', QS.stringify(params))
}

export function getTableData(params) {
  return http.get(`/dataCompare/list?${strSplicing(params)}`)
}

export function getColumns(params) {
  return http.get(`/dataCompare/columns?${strSplicing(params)}`)
}

export function getComparisonInfo(params) {
  return http.get(`/dataCompare/get?${strSplicing(params)}`)
}

export function saveComparison(params, url) {
  return http.post(url, QS.stringify(params))
}

export function delComparison(params) {
  return http.post('dataCompare/delete', QS.stringify(params))
}

export function getComparisonDatas(params) {
  return http.get(`/dataCompare/datas?${strSplicing(params)}`)
}

export function dataCompareAndCorrect(params, url) {
  return http.get(`${url}?${strSplicing(params)}`)
}

export function getCalcDatas(params) {
  return http.post('/dataCalculation/list', QS.stringify(params))
}

export function getCalcList() {
  return http.post('/kettle/listAll')
}

export function saveCalc(params, url) {
  return http.post(url, QS.stringify(params))
}

export function getCalcInfo(params) {
  return http.get(`/dataCalculation/get?${strSplicing(params)}`)
}

export function delCalc(params) {
  return http.post('/dataCalculation/delete', QS.stringify(params))
}

export function getTransformInfo(params) {
  return http.get(`/dataCalculation/datas?${strSplicing(params)}`)
}

export function doCalculate(params) {
  return http.get(`/dataCalculation/doCalculate?${strSplicing(params)}`)
}

export function getCalculateStatus(params) {
  return http.get(`/dataCalculation/getCalculateStatus?${strSplicing(params)}`)
}
