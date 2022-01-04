<template>
  <div class="managentTable">
    <LeftWorkbench ref="leftWorkbench" :width="width">
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
        @setTargetNode="setTargetNode"
      />
    </LeftWorkbench>
    <MiddleDrag :margin-top="middleDragTop" @hook:mounted="getTop" @move="move" />
    <RightWorkbench :margin-left="width">
      <ToolsBar
        slot="toolsBar"
        class="btnColor"
        :module-name="targetTabInfo.from === 'treatment' ? 'Business' : 'SysBusiness'"
        :items="btns"
        style="border-bottom: 1px solid #ddd"
        @btnsHandler="btnsHandler"
      />
      <Table
        ref="table"
        slot="table"
        v-waiting="table.loading"
        number
        multiple
        :data="table.data"
        :columns="columns"
        :search="false"
        :surplus-height="70"
        :module-name="targetTabInfo.from === 'treatment' ? 'Business' : 'SysBusiness'"
        :tools="tableTools"
        @toolshandler="tableToolsHandler"
        @select="selectRows"
      />
      <Pagination
        slot="page"
        class="pagination"
        :amount="table.total"
        :page-size="table.size"
        :current-page="table.page"
        @handleSizeChange="val => table.size = val"
        @handleCurrentChange="val => table.page = val"
      />
    </RightWorkbench>
    <Form
      v-if="form.show"
      :show.sync="form.show"
      :meta="{
        outer: targetTabInfo.from || 'system',
        inner: 'dossier'
      }"
      :td="tree.data"
      :business-id="activeTableId"
      :status="form.status"
      :ztsn="targetTabInfo.ztsn"
      @refresh="refreshPage"
    />
  </div>
</template>

<script>

export default {
  name: 'ManagementTable',
  components: {
    Form: () => import('./dialog/form')
  },
  data() {
    return {
      width: 300,
      middleDragTop: this.width,
      targetTabInfo: null,
      tree: {
        loading: false,
        data: [],
        focusId: [],
        targetNode: null
      },
      table: {
        loading: false,
        data: [],
        page: 1,
        size: 200,
        total: 0,
        selection: []
      },
      form: {
        show: false,
        status: 'add'
      },
      activeTableId: ''
    }
  },
  computed: {
    btns() {
      return [
        {
          method: 'add', name: '新增', icon: 'el-icon-circle-plus', api: '/businessTab/add'
        },
        {
          method: 'update', name: '编辑', icon: 'el-icon-edit-outline', api: '/businessTab/update'
        },
        {
          method: 'del', name: '删除', icon: 'el-icon-delete', api: '/businessTab/delete'
        }
      ]
    },
    columns() {
      return [
        { label: '编码', prop: 'sn' },
        { label: '名称', prop: 'name' },
        { label: '数据表', prop: 'tab' },
        { label: '上级表', prop: 'pname' },
        { label: '业务', prop: 'businessName' },
        { lable: '操作', prop: undefined }
      ]
    },
    tableTools() {
      return [
        {
          icon: 'el-icon-edit-outline',
          type: 'update',
          title: '编辑',
          api: '/businessTab/update'
        },
        {
          icon: 'el-icon-delete',
          type: 'del',
          title: '删除',
          api: '/businessTab/delete'
        }
      ]
    },
    pageAndSize() {
      const { page, size } = this.table
      return { page, size }
    }
  },
  watch: {
    pageAndSize(obj) {
      const type = this.tree.targetNode && this.tree.targetNode.type
      const id = this.tree.targetNode && this.tree.targetNode.id
      this.getPage({
        page: obj.page,
        size: obj.size,
        type: type || 'business',
        id: id || this.targetTabInfo.id
      })
    },
    // eslint-disable-next-line object-shorthand
    'form.show'(bool) {
      if (!bool) this.form.status = 'add'
    }
  },
  beforeRouteEnter(to, from, next) {
    if (to.params.param) {
      const p = JSON.parse(decodeURIComponent(to.params.param))
      to.meta.title = p.name
      next()
    }
    next()
  },
  created() {
    const { param } = this.$route.params
    const p = JSON.parse(decodeURIComponent(param))
    this.targetTabInfo = JSON.parse(JSON.stringify(p))
    this.activeTableId = this.targetTabInfo.id
    this.getInfo(p.id)
  },
  methods: {
    getInfo(id) {
      if (id) {
        const info = this.targetTabInfo
        this.getTree(info.id)
        this.getPage({ id: info.id })
      }
    },
    getTree(expand = []) {
      this.tree.loading = true
      this.$api.business.getGlbLeftTree({
        businessId: this.activeTableId,
        ztsn: this.targetTabInfo.from === 'treatment' ? this.targetTabInfo.ztsn : ''
      }).then(s => {
        this.tree.data = [s.data]
        this.tree.focusId = [...expand]
        this.tree.loading = false
      }).catch(e => {
        this.tree.loading = false
        this.$message.error(e.message)
      })
    },
    // eslint-disable-next-line object-curly-newline
    getPage({ page, size, type = 'business', id = '' }) {
      this.table.loading = true
      this.$api.business.getGlbTable({
        page: this.table.page,
        size: this.table.size,
        type,
        id,
        ztsn: this.targetTabInfo.from === 'treatment' ? this.targetTabInfo.ztsn : ''
      }).then(s => {
        this.table.data = [...s.data.records]
        this.table.total = s.data.total
        this.table.loading = false
      }).catch(e => {
        this.table.loading = false
        this.$message.error(e.message)
      })
    },
    refreshPage(id) {
      this.getPage({ id, type: 'tab' })
      this.getTree([id])
    },
    btnsHandler(type) {
      const METHODS = {
        add: () => {
          this.form.show = true
        },
        update: () => {
          const { selection } = this.table
          if (selection.length !== 1) this.$message.warning('请选择一行数据进行编辑！')
          else {
            this.form.status = selection[0].id
            this.form.show = true
          }
        },
        del: () => {
          const { selection } = this.table
          if (selection.length === 0) this.$message.warning('请选择要删除的数据！')
          else {
            this.delRows(selection)
          }
        }
      }
      METHODS[type]()
    },
    tableToolsHandler(obj) {
      const { type, scope } = obj
      const METHODS = {
        update: () => {
          this.form.status = scope.row.id
          this.form.show = true
        },
        del: () => {
          this.$confirm('当前操作将会删除所选数据，是否继续？', '删除', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.delRows([scope.row])
          }).catch(e => this.$message.error(e.message))
        }
      }
      METHODS[type]()
    },
    delRows(rows) {
      const ids = rows.map(row => row.id)
      this.$api.business.delGlb({
        ids: ids.join(',')
      }).then(s => {
        const type = this.tree.targetNode && this.tree.targetNode.type
        const id = this.tree.targetNode && this.tree.targetNode.id
        this.getPage({
          page: this.table.page,
          size: this.table.size,
          type: type || 'business',
          id: id || ''
        })
        this.getTree([id || ''])
        this.$refs.table.forEach(table => table.clearSelection())
        this.$message.success('删除成功！')
      }).catch(e => this.$message.error(e.message))
    },
    selectRows(rows) {
      this.table.selection = [...rows]
    },
    setTargetNode(node) {
      this.tree.targetNode = node
      this.getPage({
        type: node.type,
        id: node.id
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

<style lang="scss" scoped>
.managentTable {
    position: relative;
    height: calc(100vh - 130px)
  }
  .tips {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #4390de;
  }
  .content {
    height: calc(100vh - 160px);
    .el-col {
      height: 100%;
    }
  }
</style>
