<template>
  <div>
    <el-dialog
      v-dialog-drag
      :modal="false"
      title="辅助核算"
      width="65%"
      :visible.sync="show"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="() => $emit('update:show', false)"
    >
      <div class="main">
        <div class="leftBox">
          <Tree
            v-waiting="tree.loading"
            :data="tree.data"
            default-expand-all
            @setTargetNode="setTargetNode"
          />
        </div>
        <div class="rightBox">
          <Table
            ref="table"
            :data="table.data"
            :columns="columns"
            number
            multiple
            :height="335"
            row-key="sn_"
            @search="search"
            @select="select"
            @refresh="refresh"
          />
          <Pagination
            class="pagination"
            :amount="table.total"
            :page-size="table.size"
            :current-page="table.page"
            @handleSizeChange="val => (table.size = val)"
            @handleCurrentChange="val => (table.page = val)"
          />
        </div>
      </div>
      <div slot="footer">
        <el-button type="info" size="mini" @click="() => this.$emit('update:show', false)">
          取消
        </el-button>
        <el-button type="primary" size="mini" @click="save">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      ztsn: '',
      tree: {
        loading: false,
        data: [],
        targetNode: {}
      },
      table: {
        data: [],
        selection: [],
        total: 0,
        page: 1,
        size: 200
      },
      returnField: {},
      selections: {},
      query: ''
    }
  },
  computed: {
    // 表格表头数据
    columns() {
      return [
        { label: '编码', prop: 'sn_' },
        { label: '名称', prop: 'name_' }
      ]
    },
    pageAndSize() { // 获取页数据
      const { page, size } = this.table
      return { page, size }
    }
  },
  watch: {
    // eslint-disable-next-line func-names
    'tree.targetNode.id': function (id, oid) {
      if (oid) {
        this.targetNodeChange = true
      }
      this.$refs.table.clearSelection()
      if (Object.values(this.selections) && this.selections[id] && this.selections[id].length) {
        this.selections[id].forEach(row => {
          this.$refs.table.toggleRowSelection(row, true)
        })
      }
    },
    pageAndSize(obj) {
      this.getFzhsDialogTable({
        page: obj.page,
        size: obj.size
      })
    }
  },
  created() {
    this.getFzhsDialogTree()
  },
  methods: {
    search(query) {
      this.query = query
      this.getFzhsDialogTable({})
    },
    refresh() {
      this.query = ''
      this.getFzhsDialogTable({})
    },
    select(obj) { // 多选表格
      const { targetNode } = this.tree
      this.table.selection = obj
      if (!this.targetNodeChange) {
        this.selections[targetNode.id] = [...obj]
      }
      this.targetNodeChange = false
      const ids = obj.map(i => i.sn_).join(',')
      const item = Object.keys(this.returnField).filter(i => i === targetNode.id)[0]
      if (ids !== '') {
        if (!item) {
          this.$set(this.returnField, targetNode.id, ids)
        } else {
          this.returnField[targetNode.id] = ids
        }
      }
    },
    getFirstUsefulNode(tree) { // 默认获取表格
      for (let i = 0; i < tree.length; i++) {
        let node = tree[i]
        if (!node.disabled && node.children && node.children.length) {
          node = this.getFirstUsefulNode(node.children)
        } else {
          this.tree.targetNode = node
          this.getFzhsDialogTable({
            page: this.table.page,
            size: this.table.size
          })
        }
        break
      }
    },
    getFzhsDialogTree() { // 获取左侧树
      this.ztsn = JSON.parse(localStorage.getItem('startZT')).ztsn
      this.tree.loading = true
      this.$api.auxiliaryZT.getFzhsDialogTree({
        ztsn: this.ztsn
      }).then(s => {
        this.tree.data = [...s.data]
        this.getFirstUsefulNode([...s.data])
        this.tree.loading = false
      }).catch(e => {
        this.$message.error(e.message)
        this.tree.loading = false
      })
    },
    setTargetNode(node) { // 点击左侧树
      if (node.disabled) {
        this.tree.targetNode = node
        this.getFzhsDialogTable(
          {
            page: this.table.page,
            size: this.table.size
          }
        )
      } else {
        this.$message.error('此节点不可选')
      }
    },
    getFzhsDialogTable({ page, size }) { // 获取右侧表格
      const { targetNode } = this.tree
      this.table.loading = true
      this.$api.auxiliaryZT.getFzhsDialogTable({
        page: page || this.table.page,
        size: size || this.table.size,
        ztsn: this.ztsn,
        fzhsSn: targetNode.id,
        query: this.query
      }).then(s => {
        this.table.data = [...s.data.records]
        this.table.total = s.total
        this.table.loading = false
      }).catch(e => {
        this.$message.error(e.message)
        this.table.loading = false
      })
    },
    save() {
      this.$emit('update:show', false)
      this.$emit('select', this.returnField)
    }
  }
}
</script>

<style lang="scss" scoped>
.main{
    display: flex;
    .leftBox,
    .rightBox{
        height: 434px;
        border: 1px solid #ddd;
        border-radius: 5px;
    }
    .leftBox{
        width:300px;
        margin-right: 20px;
    }
    .rightBox{
        flex:1;
    }
}
</style>
