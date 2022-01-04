<template>
  <div class="rolePrincipal">
    <el-dialog
      v-dialogDrag
      :visible.sync="show"
      :modal="false"
      width="55%"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="() => $emit('update:show', false)"
    >
      <div slot="title">
        <!-- <i class="el-icon-user" /> -->
        <span>角色负责人</span>
      </div>
      <div class="workbench">
        <div class="leftWorkbench">
          <LeftWorkbench :width="200" class="leftWorkbench">
            <Tree
              slot="tree"
              v-waiting="tree.loading"
              :data="tree.unitData"
              :node-props="{
                children: 'children',
                label: 'label'
              }"
              @setTargetNode="setChildRM"
            />
          </LeftWorkbench>
        </div>
        <div class="right">
          <Search class="search" :content.sync="content" @search="searchData">
            <el-button
              slot="refresh"
              size="mini"
              type="text"
              icon="el-icon-refresh-right"
              @click="refresh"
            >
              刷新
            </el-button>
          </Search>
          <el-table
            ref="table"
            v-waiting="table.loading"
            class="elTabl"
            :data="table.data"
            size="mini"
            style="width: 99%"
            height="300"
            :row-key="getRowKey"
            border
            align="center"
            @selection-change="selectChange"
          >
            <el-table-column type="selection" width="50" reserve-selection />
            <el-table-column
              type="index"
              label="序号"
              prop="table.index"
            />
            <el-table-column label="编码" width="80" prop="sn" />
            <el-table-column label="名称" prop="name" />
            <el-table-column label="所属单位" prop="unit_name" />
          </el-table>
          <Pagination
            class="pagination"
            :amount="page.total"
            :page-size="page.size"
            :current-page="page.page"
            @handleSizeChange="(val) => (page.size = val)"
            @handleCurrentChange="(val) => (page.page = val)"
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
  </div>
</template>

<script>
import Search from '@/components/treeNode/search'
import Pagination from '@/components/pagination'

export default {
  name: 'RolePrincipal',
  components: {
    Search,
    Pagination
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    sn: {
      type: String,
      default: ''
    },
    select: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      content: '',
      height: 300,
      tree: {
        loading: false,
        unitData: [],
        targetNode: {}
      },
      table: {
        loading: false,
        data: [],
        select: []
      },
      page: {
        total: 0,
        size: 200,
        page: 1
      }
    }
  },
  computed: {
    changePage() {
      const { size, page } = this.page
      return { size, page }
    }
  },
  watch: {
    changePage(obj) {
      this.getPage({
        size: obj.size,
        page: obj.page,
        unit_sn: this.tree.targetNode.id || ''
      })
    },
    select: {
      immediate: true,
      handler(val) {
        if (val && val.length) {
          this.$nextTick(() => {
            val.forEach(row => {
              this.$refs.table.toggleRowSelection(row, true)
            })
          })
        }
      }
    }
  },
  created() {
    this.getUnitTree()
    this.getPage({})
  },
  methods: {
    getUnitTree() { // 获取单位树
      this.tree.loading = true
      this.$api.unit.unitTree().then(res => {
        const { data } = res
        this.tree.unitData = [data]
        this.tree.loading = false
      }).catch(e => {
        this.tree.loading = false
        this.$message.error(e.message)
      })
    },
    getPage({
    // eslint-disable-next-line camelcase
      page, size, unit_sn = '', query = ''
    }) {
      page = page || this.page.page
      size = size || this.page.size
      this.table.loading = true
      this.$api.user.getPage({
        page,
        size,
        unit_sn,
        query,
        type: this.tree.targetNode.type || ''
      }).then(s => {
        this.table.data = s.data.records
        if (!this.select || this.select.length === 0) {
          const snArr = this.sn.split(',')
          const rows = this.table.data.filter(l => snArr.includes(l.sn))
          rows.forEach(row => {
            this.$refs.table.toggleRowSelection(row, true)
          })
        }
        this.page.total = s.data.total
        this.table.loading = false
      }).catch(e => {
        this.table.loading = false
        this.$message.error(e.message)
      })
    },
    save() {
      this.$emit('update:show', false)
      this.$emit('select', this.table.select)
    },
    setChildRM(node) {
      this.tree.targetNode = node
      this.getPage({ unit_sn: node.id })
    },
    getRowKey(row) {
      return row.id
    },
    selectChange(select) {
      this.table.select = [...select]
    },
    searchData(val) {
      this.getPage({
        query: val
      })
    },
    refresh() {
      this.getPage({
        unit_sn: this.tree.targetNode.id
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.workbench {
  display: flex;
}
.right {
  border :1px solid #ddd;
  flex-grow: 1;
  margin-left: 10px;
  padding: 0 10px 10px 10px;
}
.search {
width: 50%;
text-align: center;
}
.pagination {
margin-top: 10px;
text-align: right;
padding: 0 15px;
}
// .leftWorkbench {
//   height: 300px;
// }
</style>
