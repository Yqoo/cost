/**
 * 自定义工具函数
 */
/**
 *desc:扁平化数据格式化为树形结构数据
 *params: nodes => 初始节点数据 root => 根节点
 */
import http from '@/api/http.js'
import axios from 'axios'
import { Message } from 'element-ui'
import QS from 'qs'
import { getTokenName } from './auth'

const treeNodeFormatter = (nodes, root, pid = 'parentId', cid = 'id') => {
  const group = {}
  Object.keys(nodes).forEach(key => { // 分组
    if (!group[nodes[key][pid]]) group[nodes[key][pid]] = []
    group[nodes[key][pid]].push(nodes[key])
  })
  const rootNodes = group[root]
  group[root] = null;
  +(function traverseTreeNodeGroup(treeNodeGroup) {
    Object.keys(treeNodeGroup).forEach(key => {
      const node = treeNodeGroup[key]
      if (group[node[cid]]) {
        node.children = group[node[cid]]
        group[node[cid]] = null
        traverseTreeNodeGroup(node.children)
      }
    })
  }(rootNodes))
  return rootNodes
}

const arrayToTree = (pid, array) => array.filter(item => item.pid === pid).map(item => ({
  ...item,
  children: arrayToTree(item.id, array)
}))
/**
 *desc:form表单下载文件
 */
const download = (method, url, params) => {
  const form = document.createElement('form') // 定义form表单,通过表单发送请求
  form.setAttribute('style', 'display:none')
  form.setAttribute('target', '')
  form.setAttribute('method', method)
  form.setAttribute('action', url)
  Object.keys(params).forEach(key => {
    const input = document.createElement('input')
    input.setAttribute('type', 'hidden')
    input.setAttribute('name', key)
    input.setAttribute('value', params[key])
    form.appendChild(input)
  })
  document.body.appendChild(form)
  form.submit() // 表单提交
  document.body.removeChild(form)
  return false
}

