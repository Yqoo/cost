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

export function getOutLeftTree(params) { // 获取外部左侧树
  return http.get(`/defineBusiness/tree?${strSplicing(params)}`)
}

export function getOutPage(params) { // 获取业务分页信息
  return http.get(`/defineBusiness/pages?${strSplicing(params)}`)
}

export function addBusiness(params) { // 添加业务
  return http.post('/defineBusiness/add', QS.stringify(params))
}

export function updateBusiness(params) { // 编辑业务
  return http.post('/defineBusiness/update', QS.stringify(params))
}

export function delBusiness(params) { // 删除业务
  return http.post('/defineBusiness/delete', QS.stringify(params))
}

export function getBusInfo(params) { // 获取业务详情
  return http.get(`/defineBusiness/get?${strSplicing(params)}`)
}

export function changeBusStatus(params) {
  return http.post('/defineBusiness/updateStatus', QS.stringify(params))
}

/* 分类 */

export function delType(params) {
  return http.post('/businessCategory/delete', QS.stringify(params))
}

export function getTypeTree(params) {
  return http.get(`/businessCategory/simpleTree?${strSplicing(params)}`)
}

export function addType(params) {
  return http.post('/businessCategory/add', QS.stringify(params))
}

export function updateType(params) {
  return http.post('/businessCategory/update', QS.stringify(params))
}

export function getTypeInfo(params) {
  return http.get(`/businessCategory/getBySn?${strSplicing(params)}`)
}

/* 管理表 */

export function getGlbLeftTree(params) {
  return http.get(`/businessTab/tree?${strSplicing(params)}`)
}

export function getGlbTable(params) {
  return http.get(`/businessTab/pages?${strSplicing(params)}`)
}

export function addGlb(params) {
  return http.post('/businessTab/add', QS.stringify(params))
}

export function updateGlb(params) {
  return http.post('/businessTab/update', QS.stringify(params))
}

export function delGlb(params) {
  return http.post('/businessTab/delete', QS.stringify(params))
}

export function getGlbInfo(params) {
  return http.get(`/businessTab/get?${strSplicing(params)}`)
}

/* 管理数据 */

export function getGlsjInfo(params) {
  return http.get(`businessTab/tabs?${strSplicing(params)}`)
}

export function getGlsjPage(params) {
  return http.post('/businessTab/listData', QS.stringify(params))
}

export function getGlsjFormInfo(params) {
  return http.post('/businessTab/getDataById', QS.stringify(params))
}

export function getDataTemplate(params) {
  return http.get(`businessTab/dataTemplate?${strSplicing(params)}`)
}

export function saveDataTable(params) {
  return http.post('/businessTab/saveData', QS.stringify(params))
}

export function delYWSJ(params) {
  return http.post('/businessTab/deleteData', QS.stringify(params))
}

export function getColumnsBySql(params) {
  return http.post('/businessTab/getColumnsBySql', QS.stringify(params))
}

export function bussinessSyncData(params) {
  return http.post('/businessTab/sync', QS.stringify(params))
}

export function getSupAndSubOps(params) {
  return http.get(`/businessTab/columns?${strSplicing(params)}`)
}

export function getDosTree(params) {
  return http.get(`/businessTab/dataTree?${strSplicing(params)}`)
}

export function updateControl(params) {
  return http.post('/businessTab/updateControl', QS.stringify(params))
}

export function sort(params) {
  return http.post('/defineBusiness/sort', QS.stringify(params))
}
