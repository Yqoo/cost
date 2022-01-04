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

/**
 * 报表设计
 */

// 查询报表分类树
export function getTree() {
  return http.get('/bbReportCategoryController/tree')
}

// 新增报表分类树
export function addTree(params) {
  return http.post('/bbReportCategoryController/add', QS.stringify(params))
}

// 查询单个报表分类树
export function getTreeDesc(params) {
  return http.get(`/bbReportCategoryController/getById?${strSplicing(params)}`)
}

// 修改报表分类树
export function editTree(params) {
  return http.post('/bbReportCategoryController/update', QS.stringify(params))
}

// 删除报表分类
export function delTree(params) {
  return http.get(`/bbReportCategoryController/delete?${strSplicing(params)}`)
}

// 右侧列表
export function getBbList(params) {
  return http.get(`/bbReportFormsController/list?${strSplicing(params)}`)
}

// 新增报表
export function addReportList(params) {
  return http.post('/bbReportFormsController/add', QS.stringify(params))
}

// 查询单个报表
export function getBbDesc(params) {
  return http.get(`/bbReportFormsController/getById?${strSplicing(params)}`)
}

// 修改报表
export function editReportList(params) {
  return http.post('/bbReportFormsController/update', QS.stringify(params))
}

// 删除报表
export function delBbList(param) {
  return http.get(`/bbReportFormsController/delete?${strSplicing(param)}`)
}

/**
 * 报表模板
 */

// 保存模板
export function saveData(param) {
  return http.post('/bbReportFormsController/updateData', QS.stringify(param))
}

// 打印预览
export function reportExcel(param) {
  return http.post('/bbReportFormsController/reportExcel', QS.stringify(param))
}

// 获取会计年度
export function getKjnd(param) {
  return http.get(`/bbFunctionWorkController/getKjndByZth?${strSplicing(param)}`)
}

// 获取会计期间
export function getKjqj(param) {
  return http.get(`/bbFunctionWorkController/getKjqjByZtsn?${strSplicing(param)}`)
}

// 获取默认值
export function getDefaultValue(param) {
  return http.get(`/bbFunctionWorkController/getMoRenParam?${strSplicing(param)}`)
}

// 报表项目下拉数据
export function getBbxmData(param) {
  return http.get(`/bbReportTxController/treeAndXm?${strSplicing(param)}`)
}

// 通过项目id查询数据树
export function getXmTree(param) {
  return http.get(`/bbReportFormsController/getXmTree?${strSplicing(param)}`)
}

// 项目档案,量度和量度公式的关系
export function listMapLdgs(param) {
  return http.get(`/bbDossierDataController/listMapLdgs?${strSplicing(param)}`)
}

/**
 * 报表数据
 */

// 通过sn查询数据
export function yzSn(param) {
  return http.get(`/bbReportFormsDataController/getBySn?${strSplicing(param)}`)
}

// 分页查询报表数据
export function getbbsj(params) {
  return http.post('/bbReportFormsDataController/page', QS.stringify(params))
}

// 通过id查询数据
export function getSjDesc(param) {
  return http.get(`/bbReportFormsDataController/getById?${strSplicing(param)}`)
}

// 修改报表数据
export function editBbsj(param) {
  return http.post('/bbReportFormsDataController/update', QS.stringify(param))
}

// 删除报表数据
export function delBbsj(param) {
  return http.get(`/bbReportFormsDataController/delete?${strSplicing(param)}`)
}

/**
 * 报表菜单
 */

// 报表设计生成菜单
export function generateMenus(url, params) {
  return http.post(`${url}/createMenu`, QS.stringify(params))
}
