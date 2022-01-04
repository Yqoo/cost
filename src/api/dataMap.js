// 映射方案接口
import http from './http'
import QS, { stringify } from 'qs'

function strSplicing(params) {
  let url = ''
  Object.keys(params).forEach(key => {
    url += `${key}=${params[key]}&`
  })
  return url.slice(0, -1)
}
const dataMap = {
  // 获取左侧树
  getYSFATree(params) {
    return http.post('/category/DATAMAP/tree', QS.stringify(params))
  },
  // 保存左侧树分类
  saveYSFATree(params) {
    return http.post('/category/DATAMAP/save', QS.stringify(params))
  },
  // 修改左侧树分类回显获取
  editYSFATree(params) {
    return http.post('/category/DATAMAP/get', QS.stringify(params))
  },
  // 删除左侧树分类
  delYSFATree(params) {
    return http.post('/category/DATAMAP/delete', QS.stringify(params))
  },
  // 右侧表格显示及分页
  getYSFAData(params) {
    return http.post('/dataMapScheme/findAll', QS.stringify(params))
  },
  // 档案选择树
  getDAXZTree(params) {
    return http.get(`/dossier/dossierTree?${params}`)
  },
  // 期间方案选择树
  getQJFATree() {
    return http.get('/systemKuaiJiQiJianfangAnFenLei/usefulTree')
  },
  // 通过sn获取档案信息
  getInfoBySn(params) {
    return http.get(`/dossier/getBySn?${stringify(params)}`)
  },
  // 获取会计期间方案的元数据
  getInfoByQJFA() {
    return http.post('/dataMapScheme/getKjqjfaMeta')
  },
  // 删除右边表格数据
  delYSFATable(params) {
    return http.post('/dataMapScheme/remove', QS.stringify(params))
  },
  // 保存右边表格数据
  saveYSFATable(params) {
    return http.post('/dataMapScheme/save', QS.stringify(params))
  },
  // 修改数据回显
  getYSFAInfo(params) {
    return http.post('/dataMapScheme/get', QS.stringify(params))
  }

}
export default dataMap
