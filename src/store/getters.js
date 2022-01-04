const getters = {
  sidebar: state => state.app.sidebar,
  theme: state => state.app.theme,
  date: state => state.app.date,
  token: state => state.user.token,
  units: state => state.user.units,
  acsets: state => state.user.acsets,
  kjzds: state => state.user.kjzds,
  targetAcset: state => state.user.targetAcset,
  avatar: state => state.user.avatar,
  permissionRoutes: state => state.permission.routes,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  tabs: state => state.customTab.tabs,
  activeTab: state => state.customTab.isActiveTab,
  glbs: state => state.glb.tabs,
  activeTableId: state => state.glb.activeTableId,
  ywsj: state => state.ywsj.tabs,
  activeYwId: state => state.ywsj.adtiveYwId,
  diftag: state => state.diftag.tabs,
  activeDiftag: state => state.diftag.activeTableId
}
export default getters
