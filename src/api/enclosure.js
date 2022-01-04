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
// 附件管理
const enclosure = {
  getPage(params) { // 获取附件分页 信息
    return http.get(`/file/pages?${strSplicing(params)}`)
  },
  downEnclosure(id) { // 下载附件
    return http.get(`/file/download?${stringify(id)}`)
  },
  delEnclosure(ids) { // 删除附件
    return http.post(`/file/delete?${strSplicing(ids)}`)
  }
}
export default enclosure
