import http from './http'
import QS from 'qs'

function strSplicing(params) {
  let url = ''
  Object.keys(params).forEach(key => {
    url += `${key}=${params[key]}&`
  })
  return url.slice(0, -1)
}
/* 会计期间方案 */
export function getProgrammeTree() {
  return http.get('/systemKuaiJiQiJianfangAnFenLei/tree')
}

export function getProgrammePage(params) {
  return http.get(`/systemKuaiJiQiJianfangAn/pages?${strSplicing(params)}`)
}

export function getProgrammeTableDate(params) {
  return http.get(`/systemKuaiJiQiJianfangAnFenLei/getFangAnList?${strSplicing(params)}`)
}

export function addKJQJFL(params) {
  return http.post('/systemKuaiJiQiJianfangAnFenLei/add', QS.stringify(params))
}

export function updateKJQJFL(params) {
  return http.post('/systemKuaiJiQiJianfangAnFenLei/update', QS.stringify(params))
}

export function getInfo(params) {
  return http.get(`/systemKuaiJiQiJianfangAnFenLei/getById?${strSplicing(params)}`)
}

export function deleteTree(params) {
  return http.get(`/systemKuaiJiQiJianfangAnFenLei/delete?${strSplicing(params)}`)
}

/* 会计制度 */
export function getSTtree(params = '') {
  return http.get(`/systemKuaiJiZhiDu/tree?${strSplicing(params)}`)
}

export function getKJTable(params) {
  return http.get(`/systemKuaiJiZhiDu/pages?${strSplicing(params)}`)
}

export function getHYTable(params) {
  return http.get(`/systemKuaiJiZhiDu/hybb/list?${strSplicing(params)}`)
}

export function addType(params) {
  return http.post('/category/add', QS.stringify(params))
}

export function delType(params) {
  return http.get(`/systemKuaiJiZhiDu/deleteCategory?${strSplicing(params)}`)
}

export function getTypeInfo(params) {
  return http.get(`/category/getById?${strSplicing(params)}`)
}

export function updateType(params) {
  return http.post('/category/update', QS.stringify(params))
}

export function getTX() {
  return http.get('/systemKuaiJiZhiDu/getAllKJTX')
}

export function addKJZD(params) {
  return http.post('/systemKuaiJiZhiDu/add', QS.stringify(params))
}

export function updateKJZD(params) {
  return http.post('/systemKuaiJiZhiDu/update', QS.stringify(params))
}

export function getKJZDinfo(params) {
  return http.get(`/systemKuaiJiZhiDu/getKjzdById?${strSplicing(params)}`)
}

export function deleteZIDU(params) {
  return http.get(`/systemKuaiJiZhiDu/delete?${strSplicing(params)}`)
}

export function updateStatu(params) {
  return http.get(`/systemKuaiJiZhiDu/updateStatus?${strSplicing(params)}`)
}

export function addHYBB(params) {
  return http.post('/systemKuaiJiZhiDu/hybb/add', QS.stringify(params))
}

export function updateHYB(params) {
  return http.post('/systemKuaiJiZhiDu/hybb/update', QS.stringify(params))
}

export function chaneHYStatu(params) {
  return http.get(`/systemKuaiJiZhiDu/hybb/updateStatus?${strSplicing(params)}`)
}

export function delHYBB(params) {
  return http.get(`/systemKuaiJiZhiDu/hybb/delete?${strSplicing(params)}`)
}

/* 会计体系 */

export function getTxTree() {
  return http.get('/systemKuaiJiTiXi/tree')
}

export function addTX(params) {
  return http.post('/systemKuaiJiTiXi/add', QS.stringify(params))
}

export function updateTX(params) {
  return http.post('/systemKuaiJiTiXi/update', QS.stringify(params))
}

export function deleteTX(params) {
  return http.post('/systemKuaiJiTiXi/deleteBySn', QS.stringify(params))
}

