const state = {
  editableTabs: [],
  isActiveTab: ''
}

const mutations = {
  ADD_TAB: (states, editableTabs) => {
    states.tabs.push(editableTabs)
    states.isActiveTab = editableTabs.id
  },
  SET_ACTIVE: (states, id) => {
    states.isActiveTab = id
  }
}

const actions = {
  addTab({ commit }, obj) {
    const Flag = state.editableTabs.some(tab => tab.id === obj.id)
    Flag ? commit('SET_ACTIVE', obj.id) : commit('ADD_TAB', obj)
  },
  setTabId({ commit }, id) {
    commit('SET_ACTIVE', id)
  },
  delTab({ commit }, targetName) {
    const { tabs } = state
    let activeName = state.isActiveTab
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
    state.editableTabs = tabs.filter(tab => tab.id !== targetName)
  },
  clearTabs() {
    state.editableTabs = []
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
