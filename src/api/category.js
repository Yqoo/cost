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

/* 账套下凭证类别 */
export const voucher = {
  getList(ztsn) { // 获取所有账套凭证类别
    return http.get(`/ztPzlbController/listAll?${strSplicing(ztsn)}`)
  },
  getZTOne(id) { // 查询单个账套凭证类别
    return http.get(`/ztPzlbController/getById?${stringify(id)}`)
  },
  getkmTree(ztsn, fangxiang) { // 获取科目代码树
    return http.get(`/ztPzlbController/getKmTree?${strSplicing(ztsn, fangxiang)}`)
  },
  getTree() { // 单位树--选择人员
    return http.get('/unit/tree')
  },
  getUseList(params) { // 人员列表 --选择人员
    return http.get(`/user/pages?${strSplicing(params)}`)
  },
  addVoucher(params) { // 新增账套凭证类别
    return http.post('/ztPzlbController/add', QS.stringify(params))
  },
  updataVoucher(params) { // 修改账套凭证类别
    return http.post('/ztPzlbController/update', QS.stringify(params))
  },
  delVoucher(id) { // 删除账套凭证类别
    return http.get(`/ztPzlbController/delete?${strSplicing(id)}`)
  }
}

/**
 * ====================================================
 */
/*  系统下凭证类别 */
export const category = {
  getCategory(query) { // 获取凭证类别列表
    return http.get(`/systemPingZhengLeiBie/list?${strSplicing(query)}`)
  },

  addCategory(params) { // 新增凭证类别
    return http.post('/systemPingZhengLeiBie/add', QS.stringify(params))
  },

  delCategory(id) { // 删除凭证类别
    return http.get(`/systemPingZhengLeiBie/delete?${strSplicing(id)}`)
  },

  updateCategory(params) { // 修改凭证类别
    return http.post('/systemPingZhengLeiBie/update', QS.stringify(params))
  },
  creatZJM(query) { // 通过简称生成助记码
    return http.get(`/systemPingZhengLeiBie/getZJM?${strSplicing(query)}`)
  },
  getOne(id) { // 获取凭证详情
    return http.get(`/systemPingZhengLeiBie/getById?${stringify(id)}`)
  }
}
