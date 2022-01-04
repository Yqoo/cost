// 财务期末结账接口
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

// 获取账套所有年度信息以及当前年度
export function getYearInfo(params) {
  return http.get(`/jieZhang/ztnd?${strSplicing(params)}`)
}

// 获取账套期间列表
export function getZTQJList(params) {
  return http.get(`/jieZhang/qjs?${strSplicing(params)}`)
}

// 结账
export function jieZhang(params) {
  return http.post('/jieZhang/jz', QS.stringify(params))
}

// 反结账
export function fanJieZhang(params) {
  return http.post('/jieZhang/fjz', QS.stringify(params))
}
