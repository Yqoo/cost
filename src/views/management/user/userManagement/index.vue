<template>
  <div class="user-managerment">
    <LeftWorkbench ref="leftWorkbench" :width="width">
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
        :default-expanded-keys="tree.focusId"
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
        module-name="UserManagement"
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
        module-name="UserManagement"
        :tools="tableTools"
        number
        multiple
        @search="search"
        @toolshandler="tableRowHandler"
        @select="(selection) => (table.selection = selection)"
        @refresh="refresh"
        @clo-checkbox-status="rowCheckboxChange"
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
    <Operator
      :show.sync="operator.show"
      :tree="operator.tree"
      :status="operator.status"
      :update-id="operator.id"
      :node-val="nodeVal"
      @refresh="(val) => getPage({ unit_sn: val })"
    />
    <Staff :show.sync="staffshow" />
    <el-dialog
      v-dialogDrag
      :visible.sync="role.show"
      :modal="false"
      width="500px"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <div slot="title">
        {{ role.type === "fn" ? "功能" : "数据" }}角色
      </div>
      <Tree
        v-if="role.type === 'fn'"
        search
        check-box
        :data="role.data"
        :node-props="{
          children: 'children',
          label: 'label',
        }"
        :default-checked-keys="role.checkeds"
        @check="checkFn"
      />
      <el-table
        v-else
        :data="role.data"
        size="mini"
        style="width: 100%"
        @selection-change="roleSelection"
      >
        <el-table-column type="selection" />
        <el-table-column label="编码" prop="sn" />
        <el-table-column label="名称" prop="name" show-overflow-tooltip />
        <el-table-column
          label="描述"
          prop="instructions"
          show-overflow-tooltip
        />
      </el-table>
      <div slot="footer">
        <el-button type="info" size="mini" @click="closeRoleDialog">
          取消
        </el-button>
        <el-button type="primary" size="mini" @click="confirmRole">
          确定
        </el-button>
      </div>
    </el-dialog>
    <Upload
      v-if="upload.show"
      :show.sync="upload.show"
      :action="upload.action"
      :format="['xls', 'xlsx', 'xml']"
      :params="upload.params"
      @success="uploadSuccess"
    />
  </div>
</template>

<script>
import Operator from './dialog/operator'
import Staff from './dialog/staff'

