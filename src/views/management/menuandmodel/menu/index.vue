<template>
  <div class="menu-comp">
    <LeftWorkbench ref="leftWorkbench" :width="width" title="目录">
      <el-button
        v-if="apis.includes('/menu/add')"
        slot="addUnit"
        icon="el-icon-plus"
        size="small"
        type="text"
        style="padding: 0;"
        @click="() => folder.show = true"
      />
      <Tree
        slot="tree"
        ref="tree"
        v-waiting="tree.loading"
        search
        :data="tree.data"
        :node-props="{
          children: 'children',
          label: 'label'
        }"
        :default-expanded-keys="tree.focusId"
        :rightmenus="rightmenus"
        @update:rightmenus="rightmenusHandler"
        @setTargetNode="setTargetNode"
      />
    </Leftworkbench>
    <MiddleDrag :margin-top="middleDragTop" @hook:mounted="getTop" @move="move" />
    <RightWorkbench :margin-left="width">
      <ToolsBar
        slot="toolsBar"
        class="btnColor"
        module-name="Menu"
        :items="btns"
        style="border-bottom: 1px solid #ddd"
        @btnsHandler="btnsHandler"
      />
      <Table
        slot="table"
        ref="table"
        v-waiting="table.loading"
        :data="table.data"
        :columns="columns"
        :search="true"
        module-name="Menu"
        :tools="tableTools"
        number
        multiple
        @search="search"
        @toolshandler="tableRowHandler"
        @select="selection => table.selection = selection"
        @refresh="refresh"
      />
    </RightWorkbench>
    <Folderform
      v-if="folder.show"
      :show.sync="folder.show"
      :td="tree.data"
      :parent="folder.parent"
      :update-info="folder.updateInfo"
      @refresh="id => getTree([id])"
      @close="closeForm('folder')"
    />
    <Menuform
      v-if="menu.show"
      :show.sync="menu.show"
      :td="tree.data"
      :parent="menu.parent"
      :update-info="menu.updateInfo"
      :obj-info="objInfo"
      @refresh="id => getPage({ pid: id })"
      @close="closeForm('menu')"
    />
  </div>
</template>

<script>

import Sortable from 'sortablejs'

