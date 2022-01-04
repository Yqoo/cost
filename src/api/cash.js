import http from './http'
import QS from 'qs'

function strSplicing(params) {
  let url = ''
  Object.keys(params).forEach(key => {
    url += `${key}=${params[key]}&`
  })
  return url.slice(0, -1)
}
// 账套下现金流量项目接口apis
export function unitTree() { // 获取单位树
  return http.get('/cash')
}

export function delUnit(id) { // 删除单位
  return http.post(`/cash/delete?${strSplicing(id)}`)
}

export function getUnitMess(id) { // 通过编码sn获取单位信息
  return http.get(`/cash/getBySn?sn=${id}`)
}

// ===================================================================================
// ===================================================================================
// ===================================================================================
// ===================================================================================

// 账套下现金流量项目接口apis（zxm）

// 树
// 根据会计制度编码和行业版本编码查询对应现金流里分类树
export function getZTtree(id) {
  return http.get(`/zhangTaoXianJinLiuLiangXiangMuCategoryController/getTreeByKjzdAndHybbSn?ztsn=${id}`)
}

// 新增现金流量项目分类
export function addZTtree(params) {
  return http.post('/zhangTaoXianJinLiuLiangXiangMuCategoryController/add', QS.stringify(params))
}

// 根据id更新现金流量项目分类
export function editZTtree(params) {
  return http.post('/zhangTaoXianJinLiuLiangXiangMuCategoryController/updateById', QS.stringify(params))
}

// 根据现金流量项目分类编码查询对应详情
export function getZTtreeDesc(params) {
  return http.get(`/zhangTaoXianJinLiuLiangXiangMuCategoryController/selectBySn?${strSplicing(params)}`)
}

// 根据编码删除
export function delZTtree(params) {
  return http.post(`/zhangTaoXianJinLiuLiangXiangMuCategoryController/deleteBySn?${strSplicing(params)}`)
}

// 表
// 根据现金流里分类查询对应现金流量项目列表
export function getZTtable(params) {
  return http.get(`/zhangTaoXianJinLiuLiangXiangMuController/getPageByFenLeiSn?${strSplicing(params)}`)
}

// 新增现金流量项目
export function addZTtable(params) {
  return http.post('/zhangTaoXianJinLiuLiangXiangMuController/add', QS.stringify(params))
}

// 根据现金流量编码查询对应详情
export function getZTtableDesc(params) {
  return http.get(`/zhangTaoXianJinLiuLiangXiangMuController/selectBySn?${strSplicing(params)}`)
}

// 更新现金流量项目
export function editZTtable(params) {
  return http.post('/zhangTaoXianJinLiuLiangXiangMuController/updateById', QS.stringify(params))
}

// 根据编码删除现金流量项目
export function delZTtable(params) {
  return http.post(`/zhangTaoXianJinLiuLiangXiangMuController/deleteBySn?${strSplicing(params)}`)
}

// 根据现金流里项目编码修改现金流里项目禁用状态
export function editZTtableStatus(params) {
  return http.post(`/zhangTaoXianJinLiuLiangXiangMuController/updateDisableBySn?${strSplicing(params)}`)
}

// ===================================================================================
// ===================================================================================
// ===================================================================================
// ===================================================================================

// 系统级下现金流量项目接口apis

// 根据会计制度编码和行业版本编码查询对应现金流里分类树
export function getSystemTree(params) {
  return http.get(`/systemXianJinLiuXiangMuCategory/getTreeByKjzdAndHybbSn?${strSplicing(params)}`)
}

// 新增现金流量分类
export function addSystemcash(params) {
  return http.post('/systemXianJinLiuXiangMuCategory/add', QS.stringify(params))
}

// 更新现金流量项目分类
export function updateSystemcash(params) {
  return http.post('/systemXianJinLiuXiangMuCategory/update', QS.stringify(params))
}

// 根据编码删除现金流量分类
export function deleteSystemcash(params) {
  return http.post(`/systemXianJinLiuXiangMuCategory/deleteBySn?${strSplicing(params)}`)
}

// 根据现金流量项目分类查询对应详情
export function selectSytemcash(params) {
  return http.get(`/systemXianJinLiuXiangMuCategory/selectBySn?${strSplicing(params)}`)
}

// 根据现金流分类查询项目列表
export function getlistSytemcash(params) {
  return http.get(`/systemXianJinLiuXiangMu/getPageByFenLeiSn?${strSplicing(params)}`)
}

// 根据现金流项目编码修改禁用状态
export function updateDisable(params) {
  return http.post('/systemXianJinLiuXiangMu/updateDisableBySn', QS.stringify(params))
}

// 更新现金流量项目
export function updateXianMu(params) {
  return http.post('/systemXianJinLiuXiangMu/update', QS.stringify(params))
}

// 根据编码删除现金流量项目
export function deleteXianMu(id) {
  return http.post(`/systemXianJinLiuXiangMu/deleteBySn?${strSplicing(id)}`)
}

// 更新现金流量项目列表
export function updatecash(params) {
  return http.post('/systemXianJinLiuXiangMu/update', QS.stringify(params))
}

// 新增现金流量项目
export function addCash(params) {
  return http.post('/systemXianJinLiuXiangMu/add', QS.stringify(params))
}

// 根据现金流量项目编码查询现金流量详情
export function getCasnDetails(params) {
  return http.get(`/systemXianJinLiuXiangMu/selectBySn?${strSplicing(params)}`)
}

/* 系统下现金流量项目 导入 导出 打印 ids ztsn type  */

export function xjllImport(file) {
  return http.post(`/systemXianJinLiuXiangMu/importFile?${strSplicing(file)}`)
}

export function xjllExport(type) {
  return http.get(`/systemXianJinLiuXiangMu/export?${strSplicing(type)}`)
}

export function xjllPrint(params) {
  return http.get(`/PrintPdfController/exportPdfFzhs?${strSplicing(params)}`)
}

/* 账套下现金流量项目 导入 导出  */

export function xjllZTImport(file, ztsn) {
  return http.post(`/zhangTaoXianJinLiuLiangXiangMuController/importFile?${strSplicing(file, ztsn)}`)
}

export function xjllZTExport(type, ztsn) {
  return http.get(`/zhangTaoXianJinLiuLiangXiangMuController/export?${strSplicing(type, ztsn)}`)
}