export default {
  name: 'UserManagement',
  components: {
    Operator,
    Staff
  },
  data() {
    return {
      nodeVal: {},
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
        page: 1,
        size: 200,
        total: 0,
        selection: []
      },
      operator: {
        show: false,
        tree: [],
        status: 'add',
        id: ''
      },
      staffshow: false,
      role: {
        show: false,
        type: 'fn', // 功能 or 数据
        data: [],
        checkeds: []
      },
      upload: {
        show: false,
        action: '',
        params: {}
      }
    }
  },
  computed: {
    changePage() {
      const { size, page } = this.table
      return { size, page }
    },
    btns() {
      // toolsBar 按钮
      return [
        {
          method: 'add',
          name: '新增',
          icon: 'el-icon-circle-plus-outline',
          api: '/user/add'
        },
        {
          method: 'del', name: '删除', icon: 'el-icon-delete', api: '/user/delete'
        },
        /* {
          method: 'imp',
          name: '引入职员',
          icon: 'el-icon-finished'
        }, */
        {
          method: 'fn', name: '功能角色', icon: 'el-icon-user-solid', api: '/user/updateUserRole'
        },
        {
          method: 'meta', name: '数据角色', icon: 'el-icon-user', api: '/user/updateUserDataRole'
        },
        { method: 'import', name: '导入', api: '/userReportAndImportController/importFile' },
        { method: 'educe', name: '导出', api: '/userReportAndImportController/export' }
      ]
    },
    columns() {
      return [
        { label: '名称', prop: 'name' },
        { label: '操作员编码', prop: 'sn' },
        { label: '所属单位', prop: 'unit_name' },
        { label: '外部代码', prop: 'out_sn' },
        { label: '角色', prop: 'roles' },
        { label: '操作员说明', prop: 'desc_' },
        {
          label: '状态',
          prop: 'status',
          width: 120,
          switch: true,
          activeText: '启',
          inactiveText: '停'
        },
        { label: '操作', prop: undefined }
      ]
    },
    tableTools() {
      return [
        {
          icon: 'el-icon-edit-outline', title: '编辑', type: 'edit', api: '/user/update'
        },
        {
          icon: 'el-icon-delete', title: '删除', type: 'del', api: '/user/delete'
        }
      ]
    }
  },
  watch: {
    changePage(obj) {
      this.getPage({
        size: obj.size,
        page: obj.page,
        unit_sn: this.tree.targetNode.id || ''
      })
    }
  },
  created() {
    this.getTree()
    this.getPage({})
  },
  methods: {
    closeRoleDialog() {
      this.role.show = false
      this.role.data = []
      this.role.checkeds = []
    },
    roleSelection(selection) {
      this.role.checkeds = selection.map(s => s.id)
    },
    confirmRole() {
      const { type, checkeds } = this.role
      const { selection } = this.table
      const ids = selection.map(s => s.id)
      if (checkeds.length) {
        this.$api.user[type === 'fn' ? 'setFnRole' : 'setMetaRole']({
          ids: ids.join(','),
          rid: checkeds.join(',')
        })
          .then(s => {
            this.$message.success('设置成功！')
            this.closeRoleDialog()
            this.getPage({})
          })
          .catch(e => this.$message.error(e.message))
      } else this.$message.warning('至少勾选一项！')
    },
    checkFn(data) {
      const { checkedKeys } = data
      this.role.checkeds = checkedKeys
    },
    rowCheckboxChange(row) {
      this.$api.user
        .updateUserStatu({
          id: row.id,
          status: row.status
        })
        .then(s => {
          this.$message.success('更改状态成功！')
        })
        .catch(e => {
          row.status = !row.status
          this.$message.error(e.message)
        })
    },
    search(val) {
      this.getPage({
        query: val
      })
    },
    refresh() {
      this.getPage({
        unit_sn: this.tree.targetNode.id
      })
    },
    tableRowHandler({ type, scope }) {
      const METHODS = {
        edit: () => {
          this.operator.id = scope.row.id
          this.operator.status = 'update'
          this.operator.show = true
          this.operator.tree = [...this.tree.data]
        },
        del: () => {
          this.delUser([scope.row.id])
        }
      }
      METHODS[type]()
    },
    delUser(ids = []) {
      if (ids.length === 0) {
        this.$message.warning('请先选择要删除的数据')
      } else {
        this.$confirm('当前操作将会删除所选数据，是否继续？', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.$api.user
              .delUser({ id: ids.join(',') })
              .then(s => {
                this.getPage({
                  unit_sn: this.tree.targetNode.id
                })
                this.$message.success('删除成功！')
                this.$refs.table.clearSelection()
              })
              .catch(e => this.$message.error(e.message))
          })
          .catch(e => e)
      }
    },
    uploadSuccess() {
      this.getTree()
      this.getPage({})
    },
    btnsHandler(type) {
      const METHODS = {
        add: () => {
          this.operator.status = 'add'
          this.operator.id = ''
          this.operator.tree = [...this.tree.data]
          this.operator.show = true
        },
        del: () => {
          const IDS = this.table.selection.map(s => s.id)
          this.delUser(IDS)
        },
        imp: () => {
          this.staffshow = true
        },
        fn: () => {
          if (this.table.selection.length) {
            this.$api.user
              .getRoleTree()
              .then(s => {
                this.role.data = s.data
                this.role.type = 'fn'
                this.role.show = true
                this.$nextTick(() => {
                  this.role.checkeds = this.table.selection.map(se => se.roleIds)
                })
                this.getPage({})
              })
              .catch(e => this.$message.error(e.message))
          } else this.$message.warning('请先选择要操作的数据！')
        },
        meta: () => {
          if (this.table.selection.length) {
            this.$api.user
              .getMetaList()
              .then(s => {
                this.role.data = s.data
                this.role.type = 'meta'
                this.role.show = true
              })
              .catch(e => this.$message.error(e.message))
          } else this.$message.warning('请先选择要操作的数据！')
        },
        import: () => {
          const { baseURL } = this.$http.defaults
          this.upload.action = `${baseURL}/userReportAndImportController/importFile`
          this.upload.show = true
        },
        educe: () => {
          this.$exportFn({
            url: '/userReportAndImportController/export',
            name: '用户管理'
          })
        }
      }
      METHODS[type]()
    },
    setTargetNode(node) {
      if (node.type === 'unit') {
        this.nodeVal = node
      }
      this.tree.targetNode = node
      this.getPage({ unit_sn: node.id })
    },
    getTree(expand = []) {
      this.tree.loading = true
      this.$api.user
        .getFnTree()
        .then(s => {
          this.tree.data = [s.data]
          this.tree.focusId = expand
          this.tree.loading = false
        })
        .catch(e => {
          this.tree.loading = false
          this.$message.error(e.message)
        })
    },
    getPage({
      // eslint-disable-next-line camelcase
      page,
      size,
      unit_sn = '',
      query = ''
    }) {
      page = page || this.table.page
      size = size || this.table.size
      this.table.loading = true
      this.$api.user
        .getPage({
          page,
          size,
          unit_sn,
          query,
          type: this.tree.targetNode.type || ''
        })
        .then(s => {
          this.table.data = s.data.records
          this.table.total = s.data.total
          this.table.loading = false
        })
        .catch(e => {
          this.table.loading = false
          this.$message.error(e.message)
        })
    },
    getTop() {
      // 拖拽
      this.middleDragTop = this.$refs.leftWorkbench.$el.offsetHeight / 2
    },
    move(x) {
      // 移动
      if (x < 300) x = 300
      else if (x > 800) x = 800
      this.width = x
    }
  }
}
</script>

<style></style>
