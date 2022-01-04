const state = {
  visitedViews: [],
  cachedViews: []
}

const mutations = {
  ADD_VISITED_VIEW: (states, view) => {
    if (states.visitedViews.some(v => v.path === view.path)) return
    states.visitedViews.push(
      { ...view, title: view.meta.title || 'no-name' }
    )
  },
  ADD_CACHED_VIEW: (states, view) => {
    if (states.cachedViews.includes(view.name)) return
    if (!view.meta.noCache) {
      states.cachedViews.push(view.name)
    }
  },

  DEL_VISITED_VIEW: (states, view) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const [i, v] of states.visitedViews.entries()) {
      if (v.path === view.path) {
        states.visitedViews.splice(i, 1)
        break
      }
    }
  },
  DEL_CACHED_VIEW: (states, view) => {
    const index = states.cachedViews.indexOf(view.name)
    index > -1 && states.cachedViews.splice(index, 1)
  },

  DEL_OTHERS_VISITED_VIEWS: (states, view) => {
    states.visitedViews = states.visitedViews.filter(v => v.meta.affix || v.path === view.path)
  },
  DEL_OTHERS_CACHED_VIEWS: (states, view) => {
    const index = states.cachedViews.indexOf(view.name)
    if (index > -1) {
      states.cachedViews = states.cachedViews.slice(index, index + 1)
    } else {
      states.cachedViews = []
    }
  },

  DEL_ALL_VISITED_VIEWS: states => {
    // keep affix tags
    const affixTags = states.visitedViews.filter(tag => tag.meta.affix)
    states.visitedViews = affixTags
  },
  DEL_ALL_CACHED_VIEWS: states => {
    states.cachedViews = []
  },

  UPDATE_VISITED_VIEW: (states, view) => {
    // eslint-disable-next-line no-restricted-syntax
    for (let v of states.visitedViews) {
      if (v.path === view.path) {
        v = Object.assign(v, view)
        break
      }
    }
  }
}

const actions = {
  addView({ dispatch }, view) {
    dispatch('addVisitedView', view)
    dispatch('addCachedView', view)
  },
  addVisitedView({ commit }, view) {
    commit('ADD_VISITED_VIEW', view)
  },
  addCachedView({ commit }, view) {
    if (view.matched && view.matched.length >= 3) { // 若为三级及其以上路由点击打开标签页时，将三级路由或以上的根目录路由塞入缓存路由name list中
      commit('ADD_CACHED_VIEW', view.matched[1])
    }
    commit('ADD_CACHED_VIEW', view)
  },

  delView({ dispatch }, view) {
    return new Promise(resolve => {
      dispatch('delVisitedView', view)
      dispatch('delCachedView', view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  delVisitedView({ commit }, view) {
    return new Promise(resolve => {
      commit('DEL_VISITED_VIEW', view)
      resolve([...state.visitedViews])
    })
  },
  delCachedView({ commit }, view) {
    return new Promise(resolve => {
      if (view.matched && view.matched.length >= 3) {
        commit('DEL_CACHED_VIEW', view.matched[1])
      }
      commit('DEL_CACHED_VIEW', view)
      resolve([...state.cachedViews])
    })
  },

  delOthersViews({ dispatch }, view) {
    return new Promise(resolve => {
      dispatch('delOthersVisitedViews', view)
      dispatch('delOthersCachedViews', view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  delOthersVisitedViews({ commit }, view) {
    return new Promise(resolve => {
      commit('DEL_OTHERS_VISITED_VIEWS', view)
      resolve([...state.visitedViews])
    })
  },
  delOthersCachedViews({ commit }, view) {
    return new Promise(resolve => {
      commit('DEL_OTHERS_CACHED_VIEWS', view)
      resolve([...state.cachedViews])
    })
  },

  delAllViews({ dispatch }, view) {
    return new Promise(resolve => {
      dispatch('delAllVisitedViews', view)
      dispatch('delAllCachedViews', view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  delAllVisitedViews({ commit }) {
    return new Promise(resolve => {
      commit('DEL_ALL_VISITED_VIEWS')
      resolve([...state.visitedViews])
    })
  },
  delAllCachedViews({ commit }) {
    return new Promise(resolve => {
      commit('DEL_ALL_CACHED_VIEWS')
      resolve([...state.cachedViews])
    })
  },

  updateVisitedView({ commit }, view) {
    commit('UPDATE_VISITED_VIEW', view)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
