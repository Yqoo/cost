/* 填制凭证 */

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
export function getPingZhengList(params) { // 查询所有账套凭证类别
  return http.get(`/ztPzlbController/listAll?${strSplicing(params)}`)
}

export function getPingZhengNum(params) { // 获取凭证号
  return http.get(`/voucher/getPzh?${strSplicing(params)}`)
}

export function getChildTX(params) { // 查询账套下所有的子会计体系
  return http.get(`/systemKuaiJiZhiDu/getAllChildKJTX?${strSplicing(params)}`)
}

export function getKEMUTree(params) { // 通过账套ztsn获取会计体系下的会计科目
  return http.get(`/kuaiJiKeMu/treeByZtsn?${strSplicing(params)}`)
}

export function getZhaiYao(params) { // 查询常用摘要
  return http.get(`/ztCyzyController/listByZtsn?${strSplicing(params)}`)
}

export function getFZHSTableHeader(params) { // 查询辅助核算项的表头
  return http.get(`/ZhangTaoFuZhuHeSuanXiangController/getFields?${strSplicing(params)}`)
}

export function getFZHSSelectFromHeader(params) { // 通过表头某字段查询下拉数据
  return http.post('/ZhangTaoFuZhuHeSuanXiangController/getFieldsAllXiaLa', QS.stringify(params))
}

export function getCiYaoSuData(params) { // 通过表头和选中的数据查询关联关系
  return http.get(`/ZhangTaoFuZhuHeSuanXiangController/getCiYaoSuData?${strSplicing(params)}`)
}

export function savePingZheng(params) { // 保存凭证
  return http.post('/voucher/save', params)
}

export function getPingZhenDetail(params) { // 通过id获取凭证详情
  return http.get(`/voucher/getById?${strSplicing(params)}`)
}

export function queryPingZheng(params) { //  查询凭证
  return http.get(`/voucher/cxpz?${strSplicing(params)}`)
}

export function getTempTreeAndTable(params) { // 获取模板树及模板内容
  return http.get(`/voucher/templates?${strSplicing(params)}`)
}

export function addZyCyzy(params) { // 新增摘要
  return http.post('/ztCyzyController/addCyzy', QS.stringify(params))
}

export function cxdh(params) { // 查询凭证断号
  return http.get(`/voucher/cxdh?${strSplicing(params)}`)
}

export function getKjqj(params) { // 获取会计期间列表
  return http.get(`/voucher/getKjqj?${strSplicing(params)}`)
}

export function saveTemp(params) { // 存为模板
  return http.post('/voucher/saveAsTemplate', QS.stringify(params))
}

export function setUserParams(params) { // 设置用户参数
  return http.post('/voucher/setUserParams', QS.stringify(params))
}

export function getUserParams() { // 获取用户参数
  return http.get('/voucher/getUserParams')
}

export function getSystemParams(params) { // 获取系统参数
  return http.get(`/voucher/systemParams?${strSplicing(params)}`)
}

export function saveReview(params) {
  return http.post('/voucher/leaveMessage', QS.stringify(params))
}

export function getReviews(params) {
  return http.get(`/voucher/getMessages?${strSplicing(params)}`)
}

export function delReview(params) {
  return http.post('/voucher/deleteMessage', QS.stringify(params))
}

export function getAbstractTable(params) {
  return http.get(`/ztCyzyController/listByZtsn?${strSplicing(params)}`)
}

export function getXjll(params) {
  return http.get(`/voucher/xjll?${strSplicing(params)}`)
}

export function saveXjll(params) {
  return http.post('/voucher/saveXjll', QS.stringify(params))
}

export function autoXjll(params) {
  return http.get(`/voucher/autoAllotXjll?${strSplicing(params)}`)
}

export function getDfkmTree(params) {
  return http.get(`voucher/dfkmTree?${strSplicing(params)}`)
}

export function getXjllTree(params) {
  return http.get(`/zhangTaoXianJinLiuLiangXiangMuController/tree?${strSplicing(params)}`)
}

export function clearXjll(params) {
  return http.get(`/voucher/clearXjll?${strSplicing(params)}`)
}

export function getFiles(params) {
  return http.get(`/voucher/files?${strSplicing(params)}`)
}

export function delFiles(params) {
  return http.post('/voucher/deleteFiles', QS.stringify(params))
}

export function getPZJump(params) {
  return http.get(`/voucher/others?${strSplicing(params)}`)
}
