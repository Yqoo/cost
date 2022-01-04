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

// /* 账套下差异项 */
export const balance = {
  getAllKJZD() { // 查询所有双核算体系的会计制度
    return http.get('/ZhangTaoChaYiXiang/getAllKuaiJiZhiDu')
  },
  getKJTX(KjtxSn) { //  通过会计体系编码获得子会计体系
    return http.get(`/ZhangTaoChaYiXiang/getAllKuaiJiTiXi?${strSplicing(KjtxSn)}`)
  },
  getZTList(params, ztsn) { // 查询所有差异项
    return http.get(`/ZhangTaoChaYiXiang/list?${strSplicing(params, ztsn)}`)
  },
  getOne(id) { // 通过id查询差异项详情
    return http.get(`/ZhangTaoChaYiXiang/getById?${stringify(id)}`)
  },
  addBalance(params) { // 新增差异项
    return http.post('/ZhangTaoChaYiXiang/add', QS.stringify(params))
  },
  updateBalance(params) { // 修改差异项
    return http.post('/ZhangTaoChaYiXiang/update', QS.stringify(params))
  },
  delDif(id) { // 删除差异项
    return http.get(`/ZhangTaoChaYiXiang/delete?${strSplicing(id)}`)
  },
  addBalanceItem(params) { // 新增差异项项目
    return http.post('/ZhangTaoChaYiXiang/addItem', QS.stringify(params))
  },
  updateBalanceItem(params) { // 修改差异项项目
    return http.post('/ZhangTaoChaYiXiang/updateItem', QS.stringify(params))
  },
  getOneItem(params) { // 通过id查询差异项项目详情
    return http.get(`/ZhangTaoChaYiXiang/getItemBySn?${stringify(params)}`)
  },
  delBalanceItem(id, chaYiSn, ztsn) { // 删除差异项项目
    return http.get(`/ZhangTaoChaYiXiang/deleteItem?${strSplicing(id, chaYiSn, ztsn)}`)
  },
  getBalTree(sn, ztsn) {
    return http.get(`/ZhangTaoChaYiXiang/getCyxItemTree?${stringify(sn, ztsn)}`)
  }
  // getTree() { // 获取树
  //   return http.get('/systemJieYuChaYiXiang/tree')
  // }
}

/**
 * ====================================================
 * ====================================================
 */
/* 系统下差异项 */
export const differences = {
  getDif(query) { // 获取所有的差异项
    return http.get(`/systemJieYuChaYiXiang/list?${strSplicing(query)}`)
  },
  getAllKJZD() { // 获取所有双核算体系的会计体系
    return http.get('/systemJieYuChaYiXiang/getAllKuaiJiZhiDu')
  },
  getKJTX(KjtxSn) { // 通过会计体系编码获取子会计体系
    return http.get(`/systemJieYuChaYiXiang/getAllKuaiJiTiXi?${strSplicing(KjtxSn)}`)
  },
  addDif(params) { // 添加差异项
    return http.post('/systemJieYuChaYiXiang/add', QS.stringify(params))
  },
  getOne(id) { // 通过id查询差异项详情
    return http.get(`/systemJieYuChaYiXiang/getById?${stringify(id)}`)
  },
  updateDif(params) { // 修改差异项
    return http.post('/systemJieYuChaYiXiang/update', QS.stringify(params))
  },
  delDif(id) { // 删除差异项
    return http.get(`/systemJieYuChaYiXiang/delete?${strSplicing(id)}`)
  },
  getDifItemTree(sn) { // 获取差异项项目列表树
    return http.get(`/systemJieYuChaYiXiang/getCyxItemTree?${stringify(sn)}`)
  },
  addDifItem(params) { // 新增差异项项目
    return http.post('/systemJieYuChaYiXiang/addItem', QS.stringify(params))
  },
  getOneDifItem(id, chayiSn) { // 通过id查询差异项项目详情
    return http.get(`/systemJieYuChaYiXiang/getItemById?${stringify(id, chayiSn)}`)
  },
  updateDifItem(params) { // 修改差异项项目
    return http.post('/systemJieYuChaYiXiang/updateItem', QS.stringify(params))
  },
  delDifItem(id) { // 删除差异项项目
    return http.get(`/systemJieYuChaYiXiang/deleteItem?${strSplicing(id)}`)
  },
  getTree() { // 获取树
    return http.get('/systemJieYuChaYiXiang/tree')
  }
}
