<template>
  <div class="early">
    <LeftWorkbench ref="leftWorkbench" :width="width" title="预警分类" class="left" :additional="0">
      <el-button
        slot="addUnit"
        class="el-icon-plus"
        style="padding:0"
        size="mini"
        type="text"
        @click="addUnit"
      />
      <Tree
        slot="tree"
        ref="tree"
        v-waiting="tree.loading"
        :data="tree.data"
        :node-props="{
          children: 'children',
          label: 'label'
        }"
        default-expand-all
        :rightmenus="rightmenus"
        :default-expanded-keys="tree.focused"
        @update:rightmenus="rightmenusHandler"
        @setTargetNode="setTargetNode"
      />
    </LeftWorkbench>
    <MiddleDrag :margin-top="middleDragTop" @hook:mounted="getTop" @move="move" />
    <RightWorkbench :margin-left="width" :additional="0">
      <ToolsBar slot="toolsBar" :items="btns" :width="180" @btnsHandler="btnsHandler" />
      <Table
        ref="table"
        slot="table"
        v-waiting="table.loading"
        :data="table.data"
        :columns="columns"
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
    <TreeClassify
      v-if="treeClassify.show"
      :id="treeClassify.id"
      :show.sync="treeClassify.show"
      :info="treeClassify.info"
      @refshTree="getTree"
    />
    <EarlyList
      v-if="earlyList.show"
      :show.sync="earlyList.show"
      :usn="earlyList.usn"
      :info="tree.targetNode"
      @refshlist="getEarlyList({ typeid: tree.targetNode ? tree.targetNode.id : '' })"
    />
    <Result v-if="result.show" :show.sync="result.show" :info="result.info" />
  </div>
</template>

