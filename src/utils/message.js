import ElementUI from 'element-ui'

const TYPES = ['success', 'warning', 'info', 'error']

TYPES.forEach(type => {
  ElementUI.Message[type] = options => {
    if (typeof options === 'string') {
      options = {
        message: options
      }
      if (type === 'warning' || type === 'error') {
        options.duration = 10000
        options.showClose = true
        if (options.message.includes('code 401')) options.message = '登录过期，请重新登录！'
        ElementUI.Message.closeAll()
      }
    }
    options.type = type
    return ElementUI.Message(options)
  }
})
