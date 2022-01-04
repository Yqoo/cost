<template>
  <div>
    <LeftWorkbench ref="leftWorkbench" :width="width" title="数据算法">
      <el-button
        v-if="apis.includes('/category/KETTLE/save')"
        slot="addUnit"
        class="el-icon-plus"
        size="mini"
        type="text"
        @click="addClass"
      />
      <Tree
        slot="tree"
        ref="tree"
        v-waiting="tree.loading"
        :default-expand-all="tree.defaultExpandAll"
        search
        :data="tree.data"
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
      <ToolsBar
        slot="toolsBar"
        class="btnColor"
        module-name="Kettle"
        :items="btns"
        @btnsHandler="btnsHandler"
      />
      <Table
        ref="table"
        slot="table"
        v-waiting="table.loading"
        number
        :data="table.data"
        :columns="columns"
        module-name="Kettle"
        :tools="tableTools"
        :multiple="true"
        :search="true"
        @toolshandler="tableToolsHandler"
        @refresh="refresh"
        @select="select"
        @search="search"
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
    <!-- 新增数据分类弹框 -->
    <data-category
      v-if="categoryInfo.show"
      :id="categoryInfo.id"
      :show.sync="categoryInfo.show"
      @success="classSucSubmit"
    />
    <!-- 新增分类弹框 -->
    <data-change
      v-if="changeInfo.show"
      :id="changeInfo.id"
      :show.sync="changeInfo.show"
      :sn="tree.sn"
      @success="categorySucSubmit"
    />
    <!-- 历史记录弹框 -->
    <history
      v-if="historyInfo.show"
      :id="historyInfo.id"
      :show.sync="historyInfo.show"
      :sn="tree.sn"
      @success="categorySucSubmit"
    />
    <!-- 运行转换提示弹框 -->
    <PromptBox
      v-if="runInfo.show"
      :id="runInfo.id"
      :show.sync="runInfo.show"
      :title-name="runInfo.titleName"
      :status="runInfo.status"
      :err-msg="runInfo.errMsg"
      @send="serve"
    />
    <!-- 详细信息弹框 -->
    <detail
      v-if="detailInfo.show"
      :id="detailInfo.id"
      :show.sync="detailInfo.show"
    />
  </div>
</template>

