/* 系统下辅助核算 */

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

export function getTreeData(params) { // 树
  return http.get(`/systemFuZhuHeSuan/tree?${strSplicing(params)}`)
}

export function getTableData(params) { // 表分页
  return http.get(`/systemFuZhuHeSuan/List?${strSplicing(params)}`)
}

export function getAllClass() { // 查询所有分类
  return http.get('/systemFuZhuHeSuan/ListCategory')
}

export function addClass(params) { // 新增辅助核算分类
  return http.post('/systemFuZhuHeSuan/add', QS.stringify(params))
}

export function updateClass(params) { // 编辑辅助核算分类
  return http.post('/systemFuZhuHeSuan/update', QS.stringify(params))
}

export function delClass(params) { // 删除辅助核算分类
  return http.get(`/systemFuZhuHeSuan/delete?${strSplicing(params)}`)
}

export function getInfoById(params) { // 通过id查询辅助核算分类
  return http.get(`/systemFuZhuHeSuan/getById?${strSplicing(params)}`)
}

export function addFZHS(params) { // 新增辅助核算
  return http.post('/systemFuZhuHeSuan/addFzhs', QS.stringify(params))
}

export function updateFZHS(params) { // 编辑辅助核算
  return http.post('/systemFuZhuHeSuan/updateFzhs', QS.stringify(params))
}

export function delFZHS(params) {
  return http.get(`/systemFuZhuHeSuan/deleteFzhs?${strSplicing(params)}`)
}

export function getFZHSinfo(params) { // 获取辅助核算信息
  return http.get(`/systemFuZhuHeSuan/getByIdFzhs?${strSplicing(params)}`)
}

export function getGLSJTree(params) {
  return http.get(`/dossier/dossierAndBusinessTree?${strSplicing(params)}`)
}

export function getFields(params) { // 通过关联树的id和type获取档案字段信息
  return http.get(`/dossier/getCols?${strSplicing(params)}`)
}

export function saveFields(params) {
  return http.post('/systemFuZhuHeSuan/updateFields', QS.stringify(params))
}

export function changeStatus(params) {
  return http.get(`/systemFuZhuHeSuan/updateFzhsStatus?${strSplicing(params)}`)
}

/* 辅助核算方案 */

export function getFangAnList() {
  return http.get('/fuZhuHeSuanFangAn/all')
}

export function getFZHSList(url, params) { // 获取辅助核算方案下的辅助核算列表
  return http.get(`${url}?${strSplicing(params)}`) // /fuZhuHeSuanFangAn/fzhsList
}

export function getTableHeader(url, params) { // 获取右侧辅助核算项表头数据
  return http.get(`${url}?${strSplicing(params)}`) // /fuZhuHeSuanFangAn/columns
}

export function getFangAnPage(url, params) {
  return http.get(`${url}?${strSplicing(params)}`)
}

export function getKMList() {
  return http.get('/kuaiJiKeMuMuBan/list')
}

export function addFangAn(params) { // 添加辅助核算方案
  return http.post('/fuZhuHeSuanFangAn/add', QS.stringify(params))
}

export function getFangAnInfo(params) { //  获取方案详情
  return http.get(`/fuZhuHeSuanFangAn/getBySn?${strSplicing(params)}`)
}

export function updateFangAn(params) { // 编辑辅助核算方案
  return http.post('/fuZhuHeSuanFangAn/update', QS.stringify(params))
}

export function deleteFangAn(params) { // 删除辅助核算方案
  return http.post('/fuZhuHeSuanFangAn/delete', QS.stringify(params))
}

export function changeRowStatus(url, params) { // 修改数据控制权限（是否可修改删除和是否可添加下级）
  return http.post(url, QS.stringify(params))
}

export function delSJ(params) {
  return http.post('/fuZhuHeSuanFangAn/deleteData', QS.stringify(params))
}

export function delSJZT(params) {
  return http.post('/ZhangTaoFuZhuHeSuanXiangController/deleteData', QS.stringify(params))
}
/* 系统下辅助核算类别 导入 导出 打印fzhsSn ids ztsn faSn  */

export function fzhsImport(file) {
  return http.post(`/systemFuZhuHeSuan/importFile?${strSplicing(file)}`)
}

export function fzhsExport(type) {
  return http.get(`/systemFuZhuHeSuan/export?${strSplicing(type)}`)
}

export function fzhsPrint(params) {
  return http.get(`/PrintPdfController/exportPdfFzhs?${strSplicing(params)}`)
}

/* 账套下辅助核算类别 导入 导出 打印fzhsSn ids ztsn faSn  */

export function fzhsZTImport(file, ztsn) {
  return http.post(`/ZhangTaoFuZhuHeSuanXiangController/importFile?${strSplicing(file, ztsn)}`)
}

export function fzhsZTExport(type, ztsn) {
  return http.get(`/ZhangTaoFuZhuHeSuanXiangController/export?${strSplicing(type, ztsn)}`)
}

/* 系统下辅助核算方案 导入 导出 打印fzhsSn ids ztsn faSn  */

export function fzhsFAImport(file) {
  return http.post(`/fuZhuHeSuanFangAn/importFile?${strSplicing(file)}`)
}

export function fzhsFAExport(type) {
  return http.get(`/fuZhuHeSuanFangAn/export?${strSplicing(type)}`)
}

export function fzhsFAPrint(params) {
  return http.get(`/PrintPdfController/exportPdfFzhs?${strSplicing(params)}`)
}

/* 账套下辅助核算项 导入 导出 打印fzhsSn ids ztsn faSn  */

export function fzhsZTFAImport(file) {
  return http.post(`/fuZhuHeSuanFangAn/importFile?${strSplicing(file)}`)
}

export function fzhsZTFAExport(type) {
  return http.get(`/fuZhuHeSuanFangAn/export?${strSplicing(type)}`)
}

export function issueZts(param) { // 账套多选树
  return http.get(`/fuZhuHeSuanFangAn/issueZts?${strSplicing(param)}`)
}

export function issueXF(param) {
  return http.post(`/fuZhuHeSuanFangAn/issue?${strSplicing(param)}`)
}

export function updateBmfa(params) {
  return http.post('/fuZhuHeSuanFangAn/updateBmfa', QS.stringify(params))
}
