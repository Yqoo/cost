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

export function getFilterTJ() { //  获取左侧过滤条件中的，识别状态和发票类型、过滤条件
  return http.get('/fpfolder/conditionList')
}

export function getTitleList(params) { // 通过切换按钮获取所有发票列表
  return http.post(`/fpfolder/fpList?${strSplicing(params)}`)
}

/* 右侧接口 */
export function getStatusDesc() {
  return http.get('/fpfolder/status')
}

export function renameFolder(params) {
  return http.post('/fpfolder/rename', QS.stringify(params))
}

export function createFolder(params) {
  return http.post('/fpfolder/addFolder', QS.stringify(params))
}

export function deleteFile(params) {
  return http.post('/fpfolder/delete', QS.stringify(params))
}

export function getMessage(params) {
  return http.get(`/fpfolder/getMessages?${strSplicing(params)}`)
}

export function updateMessage(params) {
  return http.post('/fpfolder/leaveMessage', QS.stringify(params))
}

export function delMessage(params) {
  return http.post('/fpfolder/deleteMessage', QS.stringify(params))
}

export function submit(params) {
  return http.post('/fpfolder/commit', QS.stringify(params))
}

export function backfp(params) {
  return http.post('/fpfolder/cancelCommit', QS.stringify(params))
}

export function identify(params) {
  return http.post('/fpfolder/identify', QS.stringify(params))
}

export function preview(params) {
  return http.get(`/fpfolder/preview?${strSplicing(params)}`)
}

export function cutting(params) { // 发票剪切
  return http.post('/fpfolder/move', QS.stringify(params))
}

/*
========================================================================================================
发票审核接口
*/
export function getFPJ() {
  return http.get('/fpcheck/folderTree')
}

export function getFPTable(params) {
  return http.post('/fpcheck/queryPage', QS.stringify(params))
}

export function checkIdentify(params) { // 验证
  return http.post('/fpcheck/checkIdentifyStatus', QS.stringify(params))
}

export function checkStatus(params) { // 复核
  return http.post('/fpcheck/checkStatus', QS.stringify(params))
}

export function abandonCheck(params) { // 弃复
  return http.post('/fpcheck/abandonCheck', QS.stringify(params))
}

export function sendBack(params) { // 退回
  return http.post('/fpcheck/sendBack', QS.stringify(params))
}

export function recoverSendBack(params) { // 弃退
  return http.post('/fpcheck/recoverSendBack', QS.stringify(params))
}

export function leaveMessage(params) {
  return http.post('/fpcheck/leaveMessage', QS.stringify(params))
}
