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

export function getColumns(params) { // 获取动态列
  return http.get(`/voucherManage/kjtxColumns?${strSplicing(params)}`)
}

export function getPageList(params) { // 通过不同状态获取分页信息
  return http.get(`/voucherManage/pages?${strSplicing(params)}`)
}

export function ShenHe(params) { // 审核
  return http.post('/voucherManage/check', QS.stringify(params))
}

export function XiaoShen(params) { // 销审
  return http.post('/voucherManage/cancelCheck', QS.stringify(params))
}

export function JiZhang(params) { // 记账
  return http.post('/voucherManage/record', QS.stringify(params))
}

export function FanJiZhang(params) { // 反记账
  return http.post('/voucherManage/cancelRecord', QS.stringify(params))
}

export function BiaoCuo(params) { // 标错
  return http.post('/voucherManage/markWrong', QS.stringify(params))
}

export function ZuoFei(params) { // 作废
  return http.post('/voucherManage/abandon', QS.stringify(params))
}

export function ShanChu(params) { // 删除
  return http.post('/voucherManage/delete', QS.stringify(params))
}

export function HaiYuan(params) { // 还原
  return http.post('/voucherManage/restore', QS.stringify(params))
}

export function getUserTree() {
  return http.get('/user/userTree')
}

export function getTemplist(params) { // 凭证模板批处理--获取模板列表
  return http.get(`/voucherManage/templates?${strSplicing(params)}`)
}

export function batchDeal(params) { // 凭证模板批处理
  return http.post('/voucherManage/batchDeal', QS.stringify(params))
}

export function getTempArr(params) { // 选择模板下拉(凭证薄页面)
  return http.get(`/zhangTaoPrintTemplateController/getList?${strSplicing(params)}`)
}

export function printTemplate(params) { // 打印凭证
  return http.get(`/zhangTaoPrintTemplateController/exportPdfPzzb?${strSplicing(params)}`)
}

export function getCurrentQJ(params) {
  return http.get(`/voucher/currentQj?${strSplicing(params)}`)
}
