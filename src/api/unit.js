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

export function unitTree(params) { // 获取单位树
  return http.get(`/unit/tree?${strSplicing(params)}`)
}

export function delUnitCategory(id) { // 删除单位分类
  return http.post(`/unit/category/delete?${strSplicing(id)}`)
}

export function delUnit(id) { // 删除单位
  return http.post(`/unit/delete?${strSplicing(id)}`)
}

export function getUnitMess(id) { // 通过编码sn获取单位信息
  return http.get(`/unit/getBySn?sn=${id}`)
}

export function editUnit(params) { // 新增、修改单位时获取单位分类列表
  return http.get(`/unit/unitCategorys?unitSn=${params}`)
}

export function unitPages(params) { // 获取单位分页信息
  return http.get(`/unit/pages?${strSplicing(params)}`)
}

export function addUnit(params) { // 添加单位
  return http.post('/unit/add', QS.stringify(params))
}

export function addUnitcategory(params) { // 添加单位分类
  return http.post('/unit/category/add', QS.stringify(params))
}

export function editUnitcategory(params) { // 修改单位分类
  return http.post('/unit/category/update', QS.stringify(params))
}

export function updateUnit(params) { // 修改单位信息
  return http.post('/unit/update', QS.stringify(params))
}

export function updateUnitStatus(params) { // 修改单位状态
  return http.post(`/unit/updateStatus?${strSplicing(params)}`)
}

// 单位部门

export function getDeptList(params) { // 获取单位部门列表
  return http.get(`/dept/list?${strSplicing(params)}`)
}

export function delDept(id) { // 删除部门
  return http.post(`/dept/delete?${strSplicing(id)}`)
}

export function saveDept(params) { // 保存部门
  return http.post('/dept/save', QS.stringify(params))
}

export function getDeptMess(id) { // 通过部门ID获取部门信息
  return http.get(`/dept/getById?id=${id}`)
}

export function updateDeptStatus(params) { // 修改单位状态
  return http.post(`/dept/updateStatus?${strSplicing(params)}`)
}

/* 单位账套 */

export function getZTlist(params) { // 获取账套分页列表
  return http.post('/systemZtinfo/getPageByUnitSn', QS.stringify(params))
}

export function getFangAnList() { // 查询所有启用的会计方案
  return http.get('/systemKuaiJiQiJianfangAnFenLei/listAll')
}

export function getQiJianList(params) { // 根据会计期间方案sn获取详情
  return http.get(`/systemZtinfo/kjqjDetail?${strSplicing(params)}`)
}

export function getKJZDList() { // 查询所有启用的会计制度he行业版本
  return http.get('/kuaiJiKeMuMuBan/kjzdAndHybb')
}

export function getKMMBList(params) { // 通过会计制度和行业版本获取科目模板列
  return http.get(`/kuaiJiKeMuMuBan/list?${strSplicing(params)}`)
}

export function getZTList(params) { // 根据行业版本会计制度编码获取对应账套列表
  return http.get(`/systemZtinfo/getListByHybbKjzd?${strSplicing(params)}`)
}

export function getLeftTree(params) { //  通过会计科目模板获取左侧
  return http.get(`/kuaiJiKeMuMuBan/kjysAndKjkm?${strSplicing(params)}`)
}

export function getRightTable(params) { // 获取会计科目分页
  return http.get(`/kuaiJiKeMuMuBan/pages?${strSplicing(params)}`)
}

export function getAllFangAnList() { // 获取辅助核算方案分类
  return http.get('/fuZhuHeSuanFangAn/all')
}

export function getAllFZHS(params) { // 分页查询所有辅助核算项
  return http.get(`/systemFuZhuHeSuan/page?${strSplicing(params)}`)
}

export function addUnitZT(params) { // 新增单位账套
  return http.post('/systemZtinfo/addZhangTao', QS.stringify(params))
}

export function updateUnitZt(params) { // 修改单位账套
  return http.post('/systemZtinfo/updateZhangTao', QS.stringify(params))
}

export function delUnitZt(params) { // 删除单位账套
  return http.post(`/systemZtinfo/deleteByZth?${strSplicing(params)}`)
}

export function getXJLLTree(params) { // 现金流量树查询
  return http.get(`systemXianJinLiuXiangMuCategory/getTree?${strSplicing(params)}`)
}

export function getZTInfo(params) { // 获取更新账套时的数据
  return http.get(`/systemZtinfo/getUpdateZhangTaoDataBySn?${strSplicing(params)}`)
}

export function getPZLB() {
  return http.get('systemPingZhengLeiBie/list')
}

export function getTableByZt(params) {
  return http.get(`/kuaiJiKeMu/page?${strSplicing(params)}`)
}

export function getLeftTreeByZt(params) {
  return http.get(`/kuaiJiKeMu/tree?${strSplicing(params)}`)
}

export function checkKuaiJiYaoSuSnUseful(params) {
  return http.get(`/systemZtinfo/checkKuaiJiYaoSuSnUseful?${strSplicing(params)}`)
}
