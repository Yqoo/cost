import http from './http'
import QS from 'qs'

function strSplicing(params) {
  let url = ''
  Object.keys(params).forEach(key => {
    url += `${key}=${params[key]}&`
  })
  return url.slice(0, -1)
}

/* 模块 */
export function getModelTree() {
  return http.get('/model/tree')
}

export function getApisTree() {
  return http.get('/model/controllers')
}

export function getModelPage(params) {
  return http.get(`/model/pages?${strSplicing(params)}`)
}

export function getApis(params) {
  return http.get(`/model/apis?${strSplicing(params)}`)
}

export function addModel(params) {
  return http.post('/model/add', QS.stringify(params))
}

export function updateModel(params) {
  return http.post('/model/update', QS.stringify(params))
}

export function deleteModel(params) {
  return http.post('/model/delete', QS.stringify(params))
}

export function getModelDetail(params) {
  return http.get(`/model/getById?${strSplicing(params)}`)
}

export function changeStatus(params) {
  return http.post('/model/updateStatus', QS.stringify(params))
}

export function setModelApis(params) {
  return http.post('/model/setApis', QS.stringify(params))
}

/* 菜单目录 */

export function folderTree() {
  return http.get('/menu/folderTree')
}

export function getMenuPage(params) {
  return http.get(`/menu/pages?${strSplicing(params)}`)
}

export function addFolder(params) {
  return http.post('/menu/add', QS.stringify(params))
}

export function updateFolder(params) {
  return http.post('/menu/update', QS.stringify(params))
}

export function getFolderDetail(params) {
  return http.get(`/menu/getById?${strSplicing(params)}`)
}

export function deleteFM(params) {
  return http.post('/menu/delete', QS.stringify(params))
}

export function getModelList() {
  return http.get('/menu/modelTree')
}

export function sort(params) {
  return http.post('/menu/sort', QS.stringify(params))
}
