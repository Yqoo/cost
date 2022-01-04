import http from './http'
import QS, { stringify } from 'qs'

function strSplicing(params) {
  let url = ''
  if (params) {
    Object.keys(params).forEach(key => {
      url += `${key}=${params[key]}&`
    })
  }
  return url.slice(0, -1)
}

/** 账务处理 ---期初余额 */
const beginning = {
  getList(params) { // 获取期初余额分页列表
    return http.post(`/ZhangTaoQiChuYuE/page?${strSplicing(params)}`)
  },
  getAssist(params) { // 获取辅助信息分页
    return http.post(`/ZhangTaoQiChuYuE/getQiChuYuEPageByZtsnAndKjkmsn?${strSplicing(params)}`)
  },
  getZtkjTree(ztsn) { // 获取账套会计科目树
    return http.get(`/kuaiJiKeMu/tree?${stringify(ztsn)}`)
  },
  getBalance(kjkmSn) { // 试算平衡
    return http.post('/ZhangTaoQiChuYuE/trialBalance?', QS.stringify(kjkmSn))
  },
  addRow(zhangTaoQiChuYuE) { // 新增行
    return http.post('/ZhangTaoQiChuYuE/add', QS.stringify(zhangTaoQiChuYuE))
  },
  getTabHeader(ztsn, kmxxSn) { // 查询辅助核算项的表头
    return http.get(`/ZhangTaoFuZhuHeSuanXiangController/getFields?${strSplicing(ztsn, kmxxSn)}`)
  },
  getRelationship(params) { // 通过表头和选中的数据查询关联关系
    return http.get(`/ZhangTaoFuZhuHeSuanXiangController/getCiYaoSuData?${strSplicing(params)}`)
  },
  getDropDown(ztsn, filed) { //  通过表头某字段查询下拉数据
    return http.post('/ZhangTaoFuZhuHeSuanXiangController/getFieldsAllXiaLa?', QS.stringify(ztsn, filed))
  },
  delOne(id, ztsn) { // 删除期初余额
    return http.post(`/ZhangTaoQiChuYuE/deleteById?${strSplicing(id, ztsn)}`)
  },
  update(zhangTaoQiChuYuE) { // 修改
    return http.post('/ZhangTaoQiChuYuE/update', QS.stringify(zhangTaoQiChuYuE))
  },
  updateJe(params) {
    return http.post('/ZhangTaoQiChuYuE/setQCYE', QS.stringify(params))
  },
  sealUp(url, params) {
    return http.get(`${url}?${strSplicing(params)}`)
  },
  history(params) {
    return http.get(`/systemZtinfo/ztnds?${strSplicing(params)}`)
  },
  historyPage(params) {
    return http.get(`/ZhangTaoQiChuYuE/qcyeByZtnd?${strSplicing(params)}`)
  },
  syncLastYear(params) {
    return http.get(`/ZhangTaoQiChuYuE/syncLastyearQM?${strSplicing(params)}`)
  }
}

export default beginning
