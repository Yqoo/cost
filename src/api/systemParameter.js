import http from './http'
import QS, { stringify } from 'qs'

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

const systemParameter = {

  // 查询拥有权限的所有系统配置方案树
  getCSTree() {
    return http.get('/systemParametersScheme/getTreeByUser')
  },

  // 获取方案权限人员
  getYHRYTree() {
    return http.get('/user/userTree')
  },

  // 获取方案权限角色
  getYHJSTree() {
    return http.get('/role/tree')
  },

  // 常用摘要树
  getSKFWTree(params) {
    return http.get(`/systemZtinfo/ztTree?${strSplicing(params)}`)
  },
  // 会计制度类型树
  getKJZDTree(params) {
    return http.get(`/systemKuaiJiZhiDu/getJdflTree?${strSplicing(params)}`)
  },

  // 增加分类管理（新增会计制度类别）
  addKJZDTree(params) {
    return http.post('/category/addTemp', QS.stringify(params))
  },

  // 通过id查询会计制度类别
  getKJZDDesc(params) {
    return http.get(`/category/getByIdTemp?${strSplicing(params)}`)
  },

  // 增加分类管理（新增会计制度类别）
  editKJZDTree(params) {
    return http.post('/category/updateTemp', QS.stringify(params))
  },

  // 增加分类管理（新增会计制度类别）
  delKJZDTree(params) {
    return http.get(`/category/deleteTemp?${strSplicing(params)}`)
  },

  // 查询方案对应的分类树
  getCSList(params) {
    return http.post(`/systemParametersDetails/getTreeBySchemeSnAndCategorySn?${strSplicing(params)}`)
  },

  // 新增方案
  addMRFA(params) {
    return http.post('/systemParametersScheme/add', QS.stringify(params))
  },

  // 删除方案
  delMRFA(id) {
    return http.post(`/systemParametersScheme/deleteBySn?sn=${id}`)
  },

  // 获取方案详情
  getMRFADesc(id) {
    return http.get(`/systemParametersScheme/getBySn?sn=${id}`)
  },

  // 修改方案
  editMRFA(params) {
    return http.post('/systemParametersScheme/update', QS.stringify(params))
  },

  // 新增参数
  addCS(params) {
    return http.post('/systemParametersDetails/add', QS.stringify(params))
  },

  // 修改参数
  editCS(params) {
    return http.post('/systemParametersDetails/updateById', QS.stringify(params))
  },

  // 获取方案详情
  getCSDesc(id) {
    return http.get(`/systemParametersDetails/getBySn?sn=${id}`)
  },

  // 获取方案详情
  delCSDesc(id) {
    return http.post(`/systemParametersDetails/deleteBySn?sn=${id}`)
  },

  // 获取方案下发树
  xfRrange(id) {
    return http.get(`/systemZtinfo/getControlledRrangeBySn?sn=${id}`)
  },

  // 方案下发
  xfFA(params) {
    return http.get(`/systemParametersScheme/issueScheme?${strSplicing(params)}`)
  },

  // 还原账套参数
  restoreXTCS(ids) {
    return http.post(`/systemParametersDetails/reduction?ids=${ids}`)
  }

}

export default systemParameter
