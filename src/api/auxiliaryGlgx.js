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

// 查询辅助核算树
export function getFZHSTree(params) {
  return http.get(`/ZhangTaoFzhsxGlgx/fzhsxTree?${strSplicing(params)}`)
}

// 辅助核算关联关系列表
export function getFZHSList(id) {
  return http.get(`/ZhangTaoFzhsxGlgx/getListFzhsxGlgx?ztsn=${id}`)
}

// 新增辅助核算关联关系
export function addFZHSList(params) { // 添加科目模板
  return http.post('/ZhangTaoFzhsxGlgx/add', QS.stringify(params))
}

// 通过id查辅助核算关联关系的详情
export function getFZHSDecs(id) {
  return http.get(`/ZhangTaoFzhsxGlgx/getById?id=${id}`)
}

//  修改辅助核算关联关系
export function editFZHSList(params) { // 添加科目模板
  return http.post('/ZhangTaoFzhsxGlgx/update', QS.stringify(params))
}

// 删除辅助核算关联关系
export function delFZHSList(id) {
  return http.get(`/ZhangTaoFzhsxGlgx/delete?id=${id}`)
}

// 通过id查询关系表头
export function getFZHSHeader(id) {
  return http.get(`/ZhangTaoFzhsxGlgx/getTabById?id=${id}`)
}
// 通过id查询关系表头
export function getFZHSData(id) {
  return http.get(`/ZhangTaoFzhsxGlgx/getTabDataById?id=${id}`)
}

export function getFZHSSelect(params) {
  return http.get(`/ZhangTaoFzhsxGlgx/getListDataByfzhsSn?${strSplicing(params)}`)
}

export function FZHSSave(params) {
  return http.post('/ZhangTaoFzhsxGlgx/updateData', QS.stringify(params))
}
