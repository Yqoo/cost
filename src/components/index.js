/**
 * @desc : 全局组件
 */

import Tree from '@/components/treeNode/tree'
import LeftWorkbench from '@/components/workbench/leftWorkbench'
import MiddleDrag from '@/components/workbench/middleDrag'
import RightWorkbench from '@/components/workbench/rightWorkbench'
import ToolsBar from '@/components/ToolsBar'
import Table from '@/components/table'
import Pagination from '@/components/pagination'
import Search from '@/components/treeNode/search'
import Upload from '@/components/upload'
import PromptBox from '@/components/promptBox'
import GlobalBox from '@/components/globalBox'
import FzhsBox from '@/components/fzhsBox'
import DropZone from '@/components/DropZone'
import VueCron from '@/components/VueCron'

export default function plugins(Vue) {
  Vue.component('Tree', Tree)
  Vue.component('LeftWorkbench', LeftWorkbench)
  Vue.component('MiddleDrag', MiddleDrag)
  Vue.component('RightWorkbench', RightWorkbench)
  Vue.component('ToolsBar', ToolsBar)
  Vue.component('Table', Table)
  Vue.component('Pagination', Pagination)
  Vue.component('Search', Search)
  Vue.component('Upload', Upload)
  Vue.component('PromptBox', PromptBox)
  Vue.component('GlobalBox', GlobalBox)
  Vue.component('FzhsBox', FzhsBox)
  Vue.component('DropZone', DropZone)
  Vue.component('VueCron', VueCron)
}
