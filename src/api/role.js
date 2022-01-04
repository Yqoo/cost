import http from './http'
import QS from 'qs'

function strSplicing(params) {
  let url = ''
  Object.keys(params).forEach(key => {
    url += `${key}=${params[key]}&`
  })
  return url.slice(0, -1)
}

export function getRoleTree() { // 获取功能角色树
  return http.get('/role/tree')
}

export function getMenuTree(params) { // 获取功能角色树
  return http.get(`/menu/menuApiTree?${strSplicing(params)}`)
}

export function getScopeType() { // 获取获取应用范围
  return http.get('/role/getScopeType')
}

export function getZT() { // 当应用范围为账套zt时 获取账套树
  return http.get('/systemZtinfo/all')
}

export function getDWtree() { // 应用范围为单位时 获取单位树
  return http.get('/unit/tree')
}

export function getRoleMenuApis(parmas) { // 获取当前角色已有的功能权限
  return http.get(`/role/getRoleMenuApis?sn=${parmas}`)
}

export function getMenuApis(parmas) { // 通过中间菜单id获取右侧权限明细
  return http.get(`/menu/menuApis?id=${parmas}`)
}

export function getBySn(parmas) { // 通过编码获取角色详情
  return http.get(`/role/getBySn?sn=${parmas}`)
}

export function addRole(params) { // 添加功能角色
  return http.post('/role/add', QS.stringify(params))
}

export function updateRole(params) { // 修改功能角色
  return http.post('/role/update', QS.stringify(params))
}

export function updateRoleMenuApis(params) { // 角色授权
  return http.post('/role/updateRoleMenuApis', QS.stringify(params))
}

export function delRole(id) { // 删除功能角色
  return http.post(`/role/delete?${strSplicing(id)}`)
}

export function getRoleUser(id) { // 查看功能角色树
  return http.get(`/role/userByRid?rid=${id}`)
}
