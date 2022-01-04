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

// 获取所有角色树列表
export function getJSTree() {
  return http.post('/systemDataRole/list')
}

// 新增角色树
export function addJSTree(params) {
  return http.post('/systemDataRole/add', QS.stringify(params))
}

// 获取角色信息数详情
export function getJSTreeDesc(id) {
  return http.post(`/systemDataRole/getBySn?sn=${id}`)
}

// 修改角色树
export function editJSTree(params) {
  return http.post('/systemDataRole/updateById', QS.stringify(params))
}

// 删除角色树
export function delJSTree(id) {
  return http.post(`/systemDataRole/deleteBySn?sn=${id}`)
}

// 获取所用用户可选账套
export function getZTS() {
  return http.get('systemZtinfo/zts')
}

// 获取数据角色范围
export function getRoleFW(id) {
  return http.get(`/systemDataRoleRange/getSystemDataRoleType?ztsn=${id}`)
}

// 根据账套查询所有科目
export function getALLKM(id) {
  return http.get(`/kuaiJiKeMu/listByZtsn?ztsn=${id}`)
}

//  根据账套编码方案编码，复制核算项编码
export function getZTALLkm(params) {
  return http.get(`/ZhangTaoFuZhuHeSuanXiangController/fzhsDataTree?${strSplicing(params)}`)
}

//  删除
export function delAccreditData(params) {
  return http.post(`/systemDataRoleRange/deleteByIds?${strSplicing(params)}`)
}

//  新增
export function addAccreditData(params) {
  return http.post('/systemDataRoleRange/add', QS.stringify(params))
}

//  修改
export function editAccreditData(params) {
  return http.post('/systemDataRoleRange/updateById', QS.stringify(params))
}

// 获取数据角色对应的数据数据控制
export function getRoleData(params) {
  return http.get(`/systemDataRoleRange/getDataRoleRanggeByZth?${strSplicing(params)}`)
}

// 查看用户角色
export function getRole(id) {
  return http.post(`/systemDataRole/getUserByDataSn?sn=${id}`)
}
