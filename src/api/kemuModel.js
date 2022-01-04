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

export function getRegime() { // 获取所有会计制度及会计制度下的行业版本
  return http.get('/kuaiJiKeMuMuBan/kjzdAndHybb')
}

export function getKMedition(params) { // 通过会计制度、行业版本获取科目模板列表
  return http.get(`/kuaiJiKeMuMuBan/list?${strSplicing(params)}`)
}

export function getTree(params) {
  return http.get(`/kuaiJiKeMuMuBan/kjysAndKjkm?${strSplicing(params)}`)
}

export function getKMData(params) { // 添加、修改科目模板所需数据
  return http.get(`/kuaiJiKeMuMuBan/templateNeedData?${strSplicing(params)}`)
}

export function addKMTmp(params) { // 添加科目模板
  return http.post('/kuaiJiKeMuMuBan/addTemplate', QS.stringify(params))
}

export function updateKMTmp(params) { // 编辑科目模板
  return http.post('/kuaiJiKeMuMuBan/updateTemplate', QS.stringify(params))
}

export function delKMTmp(params) {
  return http.post('/kuaiJiKeMuMuBan/delete', QS.stringify(params))
}

export function getPage(params) {
  return http.get(`/kuaiJiKeMuMuBan/pages?${strSplicing(params)}`)
}

export function turnZJM(query) { // 中文首字母
  return http.get(`/systemPingZhengLeiBie/getZJM?query=${query}`)
}

export function getFZHSTable(params) { // 获取辅助核算列表
  return http.get(`/systemFuZhuHeSuan//List?${strSplicing(params)}`)
}

export function getTXList(params) { // 获取会计体系
  return http.get(`/systemKuaiJiTiXi/getKuaiJiTixiBykuaijikemumobansn?${strSplicing(params)}`)
}

export function getUnits(params) { // 获取单位列表
  return http.get(`/systemKuaiJiZhiDu/hybb/selectListBykjmbsn?${strSplicing(params)}`)
}

export function getKJYS(params) { // 获取会计要素
  return http.get(`/systemKuaiJiYaoSu/selectListByKuaiJiTiXiSn?${strSplicing(params)}`)
}

export function addKJKM(params) { // 新增会计科目
  return http.post('/systemKuaiJiKeMu/add', QS.stringify(params))
}

export function updateKJKM(params) { // 编辑会计科目
  return http.post('/systemKuaiJiKeMu/updateById', QS.stringify(params))
}

export function getDetail(params) { // 根据编码查询系统会计科目
  return http.get(`/systemKuaiJiKeMu/getBySn?${strSplicing(params)}`)
}

export function getFZHSName(params) { // 通过辅助核算项编码集合获取对应名称
  return http.get(`/systemFuZhuHeSuan/getBySns?${strSplicing(params)}`)
}

export function delKJKM(params) { // 删除会计科目
  return http.post('/systemKuaiJiKeMu/deleteBySn', QS.stringify(params))
}

export function presetKM() { // 批量预置或撤回 获取单位账套树
  return http.get('/systemZtinfo/unitAndZtTree')
}

export function issuseKM(params) { // 批量预置
  return http.post('/systemKuaiJiKeMu/issue', QS.stringify(params))
}

export function presetHistory(params) { // 查询某条数据的历史下发
  return http.get(`/DataIssuHistoryController/ListHistory?${strSplicing(params)}`)
}

export function deleteXiaFa(params) { // 撤回下发
  return http.get(`/DataIssuHistoryController/deleteXiaFa?${strSplicing(params)}`)
}

export function getInfoFromSn(params) { // 根据编码校验并获取默认带出的会计体系、会计要素及期末转出方向
  return http.get(`/systemKuaiJiKeMu/getInfo?${strSplicing(params)}`)
}

export function getAllKMMB() { // 获取所有科目模板
  return http.get('/kuaiJiKeMuMuBan/listAllKmmb')
}

export function gethybben(params) { // 通过科目模板编码查询会计制度和行业版本
  return http.get(`/kuaiJiKeMuMuBan/getKjzd?${strSplicing(params)}`)
}

export function getXJDZList() { // 获取系统现金流量列表
  return http.get('/systemKuaiJiKeMu/getXjllDatas')
}

export function getFZXXData(params) { // 通过辅助核算编码获取下拉列表
  return http.get(`/systemKuaiJiKeMu/fzxxData?${strSplicing(params)}`)
}