<script>
export default {
  name: 'EarlyWarning',
  components: {
    TreeClassify: () => import('./dialog/treeClassify'),
    EarlyList: () => import('./dialog/earlyList'),
    Result: () => import('./dialog/result.vue')
  },
  data() {
    return {
      width: 300,
      middleDragTop: this.width,
      tree: {
        data: [],
        focused: [],
        targetNode: {},
        loading: false
      },
      table: {
        data: [],
        loading: false,
        select: [],
        total: 0,
        page: 1,
        size: 200
      },
      treeClassify: {
        show: false,
        info: {},
        id: ''
      },
      earlyList: {
        show: false,
        usn: ''
      },
      result: {
        show: false,
        info: {}
      }
    }
  },
  computed: {
    btns() {
      return [
        {
          method: 'add', name: '新增', icon: '', api: '/unit/add'
        },
        {
          method: 'edit', name: '修改', icon: '', api: '/unit/add'
        },
        {
          method: 'del', name: '删除', icon: '', api: '/unit/add'
        }
      ]
    },
    columns() {
      return [
        { label: '名称', prop: 'name' },
        { label: '编码', prop: 'sn' },
        { label: '方案分类', prop: 'schemeTypeName' },
        { label: '提醒规则', prop: 'remindRule' },
        { label: '提醒配置', prop: 'remindConfigure' },
        { label: '描述', prop: 'describe_' },
        { label: '状态', prop: 'status_', switch: true },
        { label: '最后修改人', prop: 'createUserName' },
        { label: '操作', prop: undefined }
      ]
    },
    tableTools() {
      return [
        {
          icon: 'el-icon-edit-outline', type: 'edit', title: '修改', api: ''
        },
        {
          icon: 'el-icon-delete-solid', type: 'del', title: '删除', api: ''
        },
        {
          icon: 'el-icon-search', type: 'check', title: '查看检测结果', api: ''
        }
      ]
    },
    pageChange() {
      const { size, page } = this.table
      return { size, page }
    }
  },
  watch: {
    pageChange(obj) {
      this.getEarlyList({
        page: obj.page,
        size: obj.size
      })
    }
  },
  created() {
    this.getTree()
    this.getEarlyList({})
  },
  // earlyWarning
  methods: {
    getEarlyList({
      page, size, typeid = '', name = ''
    }) {
      this.table.loading = true
      this.$api.earlyWarning.getEarlyList({
        page: page || this.table.page,
        size: size || this.table.size,
        typeid,
        name
      }).then(s => {
        const { records, total } = s.data
        this.table.data = [...records]
        this.table.total = total
        this.table.loading = false
      }).catch(e => {
        this.table.loading = false
        this.$message.error(e.message)
      })
    },
    getTree() {
      this.tree.loading = true
      this.$api.earlyWarning.getTree().then(s => {
        this.tree.data = [...s.data]
        this.tree.loading = false
      }).catch(e => {
        this.tree.loading = false
        this.$message.error(e.message)
      })
    },
    addUnit() {
      this.treeClassify.show = true
      this.treeClassify.info = {}
    },
    btnsHandler(met) {
      const IDS = this.table.select.map(l => l.id)
      const DEAL = {
        add: () => {
          this.earlyList.show = true
          this.earlyList.usn = null
        },
        edit: () => {
          if (IDS && IDS.length > 1) this.$message.warning('只能修改单条数据')
          else if (IDS && IDS.length < 1) this.$message.warning('请选择要修改的数据')
          else {
            this.earlyList.show = true
            this.earlyList.usn = this.table.select[0].id
          }
        },
        del: () => {
          if (IDS && IDS.length > 1) this.$message.warning('只能删除单条数据')
          else if (IDS && IDS.length < 1) this.$message.warning('请选择要删除的数据')
          else {
            this.del(IDS)
          }
          // IDS && IDS.length ? this.del(IDS) : this.$message.warning('请选择要删除的数据')
        }
      }
      DEAL[met]()
    },
    rightmenus(node) {
      const rm = [
        {
          label: '添加分类', icon: 'el-icon-circle-plus-outline', type: 'add', api: ''
        },
        {
          label: '修改分类', icon: 'el-icon-edit-outline', type: 'edit', api: ''
        },
        {
          label: '删除分类', icon: 'el-icon-delete', type: 'del', api: ''
        }
      ]
      return rm
    },
    rightmenusHandler(obj) {
      const { data, type } = obj
      const DEAL = {
        add: () => {
          this.treeClassify.show = true
          this.treeClassify.info = { ...data }
        },
        edit: () => {
          this.treeClassify.show = true
          this.treeClassify.id = data.id
          this.treeClassify.info = {}
        },
        del: () => {
          this.$confirm('当前操作将会删除选中数据，是否继续？', '删除', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$api.earlyWarning.delTree({
              idOrSn: data.id
            }).then(res => {
              this.$message.success('删除成功')
              this.getTree()
            }).catch(e => this.$message.error(e.message))
          }).catch(e => e)
        }
      }
      DEAL[type]()
    },
    del(id) {
      this.$confirm('当前操作将会删除选中数据，是否继续？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.earlyWarning.delEarlyList({
          id: id.join(',')
        }).then(res => {
          this.$message.success('删除成功')
          this.getEarlyList({ typeid: this.tree.targetNode ? this.tree.targetNode.id : '' })
          this.$refs.table.clearSelection()
        }).catch(e => this.$message.error(e.message))
      }).catch(e => e)
    },
    setTargetNode(node) {
      this.tree.targetNode = node
      this.getEarlyList({ typeid: node.id })
    },
    checkboxStatus(obj) {
      this.$api.earlyWarning.changeEarly({
        id: obj.id,
        status_: obj.status_ === true ? '1' : '0'
      }).then(s => {
        this.$message.success('修改成功')
      }).catch(e => this.$message.error(e.message))
    },
    tableToolsHandler(obj) {
      const { type, scope } = obj
      const DEAL = {
        edit: () => {
          this.earlyList.show = true
          this.earlyList.usn = scope.row.id
        },
        del: () => {
          this.del([scope.row.id])
        },
        check: () => {
          this.result.show = true
          this.result.info = { ...scope.row }
        }
      }
      DEAL[type]()
    },
    refresh() {
      this.getEarlyList({})
    },
    search(query) {
      this.getEarlyList({ name: query })
    },
    select(select) {
      this.table.select = [...select]
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
</style>
