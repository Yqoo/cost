<template>
  <div class="right-outer-box">
    <div class="title">
      <img :src="require('@/assets/images/icon/dbsx.png')" alt="">
      <span>预警提示</span>
    </div>
    <div class="right-top-box">
      <Table
        ref="table"
        v-waiting="table.loading"
        :data="table.data"
        :columns="columns"
        :tools="tableTools"
        :search="false"
        @toolshandler="tableToolsHandler"
        @dblclick="dblclick"
      />
    </div>
    <Early v-if="early.show" :show.sync="early.show" :info="early.info" @refash="refash" />
  </div>
</template>

<script>
export default {
  components: {
    Early: () => import('../dialog/early.vue')
  },
  data() {
    return {
      table: {
        data: [],
        loading: false
      },
      early: {
        show: false,
        info: {}
      }
    }
  },
  computed: {
    columns() {
      return [
        { label: '时间', prop: 'createTime' },
        { label: '内容', prop: 'remindDescribe' },
        { label: '状态', prop: 'statu' },
        { label: '操作', prop: undefined }
      ]
    },
    tableTools() {
      return [
        {
          icon: 'el-icon-search', type: 'check', title: '查看详情', api: ''
        },
        {
          icon: 'el-icon-view', type: 'isRead', title: '已读', api: ''
        }
      ]
    }
  },
  created() {
    const data = JSON.parse(localStorage.getItem('earlyWarningRecord'))
    this.table.data = data.map(l => ({
      ...l,
      // eslint-disable-next-line no-nested-ternary
      statu: l.status === 0 ? '未读' : l.status === 1 ? '已读' : '警告'
    }))
  },
  methods: {
    tableToolsHandler(obj) {
      const { type, scope } = obj
      const DEAL = {
        check: () => {
          this.$router.push({
            path: '/earlyWarning'
          })
        },
        isRead: () => {
          this.table.data.splice(scope.$index, 1)
          localStorage.earlyWarningRecord = JSON.stringify(this.table.data)
        }
      }
      DEAL[type]()
    },
    refash(id) {
      const index = this.table.data.findIndex(l => l.id === id)
      this.table.data.splice(index, 1)
      localStorage.earlyWarningRecord = JSON.stringify(this.table.data)
    },
    dblclick(obj) {
      const { row } = obj
      this.early.show = true
      this.early.info = { ...row }
    }
  }
}
</script>

<style lang="scss" scoped>
  .title {
    border-bottom: 1px solid #ddd;
    border-top: 1px solid #ddd;
    padding: 5px 0px 5px 10px;
    img {
      width: 32px;
      height: 32px;
      vertical-align: middle;
    }
    span {
      font-weight: bold;
      font-size: 13px;
      padding-left: 10px;
    }
  }
</style>
