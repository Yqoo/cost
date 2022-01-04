import http from './http'
import QS from 'qs'

function strSplicing(params) {
  let url = ''
  Object.keys(params).forEach(key => {
    url += `${key}=${params[key]}&`
  })
  return url.slice(0, -1)
}

export function saveXML(params) {
  return http.post('/kettle/saveXml', QS.stringify(params))
}

export function getDataResource(params) {
  return http.post('/datasource/dataTree', QS.stringify(params))
}

/* 业务场景 */

export function getSceneTree() {
  return http.post('/category/SCENE/tree')
}

export function getPinYin(params) {
  return http.get(`/category/getZJM?${strSplicing(params)}`)
}

export function getTypeInfo(params) {
  return http.post('/category/SCENE/get', QS.stringify(params))
}

export function delType(params) {
  return http.post('/category/SCENE/delete', QS.stringify(params))
}

export function saveType(params) {
  return http.post('/category/SCENE/save', QS.stringify(params))
}

export function saveScene(params) {
  return http.post('/scene/save', QS.stringify(params))
}

export function removeScene(params) {
  return http.post('/scene/remove', QS.stringify(params))
}

export function getSceneTable(params) {
  return http.post('/scene/page', QS.stringify(params))
}

export function getSceneInfo(params) {
  return http.get(`/scene/getByIdWithNoXml?${strSplicing(params)}`)
}

export function getFolderTree(params) {
  return http.get(`/menu/folderTreeDisable?${strSplicing(params)}`)
}

export function relationFolder(params) {
  return http.post('/scene/linkToResource', params)
}

export function getFilterTree(params) {
  return http.get(`/scene/getSceneSJParam?${strSplicing(params)}`)
}

export function getSceneXML(params) {
  return http.get(`/scene/getById?${strSplicing(params)}`)
}

export function saveSceneXML(params) {
  return http.post('/scene/saveXml', QS.stringify(params))
}
