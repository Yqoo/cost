/* eslint-disable no-shadow */
import { getToken, setToken, removeToken } from '@/utils/auth'
import {
  login, logout, getZT, getUnits, setTargetZT, getKJZD
} from '@/api/user'
import { stringify } from 'qs'

const state = {
  token: getToken(),
  acsets: [], // 账套集合
  units: [], // 单位
  targetAcset: null, // 当前启用账套
  name: '',
  avatar: '',
  roles: [],
  kjzds: [] // 会计制度
}

const mutations = {
  SET_TOKEN: (states, token) => {
    states.token = token
  },
  SET_ZT: (states, acsets) => {
    states.acsets = acsets
  },
  SET_TARGETZT: (states, target) => {
    states.targetAcset = target
  },
  SET_NAME: (states, name) => {
    states.name = name
  },
  SET_ROLES: (states, roles) => {
    states.roles = roles
  },
  SET_UNITS: (states, units) => {
    states.units = units
  },
  SET_ROUTES: (states, routers) => {
    states.routers = routers
  },
  SET_KJZD: (states, kjzds) => {
    states.kjzds = kjzds
  },
  REFRESH_AVATAR: (states, url) => {
    states.avatar = url
  }
}
const actions = {
  login({ commit }, userInfo) {
    const {
      username, password, code, type
    } = userInfo
    return new Promise((resolve, reject) => {
      login({
        username, password, code, type
      }).then(response => {
        const {
          menuapis,
          token,
          zth,
          routers,
          company,
          expire,
          version,
          userName,
          id,
          customDialog,
          earlyWarningRecord,
          platform
        } = response.data
        commit('SET_TOKEN', token)
        commit('SET_ROLES', menuapis)
        commit('SET_TARGETZT', zth)
        localStorage.setItem('footerInfo', JSON.stringify({
          company,
          expire,
          version,
          platform
        }))
        localStorage.setItem('userName', userName)
        localStorage.setItem('userId', id)
        localStorage.setItem('startZT', JSON.stringify(zth))
        localStorage.setItem('earlyWarningRecord', JSON.stringify(earlyWarningRecord))
        localStorage.setItem('menuapis', JSON.stringify(menuapis)) // 将路由信息存储到localStorage
        customDialog && localStorage.setItem('moduleCodes', JSON.stringify(customDialog.data || {}))
        setToken(token)
        resolve(menuapis)
      }).catch(error => reject(error))
    })
  },
  getZT({ commit }) {
    return new Promise((resolve, reject) => {
      getZT().then(response => {
        const { zts } = response.data
        commit('SET_ZT', zts)
        resolve(zts)
      }).catch(error => reject(error))
    })
  },
  setTargetZT({ commit }, obj) {
    return new Promise((resolve, reject) => {
      const { zth } = obj
      setTargetZT({ zth }).then(response => {
        commit('SET_TARGETZT', obj)
        localStorage.setItem('startZT', JSON.stringify(obj))
        resolve(response)
      }).catch(error => reject(error))
    })
  },
  getUnits({ commit }) {
    return new Promise((resolve, reject) => {
      getUnits().then(response => {
        const { data } = response
        commit('SET_UNITS', data)
        resolve(data)
      }).catch(err => reject(err))
    })
  },
  getKJZD({ commit }) {
    return new Promise((resolve, reject) => {
      getKJZD().then(response => {
        commit('SET_KJZD', response.data)
        resolve()
      }).catch(err => reject(err))
    })
  },
  logout({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      logout().then(response => {
        const { data } = response
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        localStorage.clear()
        resolve()
      }).catch(error => reject(error))
    })
  },
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },
  refreshAvatar({ commit }, url) {
    commit('REFRESH_AVATAR', url)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
