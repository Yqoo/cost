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

/*
===================接口管理api
*/

// 查询所以接口
export function getList() {
  return http.get('/fpInterfaceController/list')
}

// 通过接口id查询接口参数
export function getJKCS(id) {
  return http.get(`/fpInterfaceController/listByInterfaceId?interfaceId=${id}`)
}

// 通过接口id查询接口参数
export function getDataType(id) {
  return http.get('/fpInterfaceController/listDataType')
}

// 新增接口参数
export function addJKCS(params) {
  return http.post('/fpInterfaceController/addParam', QS.stringify(params))
}

// 新增接口参数
export function getJKCSDesc(id) {
  return http.get(`/fpInterfaceController/getParamById?id=${id}`)
}

// 修改接口参数
export function editJKCS(params) {
  return http.post('/fpInterfaceController/updateParam', QS.stringify(params))
}

// 删除接口参数
export function delJKCS(id) {
  return http.get(`/fpInterfaceController/deleteParam?id=${id}`)
}

// 获取接口详情
export function getJKDesc(id) {
  return http.get(`/fpInterfaceController/getById?id=${id}`)
}

// 获取接口详情
export function delJK(id) {
  return http.get(`/fpInterfaceController/delete?id=${id}`)
}

// 验证接口回显
export function getChenck(id) {
  return http.get(`/fpInterfaceController/verificationFp?id=${id}`)
}

// 查询所有识别接口,用于验真测试下拉
export function getSelect() {
  return http.get('/fpInterfaceController/listRead')
}

// 验证接口-验真
export function checkJK(params) {
  return http.get(`/fpInterfaceController/verificationFpCheck?${strSplicing(params)}`)
}

// 改变接口状态
export function changeSyzt(params) {
  return http.post(`/fpInterfaceController/update?${strSplicing(params)}`)
}

/*
====================================================================================================================
====================================================================================================================
====================================================================================================================
====================================================================================================================
====================================================================================================================
*/

/*
============================发票类型api
*/

// 获取发票数据列表
export function getCardsList() {
  return http.get('/fpInvoiceTypeController/list')
}

// 通过id查询发票详细
export function getCardDesc(id) {
  return http.get(`/fpInvoiceTypeController/getById?id=${id}`)
}

// 删除发票
export function delCard(id) {
  return http.get(`/fpInvoiceTypeController/delete?id=${id}`)
}

// 要素对应业务列表
export function getYWList() {
  return http.get('/defineBusiness/list')
}

// 主要(明细)要素对应表
export function getYSdyList(id) {
  return http.get(`/businessTab/tree?businessId=${id}`)
}

// 主要(明细)要素对应字段
export function getTabColumns(id) {
  return http.get(`/businessTab/getTabColumns?tabId=${id}`)
}

// 发票与接口关系列表
export function getJkList(id) {
  return http.get(`/fpInvoiceTypeController/listFpAndJkByFpId?fpId=${id}`)
}

// 查询接口参数和要素的关系列表
export function getJKYSCS(params) {
  return http.get(`/fpInvoiceTypeController/listJkcsAndYsGx?${strSplicing(params)}`)
}

// 查询所有数据
export function getALLjk() {
  return http.get('/fpInterfaceController/list')
}
