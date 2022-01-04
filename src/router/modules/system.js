import Layout from '@/views/Layout'

const system = {
  path: '/',
  component: Layout,
  redirect: '/workbench',
  name: 'System',
  meta: { title: '系统管理', icon: 'icon-xitongguanli' },
  children: [
    {
      path: '/workbench',
      component: () => import('@/views/management/workbench/index'),
      name: 'Workbench',
      meta: { title: '工作台', icon: 'icon-gongzuotai', affix: true },
      hidden: true
    },
    { // s
      path: '/periodspland',
      name: 'Periodspland',
      meta: { title: '会计期间方案', icon: 'icon-fangan' },
      component: () => import('@/views/management/metaData/periodsPland')
    },
    { // s
      path: '/sysDossier',
      name: 'SysDossier',
      meta: { title: '系统档案', icon: 'icon-danganjianying' },
      component: () => import('@/views/management/sysDossier/index')
    },
    { // s
      path: '/sysBusiness',
      name: 'SysBusiness',
      meta: { title: '系统业务', icon: 'icon-yewu-tianchong' },
      component: () => import('@/views/management/sysBusiness/index')
    },
    { // s
      path: '/userManagement',
      name: 'UserManagement',
      meta: { title: '用户管理', icon: 'icon-yonghu' },
      component: () => import('@/views/management/user/userManagement')
    },
    { // s
      path: '/functionRole',
      name: 'FunctionRole',
      meta: { title: '功能角色', icon: 'icon-yidongyunkongzhitaiicon45' },
      component: () => import('@/views/management/user/functionRole')
    },
    { // s
      path: '/model',
      name: 'Model',
      meta: { title: '模块管理', icon: 'icon-mokuaiguanli' },
      component: () => import('@/views/management/menuandmodel/model')
    },
    { // s
      path: '/menu',
      name: 'Menu',
      meta: { title: '菜单管理', icon: 'icon-icon_huabanfuben' },
      component: () => import('@/views/management/menuandmodel/menu')
    },
    {
      path: '/admindata',
      name: 'Admindata',
      redirect: () => `/admindata/${new Date().getTime()}`
    },
    {
      path: '/admindata/:param',
      name: 'Admindata',
      meta: { title: '管理数据', icon: 'icon-zhinengsuanfa' },
      component: () => import('@/views/adminData/index')
    },
    {
      path: '/managementTable',
      name: 'ManagementTable',
      redirect: () => `/managementTable/${new Date().getTime()}`
    },
    {
      path: '/managementTable/:param',
      name: 'ManagementTable',
      meta: { title: '管理表', icon: 'icon-tianxie' },
      component: () => import('@/views/managementTable/index')
    },
    {
      path: '/businessData',
      name: 'Businessdata',
      redirect: () => `/businessData/${new Date().getTime()}`
    },
    {
      path: '/businessData/:param',
      name: 'Businessdata',
      meta: { title: '业务数据', icon: 'icon-tianxie' },
      component: () => import('@/views/businessData/index')
    },
    { // s
      path: 'reportxm',
      name: 'Reportxm',
      meta: { title: '报表项目', icon: 'icon-xitongcanshushezhi' },
      component: () => import('@/views/management/reportBb/reportxm')
    },
    { // s
      path: 'reportXmDa',
      name: 'ReportXmDa',
      meta: { title: '报表项目档案', icon: 'icon-xitongcanshushezhi' },
      component: () => import('@/views/management/reportBb/reportXmDa')
    },
    { // s
      path: '/dataSource',
      name: 'DataSource',
      meta: { title: '数据源', icon: '' },
      component: () => import('@/views/management/dataSource')
    },
    { // s
      path: '/functionCenter',
      name: 'FunctionCenter',
      meta: { title: '函数中心', icon: '' },
      component: () => import('@/views/management/functionHS/functionCenter')
    },
    {
      path: '/functionDesign',
      name: 'FunctionDesign',
      redirect: () => `/functionDesign/${new Date().getTime()}`
    },
    {
      path: '/functionDesign/:param',
      name: 'FunctionDesign',
      meta: { title: '函数设计', icon: '' },
      component: () => import('@/views/management/functionHS/functionDesign')
    },
    { // s
      path: '/reportDesign',
      name: 'ReportDesign',
      meta: { title: '报表设计', icon: '' },
      component: () => import('@/views/management/reportBb/reportDesign')
    },
    {
      path: '/reportCenter',
      name: 'ReportCenter',
      redirect: () => `/reportCenter/${new Date().getTime()}`
    },
    {
      path: '/reportCenter/:param',
      name: 'ReportCenter',
      meta: { title: '报表模板', icon: '' },
      component: () => import('@/views/management/reportBb/reportCenter')
    },
    { // s
      path: '/reportData',
      name: 'ReportData',
      meta: { title: '报表数据', icon: '' },
      component: () => import('@/views/management/reportBb/reportData')
    },
    {
      path: '/ReportPage',
      name: 'ReportPage',
      meta: { title: '报表计算数据', icon: '' },
      component: () => import('@/views/management/reportBb/reportPage')
    },
    { // s
      path: '/kettle',
      name: 'Kettle',
      meta: { title: '数据算法', icon: '' },
      component: () => import('@/views/management/kettle')
    },
    { // s
      path: '/dataMap',
      name: 'DataMap',
      meta: { title: '映射方案', icon: '' },
      component: () => import('@/views/management/dataMap')
    },
    {
      path: '/mxGraph/:id',
      name: 'MxGraph',
      meta: { title: '算法设计', icon: '' },
      component: () => import('@/views/management/mxGraph')
    },
    { // s
      path: '/dataMapManage',
      name: 'DataMapManage',
      meta: { title: '映射管理', icon: '' },
      component: () => import('@/views/management/dataMapManage')
    },
    {
      path: '/dataMapManage/:sn',
      name: 'DataMapManage',
      meta: { title: '映射管理', icon: '' },
      component: () => import('@/views/management/dataMapManage')
    },
    { // s
      path: '/earlyWarning',
      name: 'EarlyWarning',
      meta: { title: '预警规则', icon: '' },
      component: () => import('@/views/management/earlyWarning')
    },
    {
      path: '/reportMenu',
      name: 'ReportMenu',
      redirect: () => `/reportMenu/${new Date().getTime()}`
    },
    {
      path: '/reportMenu/:param',
      name: 'ReportMenu',
      meta: { title: '报表菜单', icon: 'icon-zhinengsuanfa' },
      component: () => import('@/views/reportMenu/index')
    },
    {
      path: '/addMenu',
      name: 'AddMenu',
      redirect: () => `/addMenu/${new Date().getTime()}`
    },
    {
      path: '/addMenu/:param',
      name: 'AddMenu',
      meta: { title: '新增菜单', icon: '' },
      component: () => import('@/views/management/addMenu')
    },
    { // s
      path: '/dataComparison',
      name: 'DataComparison',
      meta: { title: '数据比对', icon: '' },
      component: () => import('@/views/management/dataComparison')
    },
    { // s
      path: '/dataCalculation',
      name: 'DataCalculation',
      meta: { title: '数据计算', icon: '' },
      component: () => import('@/views/management/dataCalculation')
    },
    {
      path: '/transformComp',
      name: 'TransformComp',
      redirect: () => `/transformComp/${new Date().getTime()}`
    },
    {
      path: '/transformComp/:param',
      name: 'TransformComp',
      meta: { title: '转换', icon: 'icon-zhinengsuanfa' },
      component: () => import('@/views/transformComp/index')
    },
    { // s
      path: '/scene',
      name: 'Scene',
      meta: { title: '业务场景', icon: '' },
      component: () => import('@/views/management/scene')
    },
    {
      path: '/sceneDesign/:id/:name/:model',
      name: 'SceneDesign',
      meta: { title: '场景设计', icon: '' },
      component: () => import('@/views/management/scene/design')
    }
  ]
}

export default system
