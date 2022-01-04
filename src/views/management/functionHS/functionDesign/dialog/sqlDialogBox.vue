<template>
  <div>
    <el-dialog
      v-dialogDrag
      :visible.sync="show"
      :model="false"
      width="65%"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="() => $emit('update:show', false)"
    >
      <div slot="title">
        选择数据
      </div>
      <div class="content">
        <div v-if="tree.data.length" class="left">
          <Tree
            ref="tree"
            :data="tree.data"
            search
            default-expand-all
            @setTargetNode="setTargetNode"
          />
        </div>
        <div :class="tree.data.length ? 'right' : 'all'">
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
            :data="table.data"
            :row-key="getRowkey"
            style="width:100%"
            height="500px"
            @select="select"
          >
            <el-table-column
              v-if="table.data.length"
              type="selection"
              :reserve-selection="true"
              :class-name="isOneData ? 'hide-check' : ''"
              width="50"
            />
            <el-table-column v-for="e in table.columns" :key="e" :label="e" :prop="e" :show-overflow-tooltip="true" />
          </el-table>
          <Pagination
            slot="page"
            class="pagination"
            :amount="table.total"
            :page-size="table.pageSize"
            :current-page="table.pageNo"
            @handleSizeChange="val => table.pageSize = val"
            @handleCurrentChange="val => table.pageNo = val"
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
  name: 'SqlDialogBox',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      content: '',
      tree: {
        data: []
      },
      table: {
        data: [],
        columns: [],
        total: 0,
        pageSize: 10,
        pageNo: 1
      },
      isOneData: false,
      field: '',
      checkTableDate: [] // 选中的值
    }
  },
  computed: {
    pageAndsize() {
      const { pageSize, pageNo } = this.table
      return { pageSize, pageNo }
    },
    returnStr() {
      return this.checkTableDate.map(l => l[this.field]).join(',')
    }
  },
  watch: {
    pageAndsize(obj) {
      const { id, hsId, dsSn } = this.data
      const { pageSize, pageNo } = obj
      this.getTable({
        paramId: id, hsId, dsSn, pageSize, pageNo
      })
    },
    show: {
      immediate: true,
      handler: 'getInfo'
    }
  },
  methods: {
    getInfo(bool) {
      if (bool) {
        const { id, hsId, dsSn } = this.data
        this.getTable({ paramId: id, hsId, dsSn })
      }
    },
    getTable({
      paramId, hsId, dsSn, query = '', pageNo = 1, pageSize = 10
    }) {
      this.$api.functionCenter.getSqlTable({
        paramId,
        hsId,
        dsSn,
        query,
        pageNo: pageNo || this.table.pageNo,
        pageSize: pageSize || this.table.pageSize
      }).then(s => {
        // console.log(s)
        this.isOneData = s.data.oneData
        const {
          bt, page, field, tree
        } = s.data
        this.field = field
        this.table.columns = { ...bt }
        this.table.data = [...page.records]
        this.table.total = page.total
        this.tree.data = [...tree]
      }).catch(e => this.$message.error(e.message))
    },
    select(select, row) {
      if (this.isOneData === 'true') {
        this.$nextTick(() => {
          select.forEach(el => {
            if (el.id !== row.id) {
              this.$refs.table.toggleRowSelection(el, false)
            }
          })
        })
        this.checkTableDate = [row]
      } else this.checkTableDate = [...select]
    },
    searchData(query) {
      const { id, hsId, dsSn } = this.data
      this.getTable({
        paramId: id, hsId, dsSn, query
      })
    },
    refresh() {
      const { id, hsId, dsSn } = this.data
      this.getTable({ paramId: id, hsId, dsSn })
    },
    setTargetNode(node) { // 左侧树点击
      // console.log(node)
    },
    save() {
      this.$emit('update', {
        name: this.data.name,
        str: this.returnStr
      })
      this.$emit('update:show', false)
    },
    getRowkey(row) {
      return row.id
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
  height: 100%;
  display: flex;
  .left {
    width: 30%;
    margin-right: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
  .all {
    width: 100%;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
  .right {
    width: calc(100% - 30% - 10px);
    border: 1px solid #ddd;
    border-radius: 5px;
    .el-table{
      & /deep/ .el-table__header{
        .cell.hide-check{
          display: none;
        }
      }
    }
  }
  .pagination {
    padding: 10px;
  }
}
</style>
