/* 账套下辅助核算 */

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
  return http.get(`/ZhangTaoFuZhuHeSuanXiangController/ListCategory?${strSplicing(params)}`)
}

export function getTableData(params) { // 表分页
  return http.get(`/ZhangTaoFuZhuHeSuanXiangController/list?${strSplicing(params)}`)
}

export function getAllClass(params) { // 查询所有分类
  return http.get(`/ZhangTaoFuZhuHeSuanXiangController/getFlList?${strSplicing(params)}`)
}

export function addClass(params) { // 新增辅助核算分类
  return http.post('/ZhangTaoFuZhuHeSuanXiangController/add', QS.stringify(params))
}

export function updateClass(params) { // 编辑辅助核算分类
  return http.post('/ZhangTaoFuZhuHeSuanXiangController/update', QS.stringify(params))
}

export function delClass(params) { // 删除辅助核算分类
  return http.get(`/ZhangTaoFuZhuHeSuanXiangController/delete?${strSplicing(params)}`)
}

export function getInfoById(params) { // 通过id查询辅助核算分类
  return http.get(`/ZhangTaoFuZhuHeSuanXiangController/getFlById?${strSplicing(params)}`)
}

export function addFZHS(params) { // 新增辅助核算
  return http.post('/ZhangTaoFuZhuHeSuanXiangController/addFzhsx', QS.stringify(params))
}

export function updateFZHS(params) { // 编辑辅助核算
  return http.post('/ZhangTaoFuZhuHeSuanXiangController/updateFzhsx', QS.stringify(params))
}

export function delFZHS(params) {
  return http.get(`/ZhangTaoFuZhuHeSuanXiangController/deleteFzhsx?${strSplicing(params)}`)
}

export function getFZHSinfo(params) { // 获取辅助核算信息
  return http.get(`/ZhangTaoFuZhuHeSuanXiangController/getFzhsxById?${strSplicing(params)}`)
}

export function getGLSJTree() {
  return http.get('/dossier/dossierAndBusinessTree')
}

export function getFields(params) { // 通过关联树的id和type获取档案字段信息
  return http.get(`/dossier/getCols?${strSplicing(params)}`)
}

export function saveFields(params) {
  return http.post('/ZhangTaoFuZhuHeSuanXiangController/updateFields', QS.stringify(params))
}

export function changeStatus(params) {
  return http.get(`/ZhangTaoFuZhuHeSuanXiangController/updateStatus?${strSplicing(params)}`)
}

export function getFzhsDialogTree(params) { // 辅助核算对话框左侧树
  return http.get(`/ZhangTaoFuZhuHeSuanXiangController/getFzhsScAndFzhsTree?${strSplicing(params)}`)
}

export function getFzhsDialogTable(params) { //  通过辅助核算id查询右侧数据
  return http.get(`/bbDossierDataController/listFzhsDossierData?${strSplicing(params)}`)
}
