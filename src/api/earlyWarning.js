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

// 获取分类树
export function getTree() {
  return http.post('/category/earlyWarning/valuetree')
}

// 添加分类树
export function addTree(params) {
  return http.post('/category/earlyWarning/saveValueCategory', QS.stringify(params))
}

// 查询单个分类树
export function getTreeDesc(params) {
  return http.post(`/category/earlyWarning/getValueCategoryBySn?${strSplicing(params)}`)
}

// 修改分类树
export function editTree(params) {
  return http.post('/category/earlyWarning/saveValueCategory', QS.stringify(params))
}

// 删除分类树
export function delTree(params) {
  return http.post(`/category/earlyWarning/deleteValueCategory?${strSplicing(params)}`)
}

// 获取预警list
export function getEarlyList(params) {
  return http.post(`/earlywarning/getPage?${strSplicing(params)}`)
}

// 添加预警list
export function addEarly(params) {
  return http.post('/earlywarning/add', QS.stringify(params))
}

// 查询单个预警list
export function getEarlyDesc(params) {
  return http.post(`/earlywarning/getById?${strSplicing(params)}`)
}

// 修改预警list
export function editEarly(params) {
  return http.post('/earlywarning/update', QS.stringify(params))
}

// 删除分类树
export function delEarlyList(params) {
  return http.post(`/earlywarning/deleteById?${strSplicing(params)}`)
}

// 查询预警方式
export function getWarnWay(params) {
  return http.post(`/earlywarning/addData?${strSplicing(params)}`)
}

// 修改预警状态
export function changeEarly(params) {
  return http.post(`/earlywarning/updateStatus?${strSplicing(params)}`)
}

// 获取预警内容分页内容
export function getResult(params) {
  return http.post(`/earlywarningrecord/getPage?${strSplicing(params)}`)
}

// 获取预警内容分页内容
export function earlyTest(params) {
  return http.post(`/earlywarning/check?${strSplicing(params)}`)
}

// 改变检测结果状态
export function changeReault(params) {
  return http.post(`/earlywarningrecord/updateStatus?${strSplicing(params)}`)
}
