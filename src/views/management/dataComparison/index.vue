<template>
  <div>
    <LeftWorkbench ref="leftWorkbench" :width="width" title="数据比对">
      <el-button
        slot="addUnit"
        class="el-icon-plus"
        size="mini"
        type="text"
        title="新增分类"
        @click="rightmenusHandler({ type: 'add'})"
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
        module-name="DataComparison"
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
        module-name="DataComparison"
        :tools="tableTools"
        :multiple="true"
        :search="true"
        @toolshandler="tableToolsHandler"
        @search="tableSearch"
        @select="selectionChange"
        @refresh="() => getPage({})"
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

    <!-- 分类 -->
    <el-dialog
      v-if="classification.show"
      v-dialogDrag
      :modal="false"
      width="500px"
      :visible.sync="classification.show"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <div slot="title">
        {{ classification.form.id ? '编辑' : '新增' }}分类
      </div>
      <el-form
        ref="classForm"
        :model="classification.form"
        :rules="classification.rules"
        size="mini"
        label-width="50px"
      >
        <el-form-item label="编码" prop="sn">
          <el-input v-model="classification.form.sn" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="classification.form.name" />
        </el-form-item>
        <el-form-item label="上级" prop="pid">
          <el-popover
            width="450"
            trigger="click"
            placement="bottom-start"
          >
            <div style="padding: 10px;">
              <Tree
                :data="tree.data"
                in-box
                default-expand-all
                @setTargetNode="setPid"
              />
            </div>
            <el-input
              slot="reference"
              v-model="classification.form.pidName"
              clearable
              readonly
            />
          </el-popover>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="info" size="mini" @click="classification.show = false">
          关闭
        </el-button>
        <el-button type="primary" size="mini" @click="saveClassIfic">
          确定
        </el-button>
      </div>
    </el-dialog>

    <Form
      v-if="form.show"
      :id="form.id"
      :show.sync="form.show"
      :tree="{ data: tree.data, targetNode: tree.targetNode }"
      @refresh="refreshTable"
    />
    <Tables
      v-if="tables.show"
      :show.sync="tables.show"
      :title="tables.title"
      :sn="tables.sn"
      :datas="tables.datas"
    />
  </div>
</template>

<script>
/* eslint-disable func-names */

