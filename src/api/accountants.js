import http from './http'
import QS from 'qs'

function strSplicing(params) {
  let url = ''
  Object.keys(params).forEach(key => {
    url += `${key}=${params[key]}&`
  })
  return url.slice(0, -1)
}

// 账套下会计科目

// 验证编码
export function verifySn(params) {
  return http.get(`/kuaiJiKeMu/checkSn?${strSplicing(params)}`)
}

// 获取科目信息树(左侧树)
export function getCourseTree(id) {
  return http.get(`/kuaiJiKeMu/tree?ztsn=${id}`)
}

// 账套会计科目列表
export function getCoursetable(params) {
  return http.get(`/kuaiJiKeMu/page?${strSplicing(params)}`)
}

// 删除账套会计科目
export function delCoursetable(params) {
  return http.get(`/kuaiJiKeMu/delete?${strSplicing(params)}`)
}

// 修改账套科目的状态
export function editCoursetableStatus(params) {
  return http.get(`/kuaiJiKeMu/updateSyzt?${strSplicing(params)}`)
}

// 通过输入的科目信息编码查询会计体系编码和会计要素编码
export function getCourseSn(params) {
  return http.get(`/kuaiJiKeMu/getInfo?${strSplicing(params)}`)
}

// 查询会计体系
export function getKJTX(id) {
  return http.get(`/systemKuaiJiTiXi/getAllKuaiJiTiXiByZhangTaoSn?ztsn=${id}`)
}

// 通过会计体系编码查询会计要素
export function getKJYS(id) {
  return http.get(`/kuaiJiKeMu/getKjysByKjtxSn?kuaiJiTiXiSn=${id}`)
}

// 期末结转方向
export function getQMJZFX() {
  return http.get('/kuaiJiKeMu/getQmjzfx')
}

// 通过账套编码查询账套辅助核算项
export function getFZHSTable(params) {
  return http.get(`/ZhangTaoFuZhuHeSuanXiangController/listToKjkm?${strSplicing(params)}`)
}

//  通过科目名称生成助记码
export function getZJM(params) {
  return http.get(`/systemPingZhengLeiBie/getZJM?query=${params}`)
}

// 通过ztsn查询单位类型(行业版本)
export function getUnits(params) {
  return http.get(`/kuaiJiKeMu/listHybbByZtsn?ztsn=${params}`)
}

// 增加账套会计科目
export function addZTKMTmp(params) { // 添加科目模板
  return http.post('/kuaiJiKeMu/add', QS.stringify(params))
}

//  通过id和ztsn查询会计科目详细
export function getKMTmpDesc(params) {
  return http.get(`/kuaiJiKeMu/getById?${strSplicing(params)}`)
}

// 修改账套会计科目
export function editZTKMTmp(params) { // 添加科目模板
  return http.post('/kuaiJiKeMu/update', QS.stringify(params))
}

/* 账套下会计科目 导入 导出 打印 ids ztsn type */

export function kjkmZTImport(file, ztsn) {
  return http.post(`/kuaiJiKeMu/importFile?${strSplicing(file, ztsn)}`)
}

export function kjkmZTExport(type, ztsn) {
  return http.get(`/kuaiJiKeMu/export?${strSplicing(type, ztsn)}`)
}

export function kjkmPrint(params) {
  return http.get(`/PrintPdfController/exportPdfFzhs?${strSplicing(params)}`)
}

// 获取流量对照列表
export function getXJDZList(params) {
  return http.get(`/kuaiJiKeMu/getXjllDatas?${strSplicing(params)}`)
}

// 通过辅助核算编码获取下拉数据
export function getFZXXData(params) {
  return http.get(`/kuaiJiKeMu/fzxxData?${strSplicing(params)}`)
}
