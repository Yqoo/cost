import { constantRoutes } from '@/router'

function hasPermission(roles, route) {
  if (route.name) {
    return roles.some(role => role === route.name)
  }
  return true
}

function floaderHasChild(obj = {}) { // 末级菜单type为menu 非末级为folder 当 folder下menu为空时应过滤该folder
  return Object.keys(obj).filter(item => {
    if (obj[item].type === 'folder') {
      return obj[item].children.length !== 0
    }
    return true
  })
}

export function filterAsyncRoutes(routes, roles) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  return res
}

const state = {
  routes: []
}

const mutations = {
  SET_ROUTES: (states, routes) => {
    states.routes = routes
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      const accessedRoutes = filterAsyncRoutes(constantRoutes, floaderHasChild(roles))
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
