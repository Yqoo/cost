<template>
  <div>
    <LeftWorkbench ref="leftWorkbench" :width="width" title="系统数据源">
      <el-button
        v-if="apis.includes('/datasource/saveCategory')"
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
        search
        :data="tree.data"
        :node-props="{
          children: 'children',
          label: 'label',
        }"
        :rightmenus="rightmenus"
        :default-expanded-keys="tree.focusId"
        :default-expand-all="tree.defaultExpandAll"
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
        module-name="DataSource"
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
        module-name="DataSource"
        :tools="tableTools"
        :multiple="true"
        :search="true"
        :cell-style="changeStyle"
        @toolshandler="tableToolsHandler"
        @refresh="refresh"
        @select="select"
        @search="search"
        @clo-checkbox-status="checkboxStatus"
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
    <!-- 新增系统数据源分类弹框 -->
    <class-comp
      v-if="classInfo.show"
      :show.sync="classInfo.show"
      :uid="classInfo.uid"
      @success="classSucSubmit"
    />
    <!-- 新增分类弹框 -->
    <category
      v-if="categoryInfo.show"
      :show.sync="categoryInfo.show"
      :uid="categoryInfo.uid"
      :sn="tree.sn"
      @success="categorySucSubmit"
    />
  </div>
</template>

