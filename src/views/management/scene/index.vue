<template>
  <div>
    <LeftWorkbench ref="leftWorkbench" :width="width" title="场景">
      <el-button
        slot="addUnit"
        class="el-icon-plus"
        style="padding:0"
        size="mini"
        type="text"
        @click="rightmenusHandler({ type: 'add' })"
      />
      <Tree
        slot="tree"
        ref="tree"
        v-waiting="tree.loading"
        search
        :data="tree.data"
        node-key="id"
        :node-props="{
          children: 'children',
          label: 'label',
        }"
        :rightmenus="rightmenus"
        :default-expanded-keys="tree.focusId"
        @update:rightmenus="rightmenusHandler"
        @setTargetNode="setTargetNode"
      />
    </LeftWorkbench>
    <MiddleDrag
      :margin-top="middleDragTop"
      @hook:mounted="getTop"
      @move="move"
    />
    <RightWorkbench :margin-left="width">
      <Table
        ref="table"
        slot="table"
        v-waiting="table.loading"
        number
        :data="table.data"
        :columns="columns"
        :tools="tableTools"
        :multiple="true"
        :search="true"
        @toolshandler="tableToolsHandler"
        @refresh="getPage({})"
        @search="name => getPage({ name })"
        @clo-checkbox-status="checkboxStatus"
        @rowHeadersHandler="rowHeadersHandler"
      />
      <Pagination
        slot="page"
        class="pagination"
        :amount="table.total"
        :page-size="table.size"
        :current-page="table.page"
        @handleSizeChange="(val) => (table.size = val)"
        @handleCurrentChange="(val) => (table.page = val)"
      />
    </RightWorkbench>

    <tableDialog
      v-if="tableDialog.show"
      :id="tableDialog.id"
      :show.sync="tableDialog.show"
      :tree="tree.data"
      :node="tree.targetNode"
      @refreshTable="getPage({ categorySn: tree.targetNode.id || '' })"
    />
    <treeDialog
      v-if="treeDialog.show"
      :info="treeDialog.info"
      :show.sync="treeDialog.show"
      :tree="tree.data"
      @refreshTaregtNode="refreshTaregtNode"
    />
    <menuDialog
      v-if="menuDialog.show"
      :id="menuDialog.rowId"
      :checks="menuDialog.checks"
      :show.sync="menuDialog.show"
      @sendNode="nodes => relationFolderTree(nodes)"
    />
  </div>
</template>

