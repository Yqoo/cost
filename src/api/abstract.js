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

// 常用摘要树
export function getAbstractTree(id) {
  return http.get(`/ztCyzyController/tree?ztsn=${id}`)
}

// 常用摘要分页
export function getCYZYtable(params) {
  return http.get(`/ztCyzyController/pages?${strSplicing(params)}`)
}

// 增加常用摘要分类
export function addCyzyFL(params) {
  return http.post('/ztCyzyController/addCategory', QS.stringify(params))
}

// 常用摘要分类详情
export function getCYZYFLdesc(params) {
  return http.get(`/ztCyzyController/getCategoryById?${strSplicing(params)}`)
}

// 修改常用摘要分类
export function editCyzyFL(params) {
  return http.post('/ztCyzyController/updateCategory', QS.stringify(params))
}

// 删除常用摘要分类
export function delCYZYFL(params) {
  return http.get(`/ztCyzyController/deleteCategory?${strSplicing(params)}`)
}

// 新增用的科目信息树
export function getkmxxTree(id) {
  return http.get(`/kuaiJiKeMu/tree?ztsn=${id}`)
}

// 通过名字生成助记码
export function getZjm(id) {
  return http.get(`/systemPingZhengLeiBie/getZJM?query=${id}`)
}

// 增加常用摘要
export function addCyzy(params) { // 添加科目模板
  return http.post('/ztCyzyController/addCyzy', QS.stringify(params))
}

// 常用摘要分类详情
export function getCYZYdesc(params) {
  return http.get(`/ztCyzyController/getCyzy?${strSplicing(params)}`)
}

// 修改常用摘要
export function editCyzy(params) {
  return http.post('/ztCyzyController/updateCyzy', QS.stringify(params))
}

// 删除常用摘要
export function delCYZY(params) {
  return http.get(`/ztCyzyController/deleteCyzy?${strSplicing(params)}`)
}
//  打印
export function zYPrint(params) {
  return http.get(`/PrintPdfController/exportPdfFzhs?${strSplicing(params)}`)
}