<script>
export default {
  name: 'DataSource',
  components: {
    classComp: () => import('./dialog/class'),
    category: () => import('./dialog/category')
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
        sn: '',
        defaultExpandAll: true
      },
      linkIds: [],
      table: {
        loading: false,
        data: [],
        size: 200,
        page: 1,
        total: 0,
        selection: [],
        categorySn: ''
      },
      // 新增系统数据源左侧树
      classInfo: {
        show: false,
        uid: 'add'
      },
      // 新增系统数据源表格内容
      categoryInfo: {
        show: false,
        uid: 'add',
        updateData: {}
      }
    }
  },
  computed: {
    apis() {
      return this.$tools.getModuleAPIS('DataSource')
    },
    pageAndSize() { // 获取页数据
      const { page, size } = this.table
      return { page, size }
    },
    // 表格表头数据
    // el-icon-success
    // el-icon-error
    columns() {
      return [
        { label: '名称', prop: 'name' },
        { label: '编码', prop: 'sn' },
        { label: '数据源类型', prop: 'type' },
        { label: 'IP', prop: 'ip' },
        { label: '端口', prop: 'port' },
        { label: '数据库名称', prop: 'dbName' },
        { label: '状态', prop: 'disabled', switch: true },
        { label: '是否连接成功', prop: 'isPass' },
        { label: '操作', prop: undefined }
      ]
    },
    // toolsBar 按钮
    btns() {
      return [
        { method: 'add', name: '新增', api: '/datasource/save' },
        { method: 'update', name: '修改', api: '/datasource/save' },
        { method: 'del', name: '删除', api: '/datasource/delete' }
      ]
    },
    // table 操作栏（图标样式）
    tableTools() {
      return [
        {
          icon: 'el-icon-edit-outline',
          type: 'update',
          title: '修改',
          api: '/datasource/save'
        },
        {
          icon: 'el-icon-delete-solid',
          type: 'del',
          title: '删除',
          api: '/datasource/delete'
        }
      ]
    }
  },
  watch: {
    pageAndSize(obj) {
      this.getPage({
        page: obj.page,
        size: obj.size
      })
    },
    // eslint-disable-next-line object-shorthand
    'classInfo.show'(bool) {
      if (!bool) this.classInfo.uid = ''
    },
    // eslint-disable-next-line object-shorthand
    'categoryInfo.show'(bool) {
      if (!bool) this.categoryInfo.uid = ''
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
    changeStyle({
      row, column, rowIndex, columnIndex
    }) {
      if (row && row.isPass === '失败' && column.property === 'isPass') {
        return 'color: red' // 修改的样式
      }
      if (row && row.isPass === '成功' && column.property === 'isPass') {
        return 'color: green' // 修改的样式
      }
      return 'color: black'
    },
    // 通过行内信息测试
    linkByRow(val) {
      this.$api.dataSource.testByRow({
        type: val.type,
        url: val.url,
        username: val.username,
        password: val.password,
        ip: val.ip,
        port: val.port,
        dbName: val.dbName,
        params: val.params,
        isbk: val.isbk
      }).then(s => {
        val.isPass = '成功'
      }).catch(e => {
        val.isPass = '失败'
      })
    },
    getMsgFormSon(val) {
      this.categoryInfo.uid = val
      this.categoryInfo.show = true
      this.linkTest.show = false
    },
    refreshTable() {
      this.getPage({})
    },
    checkboxStatus(obj) {
      // console.log(obj)
      if (obj.disabled) {
        this.$api.dataSource
          .enableDS({
            id: obj.id
          })
          .then(s => {
            obj.disabled = true
            this.$message.success('修改成功！')
          })
          .catch(e => {
            if (obj.status) obj.status = false
            else obj.status = true
            this.$message.error(e.message)
          })
      } else {
        this.$api.dataSource
          .disableDS({
            id: obj.id
          })
          .then(s => {
            obj.disabled = false
            this.$message.success('修改成功！')
          })
          .catch(e => {
            if (obj.status) obj.status = false
            else obj.status = true
            this.$message.error(e.message)
          })
      }
    },
    // 添加辅助核算类
    addClass() {
      this.classInfo.uid = 'add'
      this.classInfo.show = true
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
      this.$api.dataSource
        .getSJYTree({ rootName: '系统数据源' })
        .then(s => {
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
            label: '编辑分类', icon: 'el-icon-edit', type: 'update', api: '/datasource/saveCategory'
          },
          {
            label: '删除分类', icon: 'el-icon-delete', type: 'del', api: '/datasource/deleteCategory'
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
          this.classInfo.show = true
        },
        update: () => {
          this.classInfo.uid = data.id
          this.classInfo.show = true
        },
        del: () => {
          this.$confirm(`当前操作将删除${data.label}，是否继续？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.$api.dataSource
                .delCategory({
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
    setTargetNode(node) {
      this.tree.targetNode = node
      if (node.type === 'root') {
        this.table.categorySn = ''
      } else {
        this.table.categorySn = node.id
      }
      this.getPage({})
    },
    getTop() {
      // 拖拽
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
          this.$api.dataSource
            .delDataSource({
              id: rows.join(',')
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
          this.categoryInfo.uid = scope.row.id
          this.categoryInfo.show = true
        },
        del: () => {
          this.delRows([scope.row.id])
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
      this.$api.dataSource
        .getSJYTable({
          page: page || this.table.page,
          size: size || this.table.size,
          categorySn: this.table.categorySn,
          s: query
        })
        .then(s => {
          const data = [...s.data.records]
          data.forEach(e => {
            e.disabled = !e.disabled
            e.isPass = '正在测试...'
          })
          // eslint-disable-next-line no-return-assign
          for (let i = 0; i < data.length; i++) {
            this.linkByRow(data[i])
          }
          this.table.total = s.data.total
          this.table.data = data
          this.table.loading = false
        })
        .catch(e => {
          this.table.loading = false
          this.$message.error(e.message)
        })
    },
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
          this.categoryInfo.show = true
          this.categoryInfo.uid = ''
        },
        update: () => {
          if (selection.length !== 1) this.$message.warning('请选择单条数据进行修改！')
          else {
            Object.assign(this.table.data, selection[0])
            this.categoryInfo.uid = selection[0].id
            // eslint-disable-next-line prefer-destructuring
            this.categoryInfo.updateData = selection[0]
            this.categoryInfo.show = true
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
    }
  }
}
</script>

<style lang="scss" scoped>
.btnColor {
  border-bottom: 1px solid #ddd;
}
</style>
