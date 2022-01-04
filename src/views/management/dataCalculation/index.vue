<template>
  <div>
    <!-- <LeftWorkbench ref="leftWorkbench" :width="width" title="数据计算">
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
      />
    </LeftWorkbench>
    <MiddleDrag
      :margin-top="middleDragTop"
      @hook:mounted="getTop"
      @move="move"
    /> -->
    <RightWorkbench :margin-left="width">
      <ToolsBar
        slot="toolsBar"
        class="btnColor"
        module-name="DataCalculation"
        :items="btns"
        @btnsHandler="btnsHandler"
      />
      <Table
        ref="table"
        slot="table"
        v-waiting="table.loading"
        number
        :data="table.data"
        :columns="columns"
        module-name="DataCalculation"
        :tools="tableTools"
        :multiple="true"
        :search="false"
        @toolshandler="tableToolsHandler"
        @select="selectionChange"
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
    <FormComp
      v-if="formComp.show"
      :id="formComp.id"
      :show.sync="formComp.show"
      @refresh="() => getPage({})"
    />
    <Menu :id="menu.id" :show.sync="menu.show" api="dataCalculation" />
  </div>
</template>

<script>
export default {
  name: 'DataCalculation',
  components: {
    FormComp: () => import('./components/form'),
    Menu: () => import('@/components/record/dialog/menu')
  },
  data() {
    return {
      width: 0,
      middleDragTop: this.width,
      tree: {
        loading: false,
        data: []
      },
      table: {
        loading: false,
        data: [],
        size: 200,
        page: 1,
        total: 0,
        selection: []
      },
      formComp: {
        show: false,
        id: ''
      },
      menu: {
        id: '',
        show: false
      }
    }
  },
  computed: {
    pageAndSize() {
      const { page, size } = this.table
      return { page, size }
    },
    columns() {
      return [
        { label: '名称', prop: 'name' },
        { label: '编码', prop: 'sn' },
        { label: '操作', prop: undefined }
      ]
    },
    tableTools() {
      return [
        {
          icon: 'el-icon-edit-outline',
          type: 'update',
          title: '修改'
        },
        {
          icon: 'el-icon-delete-solid',
          type: 'del',
          title: '删除'
        },
        {
          icon: 'el-icon-video-play',
          type: 'run',
          title: '转换'
        },
        {
          icon: 'el-icon-menu',
          type: 'menu',
          title: '生成菜单'
        }
      ]
    },
    btns() {
      return [
        { method: 'add', name: '新增' },
        { method: 'del', name: '删除' }
      ]
    }
  },
  watch: {
    // eslint-disable-next-line func-names
    'formComp.show': function (bool) {
      bool || (this.formComp.id = '')
    },
    pageAndSize({ page, size }) {
      this.getPage({
        page,
        size
      })
    }
  },
  created() {
    this.getPage({})
  },
  methods: {
    tableToolsHandler(obj) {
      const { type, scope } = obj
      const METHODS = {
        update: () => {
          this.formComp.id = scope.row.id
          this.formComp.show = true
        },
        del: () => {
          this.delRows([scope.row.sn])
        },
        menu: () => {
          this.menu.id = scope.row.sn
          this.menu.show = true
        },
        run: () => {
          const param = {
            sn: scope.row.sn,
            name: scope.row.name
          }
          this.$router.push({ path: `/transformComp/${encodeURIComponent(JSON.stringify(param))}` })
        }
      }
      METHODS[type]()
    },
    btnsHandler(type) {
      const METHODS = {
        add: () => {
          this.formComp.show = true
        },
        del: () => {
          const sns = this.table.selection.map(s => s.sn)
          sns.length && this.delRows(sns)
        }
      }
      METHODS[type]()
    },
    selectionChange(selection) {
      this.table.selection = selection
    },
    delRows(sn = []) {
      this.$confirm('确认删除当前数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.dataComparison.delCalc({
          sn: sn.join(',')
        }).then(s => {
          this.$refs.table.clearSelection()
          this.getPage({})
          this.$message.success('删除成功！')
        }).catch(e => this.$message.error(e.message))
      }).catch(e => e)
    },
    getPage({ page, size }) {
      this.table.loading = true
      this.$api.dataComparison.getCalcDatas({
        page: page || this.table.page,
        size: size || this.table.size
      }).then(s => {
        this.table.data = s.data?.records || []
        this.table.total = s.data?.total || 0
        this.table.loading = false
      }).catch(e => {
        this.table.loading = false
        this.$method.error(e.message)
      })
    },
    getTop() {
      this.middleDragTop = this.$refs.leftWorkbench.$el.offsetHeight / 2
    },
    move(x) {
      if (x < 300) x = 300
      else if (x > 800) x = 800
      this.width = x
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