<script>
export default {
  name: 'Kettle',
  components: {
    dataCategory: () => import('./dialog/dataCategory'),
    dataChange: () => import('./dialog/dataChange'),
    history: () => import('./dialog/history'),
    detail: () => import('./dialog/detail')
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
        defaultExpandAll: true,
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
      // 新增数据分类左侧树
      categoryInfo: {
        show: false,
        id: ''
      },
      // 新增数据算法表格内容
      changeInfo: {
        show: false,
        id: '',
        updateData: {}
      },
      // 历史记录信息
      historyInfo: {
        show: false,
        id: ''
      },
      // 运行转换信息弹框
      runInfo: {
        show: false,
        id: '',
        titleName: '',
        status: '',
        errMsg: ''
      },
      // 详细信息
      detailInfo: {
        show: false,
        id: ''
      }
    }
  },
  computed: {
    apis() {
      return this.$tools.getModuleAPIS('Kettle')
    },
    pageAndSize() { // 获取页数据
      const { page, size } = this.table
      return { page, size }
    },
    // 表格表头数据
    columns() {
      return [
        { label: '名称', prop: 'name' },
        { label: '编码', prop: 'sn' },
        { label: '自动执行', prop: 'autoExecute' },
        // { label: '执行时机', prop: 'executeCron' },
        { label: '创建人', prop: 'createUserName' },
        { label: '操作', prop: undefined }
      ]
    },
    // toolsBar 按钮
    btns() {
      return [
        { method: 'add', name: '新增', api: '/kettle/save' },
        { method: 'update', name: '修改', api: '/kettle/save' },
        { method: 'del', name: '删除', api: '/kettle/remove' }
      ]
    },
    // table 操作栏（图标样式）
    tableTools() {
      return [
        {
          icon: 'el-icon-edit-outline',
          type: 'update',
          title: '修改',
          api: '/kettle/save'
        },
        {
          icon: 'el-icon-delete-solid',
          type: 'del',
          title: '删除',
          api: '/kettle/remove'
        },
        {
          icon: 'el-icon-video-play',
          type: 'run',
          title: '立即执行',
          api: '/kettle/run'
        },
        {
          icon: 'el-icon-time',
          type: 'history',
          title: '历史记录',
          api: '/kettle/findRecord'
        },
        {
          icon: 'el-icon-edit',
          type: 'design',
          title: '设计',
          api: '/kettle/saveXml'
        }
      ]
    }
  },
  watch: {
    pageAndSize({ page, size }) {
      this.getPage({
        page,
        size
      })
    },
    // eslint-disable-next-line object-shorthand
    'categoryInfo.show'(bool) {
      if (!bool) this.categoryInfo.id = ''
    },
    // eslint-disable-next-line object-shorthand
    'changeInfo.show'(bool) {
      if (!bool) this.changeInfo.id = ''
    },
    // eslint-disable-next-line object-shorthand
    'tree.targetNode'(val) {
      if (val) {
        this.tree.sn = val.id
      }
    }
  },
  created() {
    this.getTree()
    this.getPage({})
  },
  methods: {
    serve(val) {
      this.runInfo.show = false
      this.detailInfo.show = true
    },
    refreshTable() {
      this.getPage({})
    },
    // 添加数据分类
    addClass() {
      this.categoryInfo.id = ''
      this.categoryInfo.show = true
    },
    classSucSubmit(id) {
      this.getTree([id])
    },
    categorySucSubmit() {
      this.getPage({})
    },
    // 获取数据源左侧树结构
    getTree(expand = []) {
      this.tree.loading = true
      this.$api.kettle
        .getSJZHTree({ rootName: '数据分类' })
        .then(s => {
          // console.log(s)
          this.tree.data = Array.isArray(s.data) ? [...s.data] : [s.data]
          this.tree.focusId = expand
          this.tree.loading = false
        })
        .catch(e => {
          this.tree.loading = false
          this.$message.error(e.message)
        })
    },
    // 左侧树的修改删除图标
    rightmenus(node) {
      const rm = {
        category: [
          {
            label: '编辑分类', icon: 'el-icon-edit', type: 'update', api: '/category/KETTLE/save'
          },
          {
            label: '删除分类', icon: 'el-icon-delete', type: 'del', api: '/category/KETTLE/delete'
          }
        ]
      }
      const { type } = node
      return (rm[type] || []).filter(r => this.apis.includes(r.api))
    },
    // 左侧树的删除，修改
    rightmenusHandler(obj) {
      // tree 右键事件
      const { data, type } = obj
      const METHODS = {
        add: () => {
          this.categoryInfo.show = true
        },
        update: () => {
          this.categoryInfo.id = data.id
          this.categoryInfo.show = true
        },
        del: () => {
          this.$confirm(`当前操作将删除${data.label}，是否继续？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.$api.kettle
                .delSJZHTree({
                  idOrSn: data.id
                })
                .then(s => {
                  this.$refs.tree.remove(data)
                  this.getPage({})
                })
                .catch(e => this.$message.error(e.message))
            })
            .catch(e => e)
        }
      }
      METHODS[type]()
    },
    // 左侧树选中，右侧表格显示对应内容
    setTargetNode(node) {
      this.tree.targetNode = node
      if (node.type === 'root') {
        this.table.categorySn = ''
      } else {
        this.table.categorySn = node.id
      }
      this.getPage({})
    },
    // 拖拽
    getTop() {
      this.middleDragTop = this.$refs.leftWorkbench.$el.offsetHeight / 2
    },
    // 选中checkBox 事件
    select(obj) {
      this.table.selection = [...obj]
    },
    // 拓宽左侧树区域宽度
    move(x) {
      // 移动
      if (x < 300) x = 300
      else if (x > 800) x = 800
      this.width = x
    },
    // 删除行
    delRows(rows = []) {
      this.$confirm('当前操作将删除所选数据，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$api.kettle
            .deleteById({
              ids: rows.join(',')
            })
            .then(s => {
              this.getPage({})
              this.$refs.table.clearSelection()
              this.$message.success('删除成功！')
            })
            .catch(e => {
              this.$message.error(e.message)
              this.getPage({})
              this.$refs.table.clearSelection()
              this.table.selection = []
            })
        })
        .catch(e => e)
    },
    // table 操作栏事件
    tableToolsHandler(obj) {
      const { type, scope } = obj
      const METHODS = {
        update: () => {
          // Object.assign(this.table.data, scope.row)
          this.changeInfo.id = scope.row.id
          this.changeInfo.show = true
        },
        del: () => {
          this.delRows([scope.row.id])
        },
        run: () => {
          this.runInfo.titleName = '运行转换'
          this.runChange(scope.row.id)
        },
        history: () => {
          this.historyInfo.show = true
          this.historyInfo.id = scope.row.id
        },
        design: () => {
          this.$router.push({
            path: `/mxGraph/${scope.row.id}`
          })
        }

      }
      METHODS[type]()
    },
    // eslint-disable-next-line object-curly-newline
    // 获取页码及右侧表格数据
    getPage({
      query = '', size, page
    }) {
      this.table.loading = true
      this.$api.kettle.getSJZHData({
        versionManage: false,
        page: page || this.table.page,
        size: size || this.table.size,
        categorySn: this.table.categorySn,
        s: query,
        sn: ''
      })
        .then(s => {
          const data = [...s.data.records]
          // console.log(data)
          data.forEach(e => { e.autoExecute ? e.autoExecute = '是' : e.autoExecute = '否' })
          this.table.data = data
          this.table.total = s.data.total
          this.table.loading = false
        })
        .catch(e => {
          this.table.loading = false
          this.$message.error(e.message)
        })
    },
    // 表格搜索框
    search(query) {
      this.getPage({
        query
      })
    },
    refresh() {
      this.getPage({})
    },
    // toolsBar 点击事件(按钮)
    btnsHandler(type) {
      const { selection } = this.table
      const METHODS = {
        add: () => {
          this.changeInfo.show = true
          this.changeInfo.id = ''
        },
        update: () => {
          if (selection.length !== 1) this.$message.warning('请选择单条数据进行修改！')
          else {
            Object.assign(this.table.data, selection[0])
            this.changeInfo.id = selection[0].id
            // eslint-disable-next-line prefer-destructuring
            this.changeInfo.updateData = selection[0]
            this.changeInfo.show = true
            // console.log(selection[0])
          }
        },
        del: () => {
          if (selection.length === 0) this.$message.warning('至少选择一行数据进行删除！')
          else {
            this.delRows(selection.map(s => s.id))
          }
        }
      }
      METHODS[type]()
    },
    // 运行转换
    runChange(val) {
      this.runInfo.status = ''
      this.runInfo.show = true
      this.$api.kettle.runChange({ id: val }).then(s => {
        this.detailInfo.id = s.data
        this.loading = false
        this.runInfo.id = s.data
        this.runInfo.status = 'success'
      }).catch(e => {
        this.runInfo.id = e.data
        this.runInfo.status = 'fail'
        this.runInfo.errMsg = e.message
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.btnColor {
  border-bottom: 1px solid #ddd;
}
</style>
