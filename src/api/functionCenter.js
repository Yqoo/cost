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

// 分类树
export function getfunctionTree(params) {
  return http.get('/bbFunctionFolderController/tree')
}

// 新增树
export function addfunctionTree(params) {
  return http.post('/bbFunctionFolderController/add', QS.stringify(params))
}

// 获取树详情
export function getTreeDesc(params) {
  return http.get(`/bbFunctionFolderController/getById?${strSplicing(params)}`)
}

// 修改树
export function editfunctionTree(params) {
  return http.post(`/bbFunctionFolderController/update?${strSplicing(params)}`)
}

// 删除树
export function delfunctionTree(params) {
  return http.get(`/bbFunctionFolderController/delete?${strSplicing(params)}`)
}

// 函数定义列表
export function getFunctionList(params) {
  return http.get(`/bbFunctionDefineController/list?${strSplicing(params)}`)
}

// 查询所有数据源
export function getSJY() {
  return http.get('/bbFunctionDefineController/listDataSource')
}

// 新增函数
export function addFunctionList(params) {
  return http.post('/bbFunctionDefineController/add', QS.stringify(params))
}

// 查询单个函数
export function getFunctionDesc(params) {
  return http.get(`/bbFunctionDefineController/getById?${strSplicing(params)}`)
}

// 删除函数
export function delFunctionList(params) {
  return http.get(`/bbFunctionDefineController/delete?${strSplicing(params)}`)
}

// 修改函数
export function editFunctionList(params) {
  return http.post('/bbFunctionDefineController/update', QS.stringify(params))
}

/**
 * 函数设计
 */

// 函数验证
export function verifyFunc(params) {
  return http.post('/bbFunctionWorkController/analysisSqlColumns', QS.stringify(params))
}

// sql选值验证
export function verifySqlBox(params) {
  return http.post('/bbFunctionWorkController/analysisSqlColumnsNoReplace', QS.stringify(params))
}

// 函数执行
// export function executeFunc(params) {
//   return http.post('/bbFunctionWorkController/getSqlData', QS.stringify(params))
// }
// 函数执行
export function executeFunc(params) {
  return http.post('/bbFunctionWorkController/getFdExecute', QS.stringify(params))
}

// 检查函数
export function checkFunc(param) {
  return http.get(`/bbFunctionWorkController/checkFd?${strSplicing(param)}`)
}

// 获得导航框数据
export function getNavData(param) {
  return http.get(`/bbFunctionWorkController/getDaoHangData?${strSplicing(param)}`)
}

// 导航框为枚举下拉框时下拉数据
export function getEnmuData(param) {
  return http.get(`/bbFunctionWorkController/getDaoHangParamXiaLa?${strSplicing(param)}`)
}

// 函数导航的时候 sql选值查出数据(对话框)
export function getSqlTable(param) {
  return http.post(`/bbFunctionWorkController/analysisSql?${strSplicing(param)}`)
}

// 勾选全局维度的下拉数据
export function getQJWDData() {
  return http.get('/bbFunctionDefineController/getQJWDData')
}

// 全局维度type为1查询的下拉数据
export function getQJWDTypeIsOne(param) {
  return http.get(`/bbFunctionWorkController/getQJWDTypeIsOne?${strSplicing(param)}`)
}
