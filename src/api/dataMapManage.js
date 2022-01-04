import http from './http'
import QS, { stringify } from 'qs'
// 映射管理接口
const dataMapManage = {
  // 获取左侧树
  getYSGLTree(params) {
    return http.post('/dataMapScheme/getDataTree', QS.stringify(params))
  },
  // 左侧版本管理列表
  getBBGLList(params) {
    return http.post('/dataMapSchemeVersion/listAll', QS.stringify(params))
  },
  // 建立默认版本
  createDefault(params) {
    return http.post('/dataMapSchemeVersion/makeDefault', QS.stringify(params))
  },
  // 左侧版应用期间
  getYYQJList(params) {
    return http.post('/dataMapSchemeVersionQj/listAll', QS.stringify(params))
  },
  // 获取映射数据左侧树
  getTableTree(params) {
    return http.post('/dataMapSchemeItem/getLeftTree', QS.stringify(params))
  },
  // 获取表格展示表头
  getTableTh(params) {
    return http.post('/dataMapSchemeItem/getColumns', QS.stringify(params))
  },
  // 获取表格数据分页
  getTableData(params) {
    return http.post('/dataMapSchemeItem/findAll', QS.stringify(params))
  },
  // 获取表格数据列表
  getTableList(params) {
    return http.post('/dataMapSchemeItem/listAll', QS.stringify(params))
  },
  // 获取默认区间方案树
  getDefaultItem() {
    return http.get('/systemKuaiJiQiJianfangAnFenLei/tree')
  },
  // 映射方案版本保存
  saveYSFAVersion(params) {
    return http.post('/dataMapSchemeVersion/save', QS.stringify(params))
  },
  // 删除版本
  delYSFAVersion(params) {
    return http.post('/dataMapSchemeVersion/remove', QS.stringify(params))
  },
  // 通过ID查询版本信息
  getVersionInfo(params) {
    return http.post('/dataMapSchemeVersion/getById', QS.stringify(params))
  },
  // 获取数据进行编辑
  editDataMap(params) {
    return http.post('/dataMapSchemeItem/getTargetValue', QS.stringify(params))
  },
  // 获取数据选择树
  getDataTree(params) {
    return http.post('/dataMapSchemeItem/getDataTree', QS.stringify(params))
  },
  // 保存数据
  saveDataTree(params) {
    return http.post('/dataMapSchemeItem/save', QS.stringify(params))
  },
  // 删除数据
  delDataTable(params) {
    return http.post('/dataMapSchemeItem/removeByValue', QS.stringify(params))
  },
  // 获取期间类型
  getDuringType() {
    return http.post('/dataMapSchemeVersionQj/getQjfaType')
  },
  // 保存应用期间
  saveAppDuring(params) {
    return http.post('/dataMapSchemeVersionQj/save', QS.stringify(params))
  },
  // 查询应用期间分页
  queryAppDuring(params) {
    return http.post('/dataMapSchemeVersionQj/findAll', QS.stringify(params))
  },
  // 删除应用期间
  delAppDuring(params) {
    return http.post('/dataMapSchemeVersionQj/remove', QS.stringify(params))
  },
  // 复制为新版本
  copyNewVersion(params) {
    return http.post('/dataMapSchemeVersion/copyAsNewVersion', QS.stringify(params))
  }
}
export default dataMapManage
