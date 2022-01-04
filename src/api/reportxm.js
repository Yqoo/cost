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

export function getBbTxTree(params) { // 获取左侧树
  return http.get(`/bbReportTxController/tree?${strSplicing(params)}`)
}

export function addBbTxTree(params) { // 增加左侧树
  return http.post('/bbReportTxController/add', QS.stringify(params))
}

export function getTreeDesc(params) { // 查询左侧树节点详情
  return http.get(`/bbReportTxController/getById?${strSplicing(params)}`)
}

export function editBbTxTree(params) { // 修改左侧树节点
  return http.post('/bbReportTxController/update', QS.stringify(params))
}

export function delTree(params) { // 删除左侧树节点
  return http.get(`/bbReportTxController/delete?${strSplicing(params)}`)
}

export function getTable(params) { // 报表项目分页
  return http.get(`/bbReportXmController/pages?${strSplicing(params)}`)
}

export function getListFunction() { // 获取函数列表
  return http.get('/bbReportXmController/listFunction')
}

// export function getGlda(params) { // 档案树
//   return http.get(`/dossier/dossierAndBusinessTree?${strSplicing(params)}`)
// }

export function getGlda(params) { // 档案树
  return http.get(`/dossier/dossierAndBusinessTreeIdIsUuid?${strSplicing(params)}`)
}

export function getCols(params) { // 通过业务或者档案的编码和类型查询关联字段的下拉列表
  return http.get(`/bbReportXmController/getCols?${strSplicing(params)}`)
}

export function getDacs(params) { // 通过函数id查询参数
  return http.get(`/bbReportXmController/getParamsByHxId?${strSplicing(params)}`)
}

export function getXmDacs(params) { // 获取档案树详情
  return http.get(`/bbReportXmController/getById?${strSplicing(params)}`)
}

export function delXm(params) { // 删除档案项目
  return http.get(`/bbReportXmController/delete?${strSplicing(params)}`)
}

export function getwdLdTable(params) { // 查询维度和量度
  return http.get(`/bbReportXmController/getDimensionByXmId?${strSplicing(params)}`)
}

export function getwdList(params) { // 获取维度下拉列表
  return http.get(`/bbReportXmController/dossierDataList?${strSplicing(params)}`)
}

export function getwdFunction(params) { // 获取维度函数下拉列表
  return http.get(`/bbReportXmController/getXmHx?${strSplicing(params)}`)
}

export function getLdGlda(params) { // 档案下拉数据
  return http.get(`/bbReportXmController/dossierTree1?${strSplicing(params)}`)
}

export function getLdHS(params) { // 量度通过档案id和项目id查询函数下拉
  return http.get(`/bbReportXmController/getHsNameList?${strSplicing(params)}`)
}

export function getLdFHZ(params) { //  量度的函数返回值下拉
  return http.get(`/bbReportXmController/getReturnDataByHxId?${strSplicing(params)}`)
}

export function changeSyzt(params) { //  修改使用状态
  return http.post(`/bbReportXmController/updateStatus?${strSplicing(params)}`)
}

/**  报表项目档案 */

export function dossierTree(params) { // 左侧树
  return http.get(`/bbReportXmController/tree?${strSplicing(params)}`)
}

export function getMeasurement(params) {
  return http.get(`/bbReportXmController/getMeasureByXmId?${strSplicing(params)}`)
}

export function getDtree(params) {
  return http.get(`/bbReportXmController/dossierTree1?${strSplicing(params)}`)
}

// export function getDossierHeaders(params) { // 废弃
//   return http.get(`/bbReportXmController/getDossierOrTabBt?${strSplicing(params)}`)
// }

export function getDossierData(params) { // 获取档案数据
  return http.get(`/bbReportXmController/getDossierOrTabData?${strSplicing(params)}`)
}

export function delDossierData(params) { // 删除档案数据
  return http.get(`/bbDossierDataController/delete?${strSplicing(params)}`)
}

export function getDossierDataByDS(params) { // 通过项目编码查询源数据下拉
  return http.get(`/bbReportXmController/getDossierDataByDS?${strSplicing(params)}`)
}

export function getLDTable(params) { // 通过档案数据id查询量度列表数据
  return http.get(`/bbDossierDataController/listBbMeasureFormula?${strSplicing(params)}`)
}

export function addDossierData(params) { // 新增档案数据
  return http.post('/bbDossierDataController/add', QS.stringify(params))
}

export function editDossierData(params) { // 修改档案数据
  return http.post('/bbDossierDataController/update', QS.stringify(params))
}

/**
 * 修改后的接口
 */

// 通过报表项目id项目选项档案数据
export function getDASJ(params) {
  return http.get(`/bbDossierDataController/getTreeAndDossierData?${strSplicing(params)}`)
}

// 通过档案数据id查询自己和子集的数据
export function getDASJData(params) {
  return http.get(`/bbDossierDataController/getDossierData?${strSplicing(params)}`)
}

// 查询除开自己的档案树
export function getHigherup(params) {
  return http.get(`/bbDossierDataController/getTreeNeMy?${strSplicing(params)}`)
}

// 批量设置pid
export function setDataPid(params) {
  return http.get(`/bbDossierDataController/setDossierDataPid?${strSplicing(params)}`)
}

// 选择档案弹框左侧树
export function selectFileTree(params) {
  return http.get(`/bbDossierDataController/dossierAndBusinessTree?${strSplicing(params)}`)
}

// 选择档案弹框右侧表格数据
export function selectFileTable(params) {
  return http.get(`/bbDossierDataController/getDossierDataById?${strSplicing(params)}`)
}

// 选择档案弹框右侧表格数据填充
export function addTableData(params) {
  return http.post('/bbDossierDataController/addDossierData', QS.stringify(params))
}

// 设置公式弹框关联其他数据
export function linkOtherData(params) {
  return http.get(`/bbDossierDataController/getDataTree?${strSplicing(params)}`)
}

//  项目关联的档案下拉数据
export function getGLDossier(params) {
  return http.get(`/bbDossierDataController/getGLDossier?${strSplicing(params)}`)
}

//  通过中间树id，获取右侧表格数据
export function getTableById(params) {
  return http.get(`/bbDossierDataController/getById?${strSplicing(params)}`)
}
