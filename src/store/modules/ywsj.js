const state = {
  tabs: [],
  adtiveYwId: ''
}

const mutations = {
  ADD_TAB: (states, tab) => {
    states.tabs.push(tab)
    states.adtiveYwId = tab.id
  },
  SET_ACTIVE: (states, id) => {
    states.adtiveYwId = id
  }
}

const actions = {
  addTab({ commit }, obj) {
    const Flag = state.tabs.some(tab => tab.id === obj.id)
    Flag ? commit('SET_ACTIVE', obj.id) : commit('ADD_TAB', obj)
  },
  setTabId({ commit }, id) {
    commit('SET_ACTIVE', id)
  },
  delTab({ commit }, targetName) {
    const { tabs } = state
    let activeName = state.adtiveYwId
    if (activeName === targetName) {
      tabs.forEach((tab, index) => {
        if (tab.id === targetName) {
          const nextTab = tabs[index + 1] || tabs[index - 1]
          if (nextTab) {
            activeName = nextTab.id
          }
        }
      })
    }
    commit('SET_ACTIVE', activeName)
    state.tabs = tabs.filter(tab => tab.id !== targetName)
  },
  clearTabs() {
    state.tabs = []
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
