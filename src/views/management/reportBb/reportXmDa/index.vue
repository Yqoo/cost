<template>
  <div>
    <ToolsBar
      :items="btns"
      show-zd
      @btnsHandler="btnsHandler"
      @hybbChange="hybbChange"
    >
      <!-- <el-select
        slot="other"
        v-model="dossierCheck"
        multiple
        placeholder="请选择档案"
        size="mini"
        style="width:100%"
        @change="command"
      >
        <el-option
          v-for="item in dTree.data"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select> -->
    </ToolsBar>
    <LeftWorkbench ref="leftWorkbench" :width="width" title="报表项目" class="left" :additional="35">
      <Tree
        slot="tree"
        ref="tree"
        v-waiting="tree.loading"
        search
        :data="tree.data"
        :node-props="{
          children: 'children',
          label: 'label'
        }"
        default-expand-all
        :default-expanded-keys="tree.focusId"
        @setTargetNode="setTargetNode"
      />
    </LeftWorkbench>
    <MiddleDrag :margin-top="middleDragTop" @hook:mounted="getTop" @move="move" />
    <RightWorkbench :margin-left="width" class="right" :additional="35">
      <table-comp
        slot="table"
        :dossier-id="dossierIds"
        :xm-id="xmId"
        :data="dTree.data"
        :fresh-time="freshTime"
      />
    </Rightworkbench>
    <select-file
      :show.sync="sf.show"
      :xm-id="xmId"
      :hybb="hybb"
      :kjzd="kjzd"
      :formula="sf.formula"
      @refresh="refresh"
    />
  </div>
</template>

<script>

import tableComp from './components/table'
import selectFile from './dialog/selectFile'

export default {
  name: 'ReportXmDa',
  components: {
    tableComp,
    selectFile
  },
  data() {
    return {
      dossierCheck: [],
      kjzd: '',
      hybb: '',
      width: 300,
      middleDragTop: this.width,
      tree: {
        loading: false,
        data: [],
        targetNode: {}
      },
      dossier: {
        loading: false,
        data: [],
        size: 200,
        page: 1,
        totol: 0,
        columns: []
      },
      measurement: {
        loading: false,
        data: [],
        columns: [
          { label: '量度', prop: 'measure_name_' },
          { label: '函数', prop: 'hs_name_' }
        ]
      },
      dTree: {
        data: [],
        dossierId: ''
      },
      dossierIds: '', // 关联档案id
      xmId: '', // 项目id
      sf: { // 选择档案数据
        show: false,
        formula: ''
      },
      freshTime: ''
    }
  },
  computed: {
    apis() {
      return this.$tools.getModuleAPIS('ReportXmDa')
    },
    dossierId() {
      const { dossierId } = this.dTree
      return dossierId
    },
    zdAndHybb() {
      const { kjzd, hybb } = this
      return { kjzd, hybb }
    },
    pageAndSize() {
      const { page, size } = this.dossier
      return { page, size }
    },
    btns() {
      const { targetNode } = this.tree
      const { apis } = this
      const b = [
        {
          method: 'choose',
          name: '选择档案',
          icon: 'el-icon-circle-plus-outline',
          api: '/bbDossierDataController/addDossierData'
        }
      ]
      return b.filter(l => apis.includes(l.api))
    }
  },
  watch: {
    // eslint-disable-next-line object-shorthand
    'tree.targetNode.id'(id) {
      if (id) {
        this.xmId = id
        this.dossier.data = []
        this.dossier.columns = []
        this.dossierCheck = []
        this.getTree(id)
      }
    },
    pageAndSize({ page, size }) {
      this.getDossierTableData({ dossierId: this.dTree.dossierId, page, size })
    },
    zdAndHybb({ kjzd, hybb }) {
      this.initData()
      this.dossierTree({ kjzd, hybb })
    }
  },
  methods: {
    // command(arr) {
    //   this.dossierCheck = [...arr]
    //   this.dossierIds = arr.join(',')
    //   // const newArr = arr.join(',')
    //   // this.getDossierTable(newArr)
    // },
    refresh() {
      this.freshTime = new Date().getTime().toString()
    },
    btnsHandler(type) {
      const METHODS = {
        choose: () => { // 选择档案
          this.sf.show = true
          this.sf.formula = false
        }
      }
      METHODS[type]()
    },
    hybbChange(obj) {
      const { kjzd, hybb } = obj
      this.kjzd = kjzd
      this.hybb = hybb
    },
    async getDossierTable(dossierId) {
      this.dossier.loading = true
      // await this.getDossierHeaders(dossierId)
      await this.getDossierTableData({ dossierId, page: this.dossier.page, size: this.dossier.size })
      this.dossier.loading = false
    },
    // getDossierHeaders(dossierId) {
    //   this.$api.reportxm.getDossierHeaders({ dossierId }).then(s => {
    //     this.dossier.columns = Array.isArray(s.data) ? s.data.map(item => ({
    //       label: item.title,
    //       prop: item.name,
    //       type: item.type
    //     })) : []
    //   }).catch(e => {
    //     this.dossier.loading = false
    //     this.$message.error(e.message)
    //   })
    // },
    getDossierTableData({ dossierId, page, size }) {
      this.$api.reportxm.getDossierData({
        dossierId,
        page,
        size
      }).then(s => {
        this.dossier.data = s.data.records
        this.dossier.total = s.data.total
      }).catch(e => {
        this.$message.error(e.message)
        this.dossier.loading = false
      })
    },
    setTargetNode(node) {
      if (node.disabled) {
        this.tree.targetNode = { ...node }
        this.getMeasurement(node.id)
      } else this.$message.warning('当前节点无法使用！')
    },
    getMeasurement(id) {
      this.measurement.loading = true
      // this.$api.reportxm.getMeasurement({ xmId: id }).then(s => {
      //   this.measurement.data = s.data
      //   this.measurement.loading = false
      // }).catch(e => {
      //   this.measurement.loading = false
      //   this.$message.error(e.message)
      // })
    },
    dossierTree({ kjzd, hybb }) {
      this.tree.loading = true
      this.$api.reportxm.dossierTree({ kjzd, hybb }).then(s => {
        this.tree.data = s.data
        this.tree.loading = false
      }).catch(e => {
        this.tree.loading = false
        this.$message.error(e.message)
      })
    },
    initData() {
      this.dossier.data = []
      this.dossier.columns = []
      this.measurement.data = []
      this.dTree.id = ''
      this.dTree.dossierId = ''
    },
    getTree(id) {
      if (id) {
        this.$api.reportxm.getDtree({ xmId: id }).then(s => {
          this.dTree.data = s.data
        }).catch(e => {
          this.$message.error(e.message)
        })
      }
    },
    getRowKey(row) {
      return row.id
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
  .left {
    margin-top: 10px;
    height: calc(99% - 45px);
  }
  .right {
    overflow-y: auto;
    .box {
      height: 100%;
      .inbox {
        height: 50%;
        .el-table {
          height: 100%;
        }
      }
    }
    .title {
      line-height: 40px;
      padding-left: 10px;
      span {
        display: inline-block;
        width: 50px;
        text-align: center;
        color: #4390de;
        border-bottom: 2px solid #4390de;
      }
    }
  }
</style>
