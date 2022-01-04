import http from './http'
import QS from 'qs'

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

export function getList() {
  return http.get('/backup/getAllBackup')
}

export function getRange() {
  return http.get('/backup/addData')
}

export function getDetail(params) {
  return http.get(`/backup/getById?${strSplicing(params)}`)
}

export function del(params) {
  return http.post('/backup/deleteBySn', QS.stringify(params))
}

export function save(url, params) {
  return http.post(url, QS.stringify(params))
}

export function getHistory(params) {
  return http.get(`/backup/backupHistory?${strSplicing(params)}`)
}

export function delHistory(params) {
  return http.post('/backup/deleteBackupHistory', QS.stringify(params))
}
export function changeStatu(params) {
  return http.post('/backup/updateStatus', QS.stringify(params))
}

export function recoverByHistory(params) {
  return http.post('/backup/recoverByHistory', QS.stringify(params))
}
