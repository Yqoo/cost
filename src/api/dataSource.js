// 数据源接口
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

const dataSource = {
  // 获取数据源左侧树
  getSJYTree(params) {
    return http.post(`/datasource/leftTree?${strSplicing(params)}`)
  },
  // 获取数据源右侧表格数据分页
  getSJYTable(params) {
    return http.post('/datasource/page', QS.stringify(params))
  },
  // 分类获取
  getSJYCategory(params) {
    return http.post(`/datasource/getCategoryBySn?${strSplicing(params)}`)
  },
  // 新增分类保存
  saveCategory(params) {
    return http.post(`/datasource/saveCategory?${strSplicing(params)}`)
  },
  // 删除分类
  delCategory(params) {
    return http.post(`/datasource/deleteCategory?${strSplicing(params)}`)
  },
  // 数据源保存和获取
  saveDataSource(params) {
    return http.post('/datasource/save', params)
  },
  // 获取数据源类型
  getDSType() {
    return http.post('/datasource/getTypes')
  },
  // 删除数据
  delDataSource(params) {
    return http.post(`/datasource/delete?${strSplicing(params)}`)
  },
  // 通过id获取信息
  getInfoById(params) {
    return http.post(`/datasource/getById?${strSplicing(params)}`)
  },
  // 数据源启用
  enableDS(params) {
    return http.post(`/datasource/enable?${strSplicing(params)}`)
  },
  // 数据源禁用
  disableDS(params) {
    return http.post(`/datasource/disable?${strSplicing(params)}`)
  },
  // 测试源连接，通过id
  testById(params) {
    return http.post('/datasource/testById', QS.stringify(params))
  },
  // 测试连接通过行
  testByRow(params) {
    return http.post('/datasource/test', QS.stringify(params))
  }
}

export default dataSource
