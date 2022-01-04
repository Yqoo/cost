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

export function getTree(url, params) {
  return http.get(`/${url}/tree?${strSplicing(params)}`)
}

export function getPage(url, params) {
  return http.get(`/${url}/pages?${strSplicing(params)}`)
}

export function getTypeTree(params) { // 获取系统档案下分类树
  return http.get(`/dossierCategory/simpleTree?${strSplicing(params)}`)
}

export function getCols(url, params) { // 添加档案时 字段为系统档案类型时获取档案字段数据
  return http.get(`/${url}/getCols?${strSplicing(params)}`)
}

export function save(url, params) {
  return http.post(`/${url}/add`, QS.stringify(params))
}

export function changeStatus(url, params) {
  return http.post(`/${url}/updateStatus`, QS.stringify(params))
}

export function getInfoById(url, params) {
  return http.get(`/${url}/get?${strSplicing(params)}`)
}

export function updateDangAn(url, params) { // 修改档案
  return http.post(`/${url}/update`, QS.stringify(params))
}

export function deleteDangAn(url, params) { // 删除档案
  return http.post(`/${url}/delete`, QS.stringify(params))
}

export function simpleTree(url, params) { // 获取分类上级树
  return http.get(`/${url}Category/simpleTree?${strSplicing(params)}`)
}
export function addType(url, params) { // 添加分类
  return http.post(`/${url}Category/add`, QS.stringify(params))
}

export function getTypeInfo(params) { // 获取分类详情
  return http.get(`/dossierCategory/getBySn?${strSplicing(params)}`)
}

export function updateType(url, params) { // 修改分类
  return http.post(`/${url}Category/update`, QS.stringify(params))
}

export function deleteType(url, params) { // 删除分类
  return http.post(`/${url}Category/delete`, QS.stringify(params))
}

export function generateMenus(url, params) {
  return http.post(`${url}/createMenu`, QS.stringify(params))
}

/* 管理数据Apis */

export function getSJTree(url, params) { // 获取数据管理下左侧树
  return http.get(`/${url}/listDataTree?${strSplicing(params)}`)
}

export function getSJPage(url, params) { // 获取数据管理下分页
  return http.post(`/${url}/dataPage`, QS.stringify(params))
}

export function saveSJ(url, params) { // 数据管理下 新增 修改保存
  return http.post(`/${url}/saveData`, QS.stringify(params))
}
export function getSJinfo(url, params) { // 通过数据编码和所属档案id获取数据详情
  return http.get(`/${url}/dataById?${strSplicing(params)}`)
}

export function delSJ(url, params) { // 删除系统档案数据
  return http.post(`/${url}/deleteData`, QS.stringify(params))
}

export function changeSjStatus(params) {
  return http.post('/dossier/updateControl', QS.stringify(params))
}

export function analysisSQL(params) {
  return http.post('/dossier/getColumnsBySql', QS.stringify(params))
}

/* 辅助核算方案下数据表保存 */
/* 系统级 */
export function saveFZSHFAForm(url, params) {
  return http.post('/fuZhuHeSuanFangAn/saveData', QS.stringify(params))
}

export function getFZHSInfo(url, params) { // 获取数据详情
  return http.get(`/fuZhuHeSuanFangAn/dataById?${strSplicing(params)}`)
}

/* 账套级 */

export function saveFZSHFAZTForm(url, params) {
  return http.post('/ZhangTaoFuZhuHeSuanXiangController/saveData', QS.stringify(params))
}

export function getFZHSZTInfo(url, params) { // 获取数据详情
  return http.get(`/ZhangTaoFuZhuHeSuanXiangController/dataById?${strSplicing(params)}`)
}

export function getDataSourceList() {
  return http.get('/dossier/dataSources')
}

export function previewTable(params) {
  return http.get(`/dossier/review?${strSplicing(params)}`)
}

export function syncData(params) {
  return http.get(`/dossier/sync?${strSplicing(params)}`)
}

export function sort(params) {
  return http.post('/dossier/sort', QS.stringify(params))
}
