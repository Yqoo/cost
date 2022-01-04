import http from './http'
import QS from 'qs'

function strSplicing(params) {
  let url = ''
  Object.keys(params).forEach(key => {
    url += `${key}=${params[key]}&`
  })
  return url.slice(0, -1)
}

export function login(params) {
  return http.post('/login', QS.stringify(params))
}

export function getZT() {
  return http.get('/systemZtinfo/zts ')
}

export function setTargetZT(params) {
  return http.post('/systemZtinfo/setUserZt', QS.stringify(params))
}

export function getUnits() {
  return http.get('/systemZtinfo/unitAndZts')
}

export function logout(url, params) {
  return http.get(url, params)
}

export function phoneCode(params) {
  return http.get(`/loginCode?tel=${params}`)
}

export function getFnTree() {
  return http.get('/unit/tree')
}

export function getPage(params) {
  return http.get(`/user/pages?${strSplicing(params)}`)
}

export function getDept(params) {
  return http.get(`/dept/multipleList?${strSplicing(params)}`)
}

export function addUser(params) {
  return http.post('/user/add', QS.stringify(params))
}

export function updateUser(params) {
  return http.post('/user/update', QS.stringify(params))
}

export function delUser(params) {
  return http.post('/user/delete', QS.stringify(params))
}

export function getDetail(params) {
  return http.get(`/user/getById?${strSplicing(params)}`)
}

export function updateUserStatu(params) {
  return http.post('/user/updateStatus', QS.stringify(params))
}

export function setDate(date) {
  return http.post('/systemZtinfo/ywrq', QS.stringify(date))
}

export function getKJZD() { // 获取会计制度
  return http.get('systemKuaiJiZhiDu/listAllData')
}

export function getRoleTree() {
  return http.get('/role/tree')
}

export function getMetaList() {
  return http.post('/systemDataRole/list')
}

export function setFnRole(params) {
  return http.post('/user/updateUserRole', QS.stringify(params))
}

export function setMetaRole(params) {
  return http.post('/user/updateUserDataRole', QS.stringify(params))
}

export function updatePwd(params) {
  return http.post('/user/updatePwd', QS.stringify(params))
}

export function telCode(params) {
  return http.get(`/user/getCode?${strSplicing(params)}`)
}

export function bindTel(params) {
  return http.post('/user/bindTel', QS.stringify(params))
}

export function unBindTel(params) {
  return http.post('/user/unBindTel', QS.stringify(params))
}
