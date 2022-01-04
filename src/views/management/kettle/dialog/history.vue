<template>
  <div class="historyBox">
    <el-dialog
      v-dialogDrag
      :modal="false"
      width="66%"
      top="0"
      :visible.sync="show"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="() => $emit('update:show', false)"
    >
      <div slot="title">
        查看历史结果
      </div>
      <div>
        <div class="top">
          <el-date-picker
            v-model="dateRange"
            size="mini"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="changeDate"
          />
          <ToolsBar
            slot="toolsBar"
            class="btnColor"
            module-name="Kettle"
            :items="btns"
            @btnsHandler="btnsHandler"
          />
        </div>
        <Table
          ref="table"
          slot="table"
          v-waiting="table.loading"
          :data="table.data"
          :columns="columns"
          module-name="Kettle"
          :tools="tableTools"
          :multiple="true"
          :search="false"
          @toolshandler="tableToolsHandler"
          @select="select"
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
      </div>
      <div slot="footer">
        <el-button
          type="info"
          size="mini"
          @click="() => $emit('update:show', false)"
        >
          取消
        </el-button>
        <el-button type="primary" size="mini" @click="() => $emit('update:show', false)">
          确定
        </el-button>
      </div>
    </el-dialog>
    <detail
      v-if="detailInfo.show"
      :id="detailInfo.id"
      :show.sync="detailInfo.show"
    />
  </div>
</template>

<script>
export default {
  components: {
    detail: () => import('./detail')
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dateRange: [new Date(new Date().getTime() - 24 * 60 * 60 * 1000), new Date()],
      table: {
        id: '',
        loading: false,
        data: [],
        size: 200,
        page: 1,
        total: 0,
        selection: []
      },
      detailInfo: {
        show: false,
        id: ''
      }
    }
  },
  computed: {
    // 表格表头数据
    columns() {
      return [
        { label: '是否自动执行', prop: 'autoExecute' },
        { label: '开始时间', prop: 'executeStartTime' },
        { label: '结束时间', prop: 'executeEndTime' },
        { label: '是否成功', prop: 'success' },
        { label: '执行人', prop: 'executeUserName' },
        { label: '操作', prop: undefined }
      ]
    },
    // toolsBar 按钮
    btns() {
      return [
        { method: 'del', name: '删除', api: '/kettle/deleteRecord' }
      ]
    },
    // table 操作栏（图标样式）
    tableTools() {
      return [
        {
          icon: 'el-icon-delete-solid',
          type: 'del',
          title: '删除',
          api: '/kettle/deleteRecord'
        },
        {
          icon: 'el-icon-zoom-in',
          type: 'detail',
          title: '查看详情',
          api: '/kettle/getRecord'
        }
      ]
    },
    pageAndSize() {
      const { page, size } = this.table
      return { page, size }
    }
  },
  watch: {
    id: {
      immediate: true,
      handler(val) {
        if (val) {
          this.table.id = val
        }
      }
    },
    pageAndSize(obj) {
      this.getPage({
        page: obj.page,
        size: obj.size
      })
    }
  },
  created() {
    this.getPage({})
  },
  methods: {
    changeDate(val) {
      if (val) {
        this.dateRange = val
        this.getPage({
          page: this.table.page,
          size: this.table.size
        })
      }
    },
    // 删除行
    delRows(rows = []) {
      this.$confirm('当前操作将删除所选数据，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$api.kettle
            .delRecord({
              ids: rows.join(',')
            })
            .then(s => {
              this.getPage({})
              this.$refs.table.clearSelection()
              this.$message.success('删除成功！')
            })
            .catch(e => {
              this.getPage({})
              this.$message.error(e.message)
            })
        })
        .catch(e => e)
    },
    // table 操作栏事件
    tableToolsHandler(obj) {
      const { type, scope } = obj
      const METHODS = {
        del: () => {
          this.delRows([scope.row.id])
        },
        detail: () => {
          this.detailInfo.show = true
          this.detailInfo.id = scope.row.id
        }

      }
      METHODS[type]()
    },
    // 选中checkBox 事件
    select(obj) {
      this.table.selection = [...obj]
    },
    // toolsBar 点击事件(按钮)
    btnsHandler(type) {
      const { selection } = this.table
      const METHODS = {
        del: () => {
          if (selection.length === 0) this.$message.warning('至少选择一行数据进行删除！')
          else {
            this.delRows(selection.map(s => s.id))
          }
        }
      }
      METHODS[type]()
    },
    // 获取页码及右侧表格数据
    getPage({ page, size }) {
      this.table.loading = true
      const startTime = this.$tools.timestamp(this.dateRange[0], 'YYYY-MM-DD HH:ii:ss')
      const endTime = this.$tools.timestamp(this.dateRange[1], 'YYYY-MM-DD HH:ii:ss')
      this.$api.kettle.findRecord({
        page: page || this.table.page,
        size: size || this.table.size,
        id: this.table.id,
        startTime,
        endTime
      })
        .then(s => {
          const data = [...s.data.records]
          data.forEach(e => {
            e.autoExecute ? e.autoExecute = '是' : e.autoExecute = '否'
            e.success ? e.success = '是' : e.success = '否'
          })
          this.table.data = data
          this.table.total = s.data.total
          this.table.loading = false
        })
        .catch(e => {
          this.table.loading = false
          this.$message.error(e.message)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.historyBox{
  position: fixed;
  top:0;
  left:0;
  width:100%;
  height:100%;
  z-index: 1200;
  .el-dialog__wrapper{
    position: absolute;
    top:0;
    left:0;
    display: flex;
    align-items: center;
    /deep/.el-dialog{
      margin-bottom: 0;
    }
  }
}
.top{
  display: flex;
  justify-content: space-between;
  align-items: center;
  .btnColor{
    display: inline-block;
  }
}
/deep/.el-table{
  height:500px !important;
}
</style>
