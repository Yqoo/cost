import Cookies from 'js-cookie'
import { setDate } from '@/api/user'

const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false
  },
  theme: Cookies.get('theme') || 'light',
  date: new Date()
}

const mutations = {
  TOGGLE_SIDEBAR: states => {
    states.sidebar.opened = !states.sidebar.opened
    states.sidebar.withoutAnimation = false
    if (states.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  UPDATE_THEME: states => {
    states.theme = states.theme === 'light' ? 'dark' : 'light'
    Cookies.set('theme', state.theme)
  },
  GET_DATE: states => states.date,
  UPDATE_DATE: (states, date) => {
    states.date = date
    Cookies.set('date', date)
  }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  updateTheme({ commit }) {
    commit('UPDATE_THEME')
  },
  getDate() {
    return new Promise(rve => {
      rve(state.date)
    })
  },
  updateDate({ commit }, date) {
    return new Promise((resolve, reject) => {
      setDate({ ywrq: date }).then(s => {
        commit('UPDATE_DATE', date)
        localStorage.setItem('date', date)
        resolve()
      }).catch(error => reject(error))
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
