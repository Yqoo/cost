/** 数据算法接口* */
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

const kettle = {
  // 获取数据算法左侧树
  getSJZHTree(params) {
    return http.post('/category/KETTLE/tree', QS.stringify(params))
  },
  // 保存左侧树分类
  saveSJZHTree(params) {
    return http.post('/category/KETTLE/save', QS.stringify(params))
  },
  // 修改左侧树分类回显获取
  editSJZHTree(params) {
    return http.post('/category/KETTLE/get', QS.stringify(params))
  },
  // 删除左侧树分类
  delSJZHTree(params) {
    return http.post('/category/KETTLE/delete', QS.stringify(params))
  },
  // 获取表格数据和分页
  getSJZHData(params) {
    return http.post('/kettle/findAll', QS.stringify(params))
  },
  // 通过ID删除
  deleteById(params) {
    return http.post('/kettle/remove', QS.stringify(params))
  },
  // 获取分类
  getCategory(params) {
    return http.post('/category/KETTLE/get', QS.stringify(params))
  },
  // 保存数据算法
  saveKettle(params) {
    return http.post('/kettle/save', QS.stringify(params))
  },
  // 通过ID查询
  searchById(params) {
    return http.post('/kettle/getById', QS.stringify(params))
  },
  // 运行转换
  runChange(params) {
    return http.post('/kettle/run', QS.stringify(params), { timeout: 600000 })
  },
  // 查找历史记录
  findRecord(params) {
    return http.post('/kettle/findRecord', QS.stringify(params))
  },
  // 删除历史记录
  delRecord(params) {
    return http.post('/kettle/deleteRecord', QS.stringify(params))
  },
  // 获取详细信息
  getDetailInfo(params) {
    return http.post('/kettle/getRecord', QS.stringify(params))
  },
  getDossierTree() {
    return http.post('/dataMapScheme/getDataTree')
  },
  getQjfaType() {
    return http.post('/dataMapSchemeVersionQj/getQjfaType')
  }
}

export default kettle