export default {
  name: 'Menu',
  components: {
    Folderform: () => import('./dialog/folderForm'),
    Menuform: () => import('./dialog/menuForm')
  },
  data() {
    return {
      width: 300,
      middleDragTop: this.width,
      tree: {
        loading: false,
        data: [],
        focusId: [],
        targetNode: {},
        cloneData: []
      },
      table: {
        loading: false,
        data: [],
        selection: []
      },
      folder: {
        show: false,
        parent: {
          id: '',
          label: ''
        },
        updateInfo: {}
      },
      menu: {
        show: false,
        parent: {
          id: '',
          label: ''
        },
        updateInfo: {}
      },
      objInfo: {},
      isSorting: false,
      sortObj: null,
      pid: ''
    }
  },
  computed: {
    apis() {
      return this.$tools.getModuleAPIS('Menu')
    },
    nodeId() {
      return this.tree.targetNode.id
    },
    btns() {
      const b = [
        {
          method: 'add', name: '新增', icon: 'el-icon-circle-plus-outline', api: '/menu/add'
        },
        {
          method: 'del', name: '删除', icon: 'el-icon-delete', api: '/menu/delete'
        },
        { method: 'confirm', name: '保存排序', api: '/menu/sort' }
      ]
      return b
    },
    columns() {
      return [
        { label: '名称', prop: 'name' },
        { label: '类型', prop: 'type', formatter: val => (val === 'menu' ? '菜单' : '目录') },
        { label: '别名', prop: 'alias' },
        { label: '模块', prop: 'model_name' },
        { label: '来源', prop: 'sourceType', formatter: val => (val === 'system' ? '系统' : '自定义') },
        { label: '操作', prop: undefined }
      ]
    },
    tableTools() {
      return [
        {
          icon: 'el-icon-edit-outline', title: '编辑', type: 'edit', api: '/menu/update'
        },
        {
          icon: 'el-icon-delete', title: '删除', type: 'del', api: '/menu/delete'
        }
      ]
    }
  },
  watch: {
    nodeId(id) {
      this.getPage({ pid: id })
    },
    // eslint-disable-next-line func-names
    'tree.targetNode': function (val) {
      if (val) {
        this.objInfo.label = val.label
        this.objInfo.id = val.id
        this.objInfo.children = val.children
      }
    }
  },
  created() {
    this.getTree()
    this.getPage({})
  },
  mounted() {
    this.rowDrop()
  },
  methods: {
    rowDrop() {
      const tbody = document.querySelector('.el-table__body-wrapper tbody')
      const that = this
      this.sortObj = Sortable.create(tbody, {
        onEnd(evt) {
          const { data } = that.table
          const { oldIndex, newIndex } = evt
          const temp = data.splice(oldIndex, 1)
          data.splice(newIndex, 0, ...temp)
        }
      })
    },
    rightmenus(node) {
      const { apis } = this
      const rm = [
        {
          label: '添加目录', icon: 'el-icon-plus', type: 'addFolder', api: '/menu/add'
        },
        {
          label: '修改目录', icon: 'el-icon-edit-outline', type: 'update', api: '/menu/update'
        },
        {
          label: '删除目录', icon: 'el-icon-delete', type: 'del', api: '/menu/delete'
        },
        {
          label: '新增菜单', icon: 'el-icon-circle-plus', type: 'addMenu', api: '/menu/add'
        }
      ]
      return rm.filter(item => apis.includes(item.api))
    },
    rightmenusHandler(obj) {
      const { type, data } = obj
      this.tree.targetNode = { ...data }
      const METHODS = {
        addFolder: () => {
          this.folder.parent = {
            id: data.id,
            label: data.label
          }
          this.folder.show = true
        },
        update: () => {
          this.$api.menu.getFolderDetail({ id: data.id }).then(s => {
            Object.assign(this.folder.updateInfo, {
              name: s.data.name,
              alias: s.data.alias,
              pidName: s.data.pname,
              pid: s.data.pid,
              type: 'folder',
              id: data.id,
              path: s.data.path,
              icon: s.data.icon
            })
            this.folder.show = true
          }).catch(e => this.$message.error(e.message))
        },
        del: () => {
          this.deleteFM([data], 'folder')
        },
        addMenu: () => {
          this.menu.parent = {
            id: data.id,
            label: data.label
          }
          this.menu.show = true
        }
      }
      METHODS[type]()
    },
    deleteFM(data, type) {
      const ids = data.map(d => d.id)
      if (ids.length === 0) this.$message.warning('请先选择要删除的数据！')
      else {
        this.$confirm('当前操作将会删除所选数据，是否继续？', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.menu.deleteFM({ id: ids.join(',') }).then(s => {
            if (type === 'folder') {
              this.$refs.tree.remove(data[0])
              this.getPage({})
            } else {
              this.getPage({ pid: this.pid })
              this.$refs.table.clearSelection()
            }
            this.$message.success('删除成功！')
          }).catch(e => this.$message.error(e.message))
        }).catch(e => e)
      }
    },
    closeForm(type) {
      this[type].parent = {
        id: '',
        label: ''
      }
      this[type].updateInfo = {}
      this[type].show = false
    },
    search(query) {
      this.getPage({
        query,
        pid: this.nodeId || ''
      })
    },
    refresh() {
      this.getPage({ pid: this.nodeId || '' })
    },
    btnsHandler(type) {
      const METHODS = {
        add: () => {
          this.menu.show = true
        },
        del: () => {
          this.deleteFM(this.table.selection, 'menu')
        },
        sort: () => {
          this.isSorting = true
          this.rowDrop()
        },
        cancel: () => {
          this.isSorting = false
          this.table.data = []
          this.$nextTick(() => {
            this.table.data = [...this.table.cloneData]
          })
          this.sortObj && this.sortObj.destroy()
        },
        confirm: () => {
          const sort = this.table.data.map((item, index) => ({
            id: item.id,
            sort: index
          }))
          if (sort.length) {
            this.$api.menu.sort({
              sorts: JSON.stringify(sort)
            }).then(s => {
              this.$message.success('菜单排序成功！')
              this.isSorting = false
            }).catch(e => this.$message.error(e.message))
          }
        }
      }
      METHODS[type]()
    },
    tableRowHandler({ type, scope }) {
      const METHODS = {
        edit: () => {
          this.$api.menu.getFolderDetail({ id: scope.row.id }).then(s => {
            Object.assign(this.menu.updateInfo, {
              name: s.data.name,
              alias: s.data.alias,
              pname: s.data.pname,
              pid: s.data.pid,
              type: s.data.type,
              modelId: s.data.model_id,
              id: scope.row.id,
              path: s.data.path,
              icon: s.data.icon,
              outLinkUrl: s.data.outLinkUrl,
              outLink: s.data.outLink
            })
            this.menu.show = true
          }).catch(e => this.$message.error(e.message))
        },
        del: () => {
          this.deleteFM([scope.row], 'menu')
        }
      }
      METHODS[type]()
    },
    setTargetNode(node) {
      this.tree.targetNode = { ...node }
    },
    // eslint-disable-next-line object-curly-newline
    getPage({ pid = '', query = '' }) {
      this.table.loading = true
      this.pid = pid
      this.$api.menu.getMenuPage({
        pid,
        query
      }).then(s => {
        this.table.cloneData = s.data
        this.table.data = [...this.table.cloneData]
        this.table.loading = false
      }).catch(e => {
        this.table.loading = false
        this.$message.error(e.message)
      })
    },
    getTree(expand = []) {
      this.tree.loading = true
      this.$api.menu.folderTree().then(s => {
        this.tree.data = [s.data]
        this.tree.focusId = expand
        this.tree.loading = false
      }).catch(e => {
        this.tree.loading = false
        this.$message.error(e.message)
      })
    },
    getTop() { // 拖拽
      this.middleDragTop = this.$refs.leftWorkbench.$el.offsetHeight / 2
    },
    move(x) { // 移动
      if (x < 300) x = 300
      else if (x > 800) x = 800
      this.width = x
    }
  }
}
</script>

<style>

</style>