/* 获取cookie */
const getCookie = name => {
  name = name || getTokenName()
  const prefix = `${name}=`
  const start = document.cookie.indexOf(prefix)

  if (start === -1) {
    return null
  }

  let end = document.cookie.indexOf(';', start + prefix.length)
  if (end === -1) {
    end = document.cookie.length
  }

  const value = document.cookie.substring(start + prefix.length, end)
  return unescape(value)
}
/* axios携带token下载文件 */
const strSplicing = params => {
  let url = ''
  if (params) {
    Object.keys(params).forEach(key => {
      url += `${key}=${params[key]}&`
    })
    url = url.slice(0, -1)
  }
  return url
}
const downloadWithToken = (url, data, fileName, method = 'GET') => {
  const auth = getCookie()
  if (auth) {
    const { baseURL } = http.defaults
    const options = {
      method,
      url: '',
      responseType: 'blob', // 服务器返回的数据类型
      headers: {
        Authorization: auth,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
    if (method === 'GET') options.url = `${baseURL}${url}?${strSplicing(data)}`
    else {
      options.url = `${baseURL}${url}`
      options.data = QS.stringify(data)
    }
    axios(options).then(res => {
      const content = res.data
      const blob = new Blob([content]) // 创建一个类文件对象：Blob对象表示一个不可变的、原始数据的类文件对象
      const dom = document.createElement('a') // 设置一个隐藏的a标签，href为输出流，设置download
      const href = window.URL.createObjectURL(blob) // URL.createObjectURL(object)表示生成一个File对象或Blob对象
      dom.style.display = 'none'
      dom.href = href
      dom.setAttribute('download', fileName) // 指示浏览器下载url,而不是导航到它；因此将提示用户将其保存为本地文件
      document.body.appendChild(dom)
      dom.click()
      document.body.removeChild(dom)
      window.URL.revokeObjectURL(href)
    }).catch(e => {
      Message.error('打印失败！')
    })
  }
}

/**
 *特殊对象格式转换为数组对象
 *
*/
const specialObjToObj = obj => {
  const arr = []
  Object.keys(obj).forEach(key => {
    arr.push(obj[key])
  })
  return arr
}
/* 对象深克隆 */
const deepClone = obj => {
  const objClone = Array.isArray(obj) ? [] : {}
  if (obj && typeof obj === 'object') {
    Object.keys(obj).forEach(key => {
      if (obj[key] && typeof obj[key] === 'object') {
        objClone[key] = deepClone(obj[key])
      } else {
        objClone[key] = obj[key]
      }
    })
  }
  return objClone
}

/* 对象数组去重 */
function reduceArr(arr, type) {
  let list = []
  const obj = {}
  list = arr.reduce((cur, next) => {
    obj[next[type]] ? '' : obj[next[type]] = true && cur.push(next)
    return cur
  }, [])
  return list
}

/**
 * @desc: 时间戳转换
 * @param  date
 * @param formatStr 日期格式 （'YYYY-MM-DD HH:ii:ss', 'YYYY-MM-DD 周W', 'HH:ii:ss', 'YYYY/MM/DD HH:ii:ss'）
 */
function addZero(v, size) {
  for (let i = 0, len = size - (`${v}`).length; i < len; i++) {
    v = `0${v}`
  }
  return `${v}`
}
const timestamp = (date, formatStr = 'YYYY/MM/DD') => {
  const arrWeek = ['日', '一', '二', '三', '四', '五', '六']
  // eslint-disable-next-line max-len
  const str = formatStr.replace(/yyyy|YYYY/, date.getFullYear()).replace(/yy|YY/, addZero(date.getFullYear() % 100, 2)).replace(
    /mm|MM/, addZero(date.getMonth() + 1, 2)
  ).replace(/m|M/g, date.getMonth() + 1)
    .replace(/dd|DD/, addZero(date.getDate(),
      2))
    .replace(/d|D/g, date.getDate())
    .replace(/hh|HH/, addZero(date.getHours(), 2))
    .replace(/h|H/g, date.getHours())
    .replace(/ii|II/, addZero(date.getMinutes(), 2))
    .replace(/i|I/g, date.getMinutes())
    .replace(/ss|SS/, addZero(date.getSeconds(),
      2))
    .replace(/s|S/g, date.getSeconds())
    .replace(/w/g, date.getDay())
    .replace(/W/g, arrWeek[date.getDay()])
  return str
}
/**
 *@desc 数字转金额
 *@params num, decimal, thousandsSep
 */

function formatNumber(num, decimals = 2, thousandsSep) {
  if (typeof (num) === 'string') {
    num = num.replace(/\s+/g, '')
  }
  if (isNaN(num)) {
    num = '0.00'
  }
  const prec = !isFinite(+decimals) ? 0 : Math.abs(decimals) // 保留的位数一定是有限位数的正整数
  const sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep
  const s = num.toString().replace(/,/g, '') // 字符串，将，变成'';
  const p = parseFloat(s) // 解析一个字符串，并返回一个浮点数
  const n = isNaN(p) ? 1 : p
  const formatNum = n.toFixed(prec).toString().replace(/(\d)(?=(\d{3})+\.)/g, ($0, $1) => $1 + sep)
  return num ? formatNum : ''
}

/**
 * @desc 数字转中文大写
 */
const numberToChinese = str => {
  let num = parseFloat(str)
  let strOutput = ''
  let strUnit = '仟佰拾亿仟佰拾万仟佰拾元角分'
  num += '00'
  const intPos = num.indexOf('.')
  if (intPos >= 0) {
    num = num.substring(0, intPos) + num.substr(intPos + 1, 2)
  }
  strUnit = strUnit.substr(strUnit.length - num.length)
  for (let i = 0; i < num.length; i++) {
    strOutput += '零壹贰叁肆伍陆柒捌玖'.substr(num.substr(i, 1), 1) + strUnit.substr(i, 1)
  }
  return strOutput.replace(/零角零分$/, '整').replace(/零[仟佰拾]/g, '零').replace(/零{2,}/g, '零').replace(/零([亿|万])/g, '$1')
    .replace(/零+元/, '元')
    .replace(/亿零{0,3}万/, '亿')
    .replace(/^元/, '零元')
}

/**
 * @desc 去除千分位
 * @param {value}
 * @returns num
 */

const delcommafy = value => {
  if (!value) return value
  if ((`${value}`).trim() === '') {
    return ''
  }
  if (!value.toString().includes(',')) return value
  value = value.replace(/,/gi, '')
  return value
}

/*
* fn [function] 需要防抖的函数
* delay [number] 毫秒，防抖期限值
*/
const debounce = (fn, delay) => {
  let timer = null
  // eslint-disable-next-line func-names
  return function () {
    if (timer) clearTimeout(timer)
    timer = setTimeout(fn, delay)
  }
}

/**
 * 数字千分位转换
 * @params number
 * Intl.NumberFormat().format(number) number && number.replace(/(?!^)(?=(\d{3})+\.)/g, ",")
 */

const formatThousandth = number => number.toLocaleString('en')

/**
 * 获取当前模块组件的按钮级权限
 * @params name => 组件的name
 */
const getModuleAPIS = name => {
  if (name === '') return []
  const ALL_MODULE_APIS = JSON.parse(localStorage.getItem('MODULE_APIS') || '{}')
  return ALL_MODULE_APIS[name]
}

const tools = {
  treeNodeFormatter,
  download,
  specialObjToObj,
  deepClone,
  timestamp,
  formatNumber,
  downloadWithToken,
  getCookie,
  numberToChinese,
  debounce,
  formatThousandth,
  delcommafy,
  reduceArr,
  getModuleAPIS
}
export default tools
