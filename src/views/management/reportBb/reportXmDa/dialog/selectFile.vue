<template>
  <div class="SelectFile">
    <el-dialog
      v-dialogDrag
      :visible.sync="show"
      :modal="false"
      width="60%"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="close"
    >
      <div slot="title">
        选择档案
      </div>
      <div class="SelectFile_main">
        <LeftWorkbench ref="leftWorkbench" :width="width" class="left" :additional="35">
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
            @setTargetNode="setTargetNode"
          />
        </LeftWorkbench>
        <RightWorkbench :margin-left="width" class="right" :additional="35">
          <Table
            slot="table"
            ref="table"
            v-waiting="table.loading"
            :data="table.data"
            :multiple="isFormula"
            :columns="columns"
            :search="true"
            :row-key="tree.targetNode.id === 'kjkmRoot' ? 'id_' : 'sn_'"
            number
            @search="searchData"
            @rowclick="rowclick"
            @select="select"
            @refresh="refresh"
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
        </Rightworkbench>
      </div>
      <div slot="footer">
        <el-button v-if="isFormula" type="info" size="mini" @click="updated('cover')">
          覆盖
        </el-button>
        <el-button v-if="isFormula" type="primary" size="mini" @click="updated('add')">
          追加
        </el-button>
        <el-button v-if="!isFormula" type="info" size="mini" @click="close">
          取消
        </el-button>
        <el-button v-if="!isFormula" type="primary" size="mini" @click="save">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'SelectFile',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    xmId: {
      type: String,
      default: ''
    },
    kjzd: {
      type: String,
      default: ''
    },
    hybb: {
      type: String,
      default: ''
    },
    formula: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      xmid: '',
      width: 300,
      query: '',
      KJZD: '',
      HYBB: '',
      tree: {
        loading: false,
        targetNode: {},
        data: []
      },
      table: {
        loading: false,
        data: [],
        selection: [],
        total: 0,
        size: 200,
        page: 1,
        selectRow: {}
      },
      list: [],
      selections: {},
      isFormula: true
    }
  },
  computed: {
    columns() {
      return [
        { label: '编码', prop: 'sn_' },
        { label: '名称', prop: 'name_' }
      ]
    }
  },
  watch: {
    xmId: {
      immediate: true,
      handler(val) {
        if (val) {
          this.xmid = val
          this.selectFileTree()
        }
      }
    },
    kjzd: {
      immediate: true,
      handler(val) {
        this.KJZD = val
      }
    },
    hybb: {
      immediate: true,
      handler(val) {
        this.HYBB = val
      }
    },
    formula: {
      immediate: true,
      handler(val) {
        if (val) {
          this.isFormula = false
        } else {
          this.isFormula = true
        }
      }
    },
    // eslint-disable-next-line func-names
    'tree.targetNode.id': function (id, oid) {
      if (oid) {
        this.targetNodeChange = true
      }
      this.$refs.table.clearSelection()
      if (this.selections[id] && this.selections[id].length) {
        this.selections[id].forEach(row => {
          this.$refs.table.toggleRowSelection(row, true)
        })
      }
    }
  },
  methods: {
    rowclick(obj) {
      const { row } = obj
      this.table.selectRow = row
    },
    save() {
      this.$emit('update:show', false)
      this.$refs.table.setCurrentRow()
      this.$emit('checkRow', this.table.selectRow, this.tree.targetNode)
    },
    close() {
      this.$emit('update:show', false)
      this.$refs.table.clearSelection()
      this.selections = {}
      this.list = []
    },
    updated(opType) { // 追加和覆盖
      const params = this.list
      this.$api.reportxm.addTableData({
        xmId: this.xmid,
        addType: opType,
        data: JSON.stringify(params)
      }).then(s => {
        this.$emit('update:show', false)
        this.$emit('refresh')
        this.$refs.table.clearSelection()
        this.selections = {}
        this.list = []
      }).catch(e => {
        this.$message.error(e.message)
      })
    },
    selectFileTree() { // 获取左侧树
      this.tree.loading = true
      this.$api.reportxm.selectFileTree({
        xmId: this.xmid,
        ztsn: ''
      }).then(s => {
        this.tree.data = s.data
        this.tree.loading = false
      }).catch(e => {
        this.tree.loading = false
        this.$message.error(e.message)
      })
    },
    selectFileTable() { // 获取右侧表格数据
      this.table.loading = true
      const { targetNode } = this.tree
      this.$api.reportxm.selectFileTable({
        page: this.table.page,
        size: this.table.size,
        dossierId: targetNode.id,
        type: targetNode.type,
        query: this.query,
        kjzd: this.KJZD,
        hybb: this.HYBB,
        ztsn: ''
      }).then(s => {
        const { records, total } = s.data
        this.table.data = records
        this.table.loading = false
        this.table.total = total
      }).catch(e => {
        this.table.loading = false
        this.$message.error(e.message)
      })
    },
    setTargetNode(node) {
      if (!node.disabled) {
        this.tree.targetNode = { ...node }
        this.selectFileTable()
      } else this.$message.warning('当前节点无法使用！')
    },
    searchData(val) {
      this.query = val
      this.selectFileTable()
    },
    select(obj) {
      let childSns = []
      const { targetNode } = this.tree
      this.table.selection = [...obj]
      if (!this.targetNodeChange) {
        this.selections[targetNode.id] = [...obj]
      }
      this.targetNodeChange = false
      childSns = obj.map(i => i[targetNode.id === 'kjkmRoot' ? 'id_' : 'sn_'])
      let item = this.list.filter(e => e.dossierId === targetNode.id)[0]
      if (!item) {
        item = {
          dossierId: targetNode.id,
          type: targetNode.type,
          childSns
        }
        this.list.push(item)
      } else {
        item.childSns = childSns
      }
    },
    refresh() {
      this.query = ''
      this.selectFileTable()
    }
  }
}
</script>

<style lang="scss" scoped>
.SelectFile_main{
  height:100%;
  /deep/.left{
    height:588px !important;
    overflow: auto;
  }
.right{
  height:588px !important;
  overflow: auto;
}
  /deep/.el-table{
    height:489px !important;
    overflow: auto;
  }
}
</style>
