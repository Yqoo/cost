import { MessageBox } from 'element-ui'
import tools from './tools'

const exportFn = options => {
  const {
    url, name, params = {}, callBack, box = true
  } = options
  if (box) { // 是否需要选择下载文件格式
    MessageBox.confirm('请选择需要导出的文件类型或点击右上角关闭导出', '导出文件', {
      distinguishCancelAndClose: true,
      confirmButtonText: 'Xml',
      cancelButtonText: 'Excel'
    }).then(() => {
      tools.downloadWithToken(url, {
        type: 'xml',
        ...params
      }, `${name}.xml`)
    }).catch(action => {
      if (action === 'cancel') {
        tools.downloadWithToken(url, {
          type: 'excel',
          ...params
        }, `${name}.xls`)
      }
    })
  } else {
    tools.downloadWithToken(url, {
      type: 'excel',
      ...params
    }, `${name}.xls`)
  }
}

export default exportFn