export function getChildBySn(params) {
  return http.get(`/systemKuaiJiTiXi/getChildBySn?${strSplicing(params)}`)
}

export function getTiXiInfo(params) {
  return http.get(`/systemKuaiJiTiXi/getAllKuaiJiTiXiByKuaiJiTiXiSn?${strSplicing(params)}`)
}

export function setStatus(params) {
  return http.post('/systemKuaiJiTiXi/updateUserFulBySn', QS.stringify(params))
}

/* 会计要素 */

export function getKuaiJiYaoSu(params) {
  return http.get(`/systemKuaiJiYaoSu/selectListByKuaiJiTiXiSn?${strSplicing(params)}`)
}

export function addAndUpdateYS(params) {
  return http.post('/systemKuaiJiYaoSu/addAndUpdate', QS.stringify(params))
}

export function deleteYS(params) {
  return http.post('/systemKuaiJiYaoSu/deleteByIds', QS.stringify(params))
}

/* 会计恒等式 */

export function updateIdentityBySn(params) {
  return http.post('/systemKuaiJiTiXi/updateIdentityBySn', QS.stringify(params))
}

/* 会计期间方案 导入 导出 打印ids type ztsn  */

export function kjqjImport(file) {
  return http.post(`/systemKuaiJiQiJianfangAn/importFile?${strSplicing(file)}`)
}

export function kjqjExport(type) {
  return http.get(`/systemKuaiJiQiJianfangAn/export?${strSplicing(type)}`)
}

export function kjqjPrint(params) {
  return http.get(`/PrintPdfController/exportPdf?${strSplicing(params)}`)
}

/* 会计制度 导入 导出 打印ids type ztsn  */

export function kjzdImport(file) {
  return http.post('/systemKuaiJiZhiDu/importFile', QS.stringify(file))
}

export function kjzdExport(type) {
  return http.get(`/systemKuaiJiZhiDu/export?${strSplicing(type)}`)
}

export function kjzdPrint(params) {
  return http.get(`/PrintPdfController/exportPdf?${strSplicing(params)}`)
}

/* 系统下会计体系 导入 导出 打印 ids ztsn type  */

export function kjtxImport(formData) {
  return http.post('/systemKuaiJiTiXi/importFile', formData)
}

export function kjtxExport(type) {
  return http.get(`/systemKuaiJiTiXi/export?${strSplicing(type)}`)
}

export function kjtxPrint(params) {
  return http.get(`/PrintPdfController/exportPdfFzhs?${strSplicing(params)}`)
}

/* 账务账表 */

export function reportNames() { // 获取账表类型
  return http.get('/searchplan/reportNames')
}

export function getFangAnPlans(params) { // 获取查询方案列表
  return http.get(`/searchplan/plans?${strSplicing(params)}`)
}

export function getFields(params) { // 通过方案id查询过滤条件列表以及默认值
  return http.get(`/searchplan/getPlanById?${strSplicing(params)}`)
}

export function getFieldsData(params) {
  return http.get(`/searchplan/getValuesByType?${strSplicing(params)}`)
}

export function getHeaders(params) {
  return http.get(`/kuaiJiKeMu/getTab?${strSplicing(params)}`)
}

export function contrastData(params) {
  return http.get(`/kuaiJiKeMu/getRelations?${strSplicing(params)}`)
}

export function getRelationTable(params) {
  return http.get(`/kuaiJiKeMu/getPreKm?${strSplicing(params)}`)
}

export function setRelation(params) {
  return http.post('/kuaiJiKeMu/updateRelations', QS.stringify(params))
}

export function getReport(params) {
  return http.post('/searchplan/selectReportSearchPlan', QS.stringify(params))
}

export function getList(params) {
  return http.get(`/searchplan/plans?${strSplicing(params)}`)
}

export function saveFangAn(params) {
  return http.post('/searchplan/savePlan', QS.stringify(params))
}

export function getParam(params) { // 参数查询
  return http.get(`/asposePdfController/getParam?${strSplicing(params)}`)
}
