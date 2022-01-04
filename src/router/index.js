import Vue from 'vue'
// eslint-disable-next-line import/no-extraneous-dependencies
import Router from 'vue-router'
import Layout from '@/views/Layout'
/*  import managementRoute from './modules/management' //  系统管理
    import treatmentRoute from './modules/treatment' // 账务处理
*/
/* 由多级路由更改为 二级路由 */
import system from './modules/system' //  系统管理

/* 解决重复点击路由 报路由重复的错误 */
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const originalReplace = Router.prototype.replace
Router.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch(err => err)
}

Vue.use(Router)

export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  system,
  {
    path: '/login',
    name: 'Login',
    hidden: true,
    component: () => import('@/views/Login/index'),
    meta: { title: '登录' }
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    name: 'Page401',
    meta: { title: '401', noCache: true },
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    name: 'Page404',
    meta: { title: '404', noCache: true },
    hidden: true
  },
  // 404 页面配置必须放在路由词典最后
  { path: '*', redirect: '/404', hidden: true }
]
const router = new Router({
  base: '/gl',
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
export default router