<script>
export default {
  name: 'Scene',
  components: {
    tableDialog: () => import('./component/tableDialog.vue'),
    treeDialog: () => import('./component/treeDialog.vue'),
    menuDialog: () => import('./component/menuDialog.vue')
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
        sn: ''
      },
      table: {
        loading: false,
        data: [],
        size: 200,
        page: 1,
        total: 0,
        selection: [],
        categorySn: ''
      },
      tableDialog: {
        show: false,
        id: ''
      },
      treeDialog: {
        info: {},
        show: false
      },
      menuDialog: {
        rowId: '',
        checks: [],
        show: false
      }
    }
  },
  computed: {
    pageAndSize() {
      const { page, size } = this.table
      return { page, size }
    },
    columns() {
      return [
        { label: '名称', prop: 'name' },
        { label: '编码', prop: 'sn' },
        { label: '分类', prop: 'categoryName' },
        { label: '关联菜单', prop: 'resourceName' },
        {
          label: '状态', prop: 'status', formatter: value => (value ? '是' : '否')
        },
        {
          label: '操作',
          prop: undefined,
          headers: [
            { type: 'add', icon: 'el-icon-circle-plus' }
          ]
        }
      ]
    },
    tableTools() {
      return [
        {
          icon: 'el-icon-share',
          type: 'relation',
          title: '关联菜单'
        },
        {
          icon: 'el-icon-edit',
          type: 'design',
          title: '设计'
        },
        {
          icon: 'el-icon-edit-outline',
          type: 'update',
          title: '修改'
        },
        {
          icon: 'el-icon-delete-solid',
          type: 'del',
          title: '删除'
        }
      ]
    }
  },
  watch: {
    pageAndSize({ page, size }) {
      this.getPage({
        page,
        size,
        categorySn: this.tree.targetNode?.id || ''
      })
    }
  },
  created() {
    this.getTree()
    this.getPage({})
  },
  methods: {
    relationFolderTree(nodes) {
      const { rowId } = this.menuDialog
      if (rowId !== '') {
        const p = new FormData()
        p.append('resourceId', nodes || [])
        p.append('id', rowId)
        this.$api.mxGraph.relationFolder(p).then(s => {
          this.getPage({
            categorySn: this.tree.targetNode?.id || ''
          })
        }).catch(e => this.$message.error(e.message))
      }
    },
    setTargetNode(node) {
      this.tree.targetNode = { ...node }
      this.getPage({
        categorySn: node.id
      })
    },
    rightmenus(node) {
      const rm = [
        {
          label: '新增分类', icon: 'el-icon-circle-plus', type: 'add'
        },
        {
          label: '编辑分类', icon: 'el-icon-edit', type: 'update'
        },
        {
          label: '删除分类', icon: 'el-icon-delete', type: 'del'
        }
      ]
      return rm
    },
    rightmenusHandler(obj) {
      const { data, type, node } = obj
      const MET = {
        update: () => {
          this.$api.mxGraph.getTypeInfo({ idOrSn: data.id }).then(s => {
            this.treeDialog.info = s.data || {}
            this.treeDialog.show = true
          })
        },
        del: () => {
          this.$confirm('当前操作将会删除该分类，是否继续？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$api.mxGraph.delType({ idOrSn: data.id }).then(s => {
              const { parent } = node
              const children = parent.data.children || parent.data
              const index = children.findIndex(d => d.id === data.id)
              children.splice(index, 1)
              this.$message.success('删除成功！')
              if (data.id === this.tree.targetNode?.id) {
                this.getPage({})
                this.tree.targetNode = {}
              }
            }).catch(e => this.$message.error(e.message))
          }).catch(e => e)
        },
        add: () => {
          this.treeDialog.info = {}
          if (data) {
            this.treeDialog.info = {
              pid: data.id,
              pidName: data.label
            }
          }
          this.treeDialog.show = true
        }
      }
      MET[type]()
    },
    refreshTaregtNode(nodeId) {
      this.getTree([nodeId])
    },
    rowHeadersHandler(data) {
      this.tableDialog.id = ''
      this.tableDialog.show = true
    },
    tableToolsHandler(obj) {
      const { type, scope } = obj
      const MET = {
        relation: () => {
          this.menuDialog.rowId = scope.row.id
          this.menuDialog.checks = scope.row.resource?.split(',') || []
          this.menuDialog.show = true
        },
        design: () => {
          const path = {
            id: scope.row.id,
            name: scope.row.name
          }
          this.$router.push({ path: `/sceneDesign/${scope.row.id}/${scope.row.name} - 设计/edit` })
        },
        update: () => {
          this.tableDialog.id = scope.row.id
          this.tableDialog.show = true
        },
        del: () => {
          this.$confirm('当前操作将会删除该行数据，是否继续？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(s => {
            this.$api.mxGraph.removeScene({ id: scope.row.id }).then(() => {
              this.$message.success('删除成功！')
              this.getPage({
                categorySn: this.tree.targetNode?.id || ''
              })
            }).catch(e => this.$message.error(e.message))
          }).catch(e => e)
        }
      }
      MET[type]()
    },
    getPage({
      page, size, name = '', categorySn = ''
    }) {
      this.$api.mxGraph.getSceneTable({
        page: page || this.table.page,
        size: size || this.table.size,
        name,
        categorySn
      }).then(s => {
        this.table.data = s.data?.records || []
        this.table.total = s.data?.total || 0
      }).catch(e => this.$message.error(e.message))
    },
    getTree(expanded = []) {
      this.$api.mxGraph.getSceneTree().then(s => {
        this.tree.data = s.data || []
        this.tree.focusId = expanded
      }).catch(e => this.$message.error(e.message))
    },
    checkboxStatus(row) {
      console.log(row)
    },
    getTop() {
      this.middleDragTop = this.$refs.leftWorkbench.$el.offsetHeight / 2
    },
    move(x) {
      if (x < 300) x = 300
      else if (x > 800) x = 800
      this.width = x
    }
  }
}
</script>

<style lane="scss" scoped>

</style>
