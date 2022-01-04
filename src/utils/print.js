import { MessageBox } from 'element-ui'
import tools from './tools'

const printFn = options => {
  const {
    url, name, params = {}, callBack
  } = options
  MessageBox.confirm('下载文件为pdf, 是否继续？', '文件打印', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(() => {
    tools.downloadWithToken(url, params, `${name}.pdf`)
  }).catch(e => e)
}

export default printFn
