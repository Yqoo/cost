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

// ======== 云应用 apis  ==================================================

export function getBasicInfo() {
  return http.get('/fpyun/info')
}

export function addFPTitle(params) { // 新增发票抬头
  return http.post('/fpyun/addTitle', QS.stringify(params))
}

export function updateFPTitle(params) {
  return http.post('/fpyun/updateTitle', QS.stringify(params))
}

export function getFPTileInfo(params) { // 通过id获取抬头详情
  return http.get(`/fpyun/getTitleById?${strSplicing(params)}`)
}

export function getZTInfo(params) { // 通过单位id获取账套列表
  return http.get(`/systemZtinfo/listByUnitId?${strSplicing(params)}`)
}

export function titleRistZt(params) { // 抬头关联账套
  return http.post('/fpyun/addTitleZt', QS.stringify(params))
}

export function cancelRiseZt(params) { // 取消抬头账套关联
  return http.post('/fpyun/deleteTitleZt', QS.stringify(params))
}

// ======== 发票抬头管理 apis =============================================

// 获取左侧单位树
export function getTree() {
  return http.get('/unit/tree?notAll=true')
}

// 获取单位抬头列表
export function getUnitTitle(id) {
  return http.get(`/fpyun/titleList?unitId=${id}`)
}

// 修改抬头状态
export function changeFPStatus(params) {
  return http.post(`/fpyun/titleStatus?${strSplicing(params)}`)
}

// 修改抬头账套关联状态
export function changeZTStatus(params) {
  return http.post(`/fpyun/titleZtStatus?${strSplicing(params)}`)
}

// 删除抬头
export function delTitle(params) {
  return http.post(`/fpyun/deleteTitle?${strSplicing(params)}`)
}
