/**
 * 路由管理
 */

import router from './router'
import store from './store'
import NProgress from 'nprogress'
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth'

NProgress.configure({ showSpinner: false })
const whiteList = ['/login', '/401', '/404'] // 白名单

function expandArray(array, res = {}) {
  if (array.length === 0) return {}
  array.forEach(arr => {
    res[arr.name] = {
      type: arr.type,
      apis: arr.apis,
      children: arr.children
    }
    if (arr.children.length) {
      expandArray(arr.children, res)
    }
  })
  return res
}

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  document.title = to.meta.title ? `${to.meta.title} - 挚友财务管理系统` : '挚友财务管理系统'
  const hasToken = getToken()
  if (hasToken && to.path !== '/401') {
    if (to.path === '/login') {
      next()
      NProgress.done()
    } else {
      try {
        const roles = expandArray(JSON.parse(localStorage.getItem('menuapis')) || store.state.user.roles)
        console.log(roles)
        const result = await store.dispatch('permission/generateRoutes', roles)
        if (whiteList.includes(to.path)) next()
        else if (to.name === undefined) { // 路由刷新重定向 name为undefined
          next()
        } else {
          roles[to.name] ? next() : next({ path: '/401' })
        }
        next()
      } catch (error) {
        await store.dispatch('user/resetToken')
        Message.error(error || 'Has Error')
        next()
        NProgress.done()
      }
    }
  } else {
    whiteList.includes(to.path) ? next() : next(`/login?redirect=${to.path}`)
    NProgress.done()
  }
})
router.afterEach(() => {
  NProgress.done()
})
