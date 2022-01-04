import http from './http'
import QS from 'qs'

function strSplicing(params) {
  let url = ''
  Object.keys(params).forEach(key => {
    url += `${key}=${params[key]}&`
  })
  return url.slice(0, -1)
}

export function carryList(params) {
  return http.get(`/customCarryover/list?${strSplicing(params)}`)
}

export function upOrDown(params) {
  return http.post('/customCarryover/move', QS.stringify(params))
}

export function getQJ(params) {
  return http.get(`/customCarryover/qj?${strSplicing(params)}`)
}

export function detail(params) {
  return http.get(`/customCarryover/detail?${strSplicing(params)}`)
}

export function pzList(params) {
  return http.get(`/ztPzlbController/listAll?${strSplicing(params)}`)
}

export function txList(params) {
  return http.get(`/systemKuaiJiTiXi/getAllKuaiJiTiXiByZhangTaoSn?${strSplicing(params)}`)
}

export function saveSetting(params) {
  return http.post('/customCarryover/save', QS.stringify(params))
}

export function getZzfs() {
  return http.get('/customCarryover/zzfs')
}

export function saveZDYDatas(params) {
  return http.post('/customCarryover/save', QS.stringify(params))
}

export function delZDYDatas(params) {
  return http.post('/customCarryover/delete', QS.stringify(params))
}

export function generatePZ(params) {
  return http.get(`/customCarryover/createPz?${strSplicing(params)}`)
}

export function getKJKMTree(params) {
  return http.get(`/customCarryover/treeByZtsn?${strSplicing(params)}`)
}
