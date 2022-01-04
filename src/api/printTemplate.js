// 打印模板设置接口
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

// 左侧分类树
export function getPrintTree(params) {
  return http.get(`/zhangTaoPrintTemplateController/tree?${strSplicing(params)}`)
}

// 获取分页
export function getPrintTable(params) {
  return http.get(`/zhangTaoPrintTemplateController/page?${strSplicing(params)}`)
}

// 通过ID获取信息
export function getInfoById(params) {
  return http.get(`/zhangTaoPrintTemplateController/getById?${strSplicing(params)}`)
}

// 删除打印模板
export function delPrintTemplate(params) {
  return http.get(`/zhangTaoPrintTemplateController/delete?${strSplicing(params)}`)
}

// 修改状态
export function editPrintStatus(params) {
  return http.post('/zhangTaoPrintTemplateController/update', QS.stringify(params))
}

// 打印数据参数
export function getDataParam(params) {
  return http.get(`/zhangTaoPrintTemplateController/getDataParam?${strSplicing(params)}`)
}

// 打印设置参数
export function getSetParam() {
  return http.get('/zhangTaoPrintTemplateController/getSetParam')
}
