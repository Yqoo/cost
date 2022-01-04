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

const ztParameter = {
  //  获取账套参数列表
  getZTCSList(params) {
    return http.get(`/zhangTaoParametersDetails/getListByZtsn?${strSplicing(params)}`)
  },
  // 还原账套参数
  restoreZTCS(params) {
    return http.post(`/zhangTaoParametersDetails/reduction?${strSplicing(params)}`)
  },
  // 更新账套参数信息
  updateZTCSInfo(params) {
    return http.post('/zhangTaoParametersDetails/update', QS.stringify(params))
  }

}

export default ztParameter