export default {
  name: 'DataComparison',
  components: {
    Form: () => import('./components/form'),
    Tables: () => import('./components/tables')
  },
  data() {
    return {
      width: 300,
      middleDragTop: this.width,
      tree: {
        loading: false,
        data: [],
        focusId: [],
        targetNode: {}
      },
      table: {
        loading: false,
        data: [],
        size: 200,
        page: 1,
        total: 0,
        selection: []
      },
      classification: {
        show: false,
        form: {
          sn: '',
          name: '',
          pid: '',
          pidName: ''
        },
        rules: {
          sn: [{ required: true, message: '必填', trigger: 'blur' }],
          name: [{ required: true, message: '必填', trigger: 'blur' }],
          pid: [{ required: true, message: '必填', trigger: 'change' }]
        }
      },
      form: {
        show: false,
        id: ''
      },
      tables: {
        show: false,
        title: '',
        sn: '',
        datas: {}
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
        { label: '主数据配置', prop: 'mainSql' },
        { label: '目标数据配置', prop: 'targetSql' },
        { label: '比对规则', prop: 'compareRule' },
        { label: '修正规则', prop: 'correctionRule' },
        { label: '操作', prop: undefined }
      ]
    },
    tableTools() {
      return [
        {
          icon: 'el-icon-edit-outline',
          type: 'update',
          title: '修改'
        },
        {
          icon: 'el-icon-delete-solid',
          type: 'del',
          title: '删除'
        },
        {
          icon: 'el-icon-s-check',
          type: 'check',
          title: '比对'
        }
      ]
    },
    btns() {
      return [
        { method: 'add', name: '新增' },
        { method: 'del', name: '删除' }
      ]
    }
  },
  watch: {
    'form.show': function (val) {
      val || (this.form.id = '')
    },
    'classification.show': function (val) {
      if (!val) {
        this.classification.form = {
          sn: '',
          name: '',
          pid: '',
          pidName: ''
        }
      }
    },
    pageAndSize({ page, size }) {
      this.getPage({
        page,
        size
      })
    }
  },
  created() {
    this.getTree()
    this.getPage({})
  },
  methods: {
    tableSearch(str) {
      this.getPage({ query: str })
    },
    tableToolsHandler(obj) {
      const { type, scope } = obj
      const METHODS = {
        update: () => {
          this.form.id = scope.row.id
          this.form.show = true
        },
        del: () => {
          this.delRows([scope.row.sn])
        },
        check: () => {
          this.$api.dataComparison.getComparisonDatas({
            sn: scope.row.sn
          }).then(s => {
            this.tables.title = scope.row.name
            this.tables.sn = scope.row.sn
            this.tables.show = true
            this.tables.datas = s.data || {}
          }).catch(e => this.$mesage.error(e.message))
        }
      }
      METHODS[type]()
    },
    btnsHandler(type) {
      const METHODS = {
        add: () => {
          this.form.show = true
        },
        del: () => {
          const sns = this.table.selection.map(s => s.sn)
          sns.length && this.delRows(sns)
        }
      }
      METHODS[type]()
    },
    delRows(sn = []) {
      this.$confirm('确认删除当前数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.dataComparison.delComparison({
          sn: sn.join(',')
        }).then(s => {
          this.$refs.table.clearSelection()
          this.getPage({
            csn: this.tree.targetNode.id || 0
          })
          this.$message.success('删除成功！')
        }).catch(e => this.$message.error(e.message))
      }).catch(e => e)
    },
    refreshTable(id) {
      this.getPage({
        csn: id || 0
      })
    },
    saveClassIfic() {
      this.$refs.classForm.validate(valid => {
        if (valid) {
          const p = { ...this.classification.form }
          this.$api.dataComparison[p.id ? 'updateCategory' : 'addCategory'](p).then(s => {
            this.getTree()
            this.tree.focusId = [s.data || '']
            this.$message.success('保存成功！')
            this.classification.show = false
          }).catch(e => this.$message.error(e.message))
        }
      })
    },
    setPid(node) {
      this.classification.form.pid = node.id
      this.classification.form.pidName = node.label
    },
    selectionChange(selections) {
      this.table.selection = selections
    },
    rightmenus(node) {
      const rm = [
        {
          label: '编辑分类', icon: 'el-icon-edit', type: 'update'
        },
        {
          label: '删除分类', icon: 'el-icon-delete', type: 'del'
        }
      ]
      return node.pid === 'root' ? [] : rm
    },
    rightmenusHandler(obj) {
      const { data, type } = obj
      const METHODS = {
        add: () => {
          this.classification.show = true
        },
        update: () => {
          this.$api.dataComparison.categoryInfo({
            id: data.id
          }).then(s => {
            this.classification.form = {
              id: s.data.id,
              name: s.data.name,
              sn: s.data.sn,
              pid: s.data.pid,
              pidName: s.data.pname
            }
            this.classification.show = true
          }).catch(e => this.$message.error(e.message))
        },
        del: () => {
          this.$confirm('确认删除当前树节点？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$api.dataComparison.delCategory({
              id: data.id
            }).then(s => {
              this.getTree()
              this.$message.success('删除成功！')
            })
          }).catch(e => e)
        }
      }
      METHODS[type]()
    },
    getPage({
      page, size, csn = 0, query = ''
    }) {
      this.table.loading = true
      this.$api.dataComparison.getTableData({
        page: page || this.table.page,
        size: size || this.table.size,
        csn,
        query
      }).then(s => {
        this.table.data = s.data?.records || []
        this.table.total = s.data?.total || 0
        this.table.loading = false
      }).catch(e => {
        this.$message.error(e.message)
        this.table.loading = false
      })
    },
    setTargetNode(node) {
      this.tree.targetNode = { ...node }
      this.getPage({
        csn: node.id
      })
    },
    getTree() {
      this.tree.loading = true
      this.$api.dataComparison.getLeftTree().then(s => {
        this.tree.data = s.data || []
        this.tree.loading = false
      }).catch(e => {
        this.tree.loading = false
        this.$message.error(e.message)
      })
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

<style lang="scss" scoped>

</style>
