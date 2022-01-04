import Vue from 'vue'
import router from './router'
import store from './store'
import http from './api/http'
import api from './api/exitus'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import '@/styles/index.scss'
import '@/assets/iconfont/iconfont.css'
import tools from '@/utils/tools'
import '@/utils/message'
import './permission'
import animated from 'animate.css'
import * as filters from './filters'
import directives from './directive'
import Contextmenu from 'vue-contextmenujs'
import VTooltip from 'v-tooltip'
import plugins from '@/components/index' // 全局组件
import exportFn from '@/utils/export.js'
import printFn from '@/utils/print.js'
import '@/styles/dropzone.css'
import VueCodemirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'

Vue.use(animated)
Vue.use(ElementUI)
Vue.use(Contextmenu)
Vue.use(VueCodemirror)
Vue.use(directives)
Vue.use(VTooltip) // v-tooltip指令
Vue.use(plugins)
Vue.config.productionTip = false
Vue.prototype.$http = http
Vue.prototype.$api = api
Vue.prototype.$tools = tools
Vue.prototype.$exportFn = exportFn
Vue.prototype.$printFn = printFn

Vue.use(ElementUI, {
  size: 'mini'
})

/* register global filter */
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
