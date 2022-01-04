<template>
  <div>
    <LeftWorkbench ref="leftWorkbench" :width="width" title="映射方案">
      <el-button
        v-if="api.includes('/dataMapScheme/save')"
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
        module-name="DataMap"
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
        module-name="DataMap"
        :tools="tableTools"
        :multiple="true"
        :search="true"
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
    <!-- 方案分类弹框 -->
    <item-class
      v-if="itemClassInfo.show"
      :id="itemClassInfo.id"
      :show.sync="itemClassInfo.show"
      @success="classSucSubmit"
    />
    <!-- 映射方案弹框 -->
    <edition-item
      v-if="editionItemInfo.show"
      :id="editionItemInfo.id"
      :sn="editionItemInfo.sn"
      :show.sync="editionItemInfo.show"
      @success="classSucSubmit"
    />
  </div>
</template>

<script>
export default {
  name: 'DataMap',
  components: {
    itemClass: () => import('./dialog/itemClass'),
    editionItem: () => import('./dialog/editionItem')
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
      // 新增方案分类左侧树
      itemClassInfo: {
        show: false,
        id: ''
      },
      // 新增映射方案表格
      editionItemInfo: {
        show: false,
        id: '',
        sn: ''
      }
    }
  },
  computed: {
    api() {
      return this.$tools.getModuleAPIS('DataMap')
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
        { label: '来源档案', prop: 'sourceDossierName' },
        { label: '目标档案', prop: 'targetDossierName' },
        {
          label: '启用状态', prop: 'status', switch: true
        },
        { label: '操作', prop: undefined }
      ]
    },
    // toolsBar 按钮
    btns() {
      return [
        { method: 'add', name: '新增', api: '/dataMapScheme/save' },
        { method: 'update', name: '修改', api: '/dataMapScheme/save' },
        { method: 'del', name: '删除', api: '/dataMapScheme/remove' }
      ]
    },
    // table 操作栏（图标样式）
    tableTools() {
      return [
        {
          icon: 'el-icon-edit-outline',
          type: 'update',
          title: '修改',
          api: '/dataMapScheme/save'
        },
        {
          icon: 'el-icon-video-camera',
          type: 'toMapManage',
          title: '映射管理'
        },
        {
          icon: 'el-icon-delete-solid',
          type: 'del',
          title: '删除',
          api: '/dataMapScheme/remove'
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
    'itemClassInfo.show'(bool) {
      if (!bool) this.itemClassInfo.id = ''
    },
    // eslint-disable-next-line object-shorthand
    'editionItemInfo.show'(bool) {
      if (!bool) this.editionItemInfo.id = ''
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
    refreshTable() {
      this.getPage({})
    },
    // 添加左侧分类
    addClass() {
      this.itemClassInfo.id = ''
      this.itemClassInfo.show = true
    },
    classSucSubmit(id) {
      this.getTree([id])
      this.refreshTable()
    },
    // 获取左侧树结构
    getTree(expand = []) {
      this.tree.loading = true
      this.$api.dataMap
        .getYSFATree({ rootName: '映射方案' })
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
            label: '编辑分类', icon: 'el-icon-edit', type: 'update', api: '/dataMapScheme/save'
          },
          {
            label: '删除分类', icon: 'el-icon-delete', type: 'del', api: '/dataMapScheme/remove'
          }
        ]
      }
      const { type } = node
      return (rm[type] || []).filter(n => this.api.includes(n.api))
    },
    // 左侧树的删除，修改
    rightmenusHandler(obj) {
      // tree 右键事件
      const { data, type } = obj
      const METHODS = {
        add: () => {
          this.itemClassInfo.show = true
        },
        update: () => {
          this.itemClassInfo.id = data.id
          this.itemClassInfo.show = true
        },
        del: () => {
          this.$confirm(`当前操作将删除${data.label}，是否继续？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.$api.dataMap
                .delYSFATree({
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
        this.editionItemInfo.sn = node.id
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
    checkboxStatus(obj) {
      this.$api.dataMap
        .saveYSFATable({
          ...obj
        })
        .then(s => {
          this.$message.success('修改成功！')
        })
        .catch(e => {
          this.$message.error(e.message)
        })
    },
    // 删除行
    delRows(rows = [], force = false) {
      this.$confirm('当前操作将删除所选数据，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$api.dataMap
            .delYSFATable({
              ids: rows.join(','),
              force
            })
            .then(s => {
              this.getPage({})
              this.$refs.table.clearSelection()
              this.$message.success('删除成功！')
            })
            .catch(e => {
              if (!force) {
                this.$confirm(e.message, '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.delRows(rows, true)
                  this.getPage({})
                  this.$refs.table.clearSelection()
                  this.table.selection = []
                }).catch(ex => ex)
              } else {
                this.$message.error(e.message)
              }
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
          this.editionItemInfo.id = scope.row.id
          this.editionItemInfo.show = true
        },
        del: () => {
          this.delRows([scope.row.id], false)
        },
        toMapManage: () => {
          this.$router.push({
            path: `/dataMapManage/${scope.row.sn}`
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
      this.$api.dataMap.getYSFAData({
        page: page || this.table.page,
        size: size || this.table.size,
        categorySn: this.table.categorySn,
        s: query
      })
        .then(s => {
          const data = [...s.data.records]
          data.forEach(e => {
            e.sourceDossierName = `${e.sourceDossier} ${e.sourceDossierName}`
            e.targetDossierName = `${e.targetDossier} ${e.targetDossierName}`
          })
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
          this.editionItemInfo.show = true
          this.editionItemInfo.id = ''
        },
        update: () => {
          if (selection.length !== 1) this.$message.warning('请选择单条数据进行修改！')
          else {
            Object.assign(this.table.data, selection[0])
            this.editionItemInfo.id = selection[0].id
            // eslint-disable-next-line prefer-destructuring
            this.editionItemInfo.updateData = selection[0]
            this.editionItemInfo.show = true
          }
        },
        del: () => {
          if (selection.length === 0) this.$message.warning('至少选择一行数据进行删除！')
          else {
            this.delRows(selection.map(s => s.id), false)
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
