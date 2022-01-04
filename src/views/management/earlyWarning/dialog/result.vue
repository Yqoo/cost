<template>
  <div>
    <el-dialog
      v-dialogDrag
      :visible.sync="show"
      :modal="false"
      width="35%"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="() => $emit('update:show', false)"
    >
      <div slot="title">
        {{ info.name }}
      </div>
      <el-tabs v-model="activeName">
        <el-tab-pane v-for="item in activeArr" :key="item.name" :label="item.label" :name="item.name">
          <Table
            ref="table"
            :data="table.data"
            :columns="columns"
            :search="false"
            :height="300"
            @dblclick="dblclick"
          />
          <Pagination
            class="pagination"
            :amount="table.total"
            :page-size="table.size"
            :current-page="table.page"
            @handleSizeChange="(val) => (table.size = val)"
            @handleCurrentChange="(val) => (table.page = val)"
          />
        </el-tab-pane>
      </el-tabs>
      <div slot="footer">
        <el-button type="info" size="mini" @click="() => $emit('update:show', false)">
          取消
        </el-button>
      </div>
    </el-dialog>
    <DescList v-if="desc.show" :show.sync="desc.show" :info="desc.info" @refshTable="getTable({})" />
  </div>
</template>

<script>
export default {
  name: 'Result',
  components: {
    DescList: () => import('./desc.vue')
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      desc: {
        show: false,
        info: {}
      },
      table: {
        data: [],
        loading: false,
        total: 0,
        page: 1,
        size: 200
      },
      activeArr: [
        { label: '未读', name: 'unread' },
        { label: '已读', name: 'read' }
      ],
      activeName: 'unread'
    }
  },
  computed: {
    columns() {
      return [
        { label: '监测时间', prop: 'createTime' },
        { label: '监测内容', prop: 'remindDescribe' },
        { label: '状态', prop: 'statu' }
      ]
    },
    pageChange() {
      const { size, page } = this.table
      return { size, page }
    }
  },
  watch: {
    pageChange(obj) {
      this.getTable({
        page: obj.page,
        size: obj.size
      })
    },
    activeName: {
      immediate: true,
      handler(val) {
        val && val === 'unread' ? this.getTable({}) : this.getTable({ status: '1' })
      }
    }
  },
  // earlyWarning
  methods: {
    getTable({
      page, size, status = '0', scheme = this.info.sn
    }) {
      this.$api.earlyWarning.getResult({
        page: page || this.table.page,
        size: size || this.table.size,
        status,
        scheme
      }).then(s => {
        const { total, records } = s.data
        this.table.data = records.map(l => ({
          ...l,
          // eslint-disable-next-line no-nested-ternary
          statu: l.status === 0 ? '未读' : l.status === 1 ? '已读' : '警告'
        }))
        this.table.total = total
      }).catch(e => {
        this.$message.error(e.message)
      })
    },
    dblclick(obj) {
      this.desc.show = true
      this.desc.info = obj.row
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
