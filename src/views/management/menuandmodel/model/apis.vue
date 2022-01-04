<template>
  <el-dialog
    v-dialogDrag
    :visible.sync="show"
    :modal="false"
    width="65%"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :before-close="() => $emit('update:show', false)"
  >
    <div slot="title">
      API列表
    </div>
    <div class="api">
      <div class="tree">
        <Tree
          ref="tree"
          v-waiting="tree.loading"
          search
          :data="tree.data"
          :node-props="{
            children: 'children',
            label: 'label'
          }"
          :default-expanded-keys="tree.focusId"
          @setTargetNode="setChild"
        />
      </div>
      <div class="table">
        <el-table
          ref="table"
          v-waiting="loading"
          :data="table.data"
          size="mini"
          style="wodth:100%;"
          height="400"
          :row-key="getRowKey"
          @selection-change="selectionChange"
        >
          <el-table-column type="selection" reserve-selection />
          <el-table-column label="名称" prop="name" show-overflow-tooltip />
          <el-table-column label="API" prop="path" show-overflow-tooltip />
          <el-table-column label="描述" prop="desc_" show-overflow-tooltip />
        </el-table>
        <Pagination
          class="pagination"
          :amount="table.total"
          :page-size="table.size"
          :current-page="table.page"
          @handleSizeChange="val => table.size = val"
          @handleCurrentChange="val => table.page = val"
        />
      </div>
    </div>
    <div slot="footer">
      <el-button type="info" size="mini" @click="() => $emit('update:show', false)">
        取消
      </el-button>
      <el-button type="primary" size="mini" @click="save">
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'Apis',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    checkeds: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loading: false,
      table: {
        data: [],
        size: 200,
        page: 1,
        total: 0,
        selection: []
      },
      tree: {
        loading: false,
        data: [],
        focusId: []
      },
      path: ''
    }
  },
  computed: {
    pageChange() {
      const { size, page } = this.table
      return { size, page }
    }
  },
  watch: {
    pageChange({ size, page }) {
      this.getPage({ size, page, path: this.path })
    },
    path(val) {
      this.getPage({ path: val })
    }
  },
  created() {
    this.getPage({})
    this.getApisTree()
  },
  methods: {
    save() {
      this.$emit('setCheckApis', this.table.selection)
      this.$emit('update:show', false)
    },
    selectionChange(selection) {
      this.table.selection = selection
    },
    getRowKey(row) {
      return row.path
    },
    getApisTree() { // 获取左侧树
      this.tree.loading = true
      this.$api.menu.getApisTree().then(s => {
        this.tree.loading = false
        this.tree.data = [...s.data]
      }).catch(e => {
        this.tree.loading = false
        this.$message.error(e.message)
      })
    },
    setChild(node) {
      this.path = node.path
    },
    getPage({
      page, size, query = '', path = ''
    }) {
      this.loading = true
      this.$api.menu.getApis({
        page: page || this.table.page,
        size: size || this.table.size,
        query,
        path
      }).then(s => {
        this.table.data = [...s.data.records]
        this.table.data.forEach(row => {
          if (this.checkeds.includes(row.path)) {
            this.$nextTick(() => {
              this.$refs.table.toggleRowSelection(row, true)
            })
          }
        })
        this.table.total = s.data.total
        this.loading = false
      }).catch(e => {
        this.loading = false
        this.$message.error(e.message)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.api {
  display: flex;
}
.tree {
  border: 1px solid #ddd;
  border-radius: 5px;
  height: 443px;
}
.table {
  flex: 1;
  border: 1px solid #ddd;
  margin-left: 20px;
  border-radius: 5px;
}
.pagination {
  margin: 5px 10px 10px 0;
  text-align: right;
}
</style>
