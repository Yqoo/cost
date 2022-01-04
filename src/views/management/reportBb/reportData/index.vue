<template>
  <div class="reportData">
    <LeftWorkbench ref="leftWorkbench" :width="width" :additional="0" class="left" title="报表分类">
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
        @setTargetNode="setTargetNode"
      />
    </LeftWorkbench>
    <MiddleDrag :margin-top="middleDragTop" @hook:mounted="getTop" @move="move" />
    <RightWorkbench :margin-left="width" class="right" :additional="0">
      <ToolsBar slot="toolsBar" :items="btns" class="toolsBar" module-name="ReportData" @btnsHandler="btnsHandler" />
      <div slot="table" class="card">
        <el-card
          v-for="item in card.data"
          :key="item.id"
          shadow="hover"
          :class="{ borderStyle: item.borderStyle }"
          @dblclick.native="dblclick(item)"
        >
          <div class="conent" @click="cardClick('choose', item)">
            <div class="left">
              <p class="image">
                <img :src="require('@/assets/images/middleImg/bbsj.png')" alt="">
              </p>
            </div>
            <p class="right">
              <span class="time">({{ item.createTime }})</span>
              <span v-for="k in apiCard" :key="k.id">
                <i
                  :class="k.icon"
                  :title="k.title"
                  :style="k.style"
                  @click="cardClick(k.id, item)"
                />
              </span>
            </p>
          </div>
          <p class="footer">
            <span class="font">
              {{ item.name }}
            </span>
          </p>
        </el-card>
      </div>
      <!-- <Table
        ref="table"
        slot="table"
        v-waiting="table.loading"
        number
        :data="table.data"
        :columns="columns"
        :multiple="true"
        :search="false"
        @select="select"
        @dblclick="dblclick"
      />
      <Pagination
        slot="page"
        class="pagination"
        :amount="table.total"
        :page-size="table.size"
        :current-page="table.page"
        @handleSizeChange="(val) => (table.size = val)"
        @handleCurrentChange="(val) => (table.page = val)"
      /> -->
    </RightWorkbench>
    <ChangeBbsj v-if="changeBbsj.show" :show.sync="changeBbsj.show" :usn="changeBbsj.usn" @refreshBbsj="refreshBbsj" />
    <ShowBb v-if="showBb.show" :show.sync="showBb.show" :info="showBb.info" />
  </div>
</template>

<script>
export default {
  name: 'ReportData',
  components: {
    ChangeBbsj: () => import('./dialog/changeBbsj'),
    ShowBb: () => import('./dialog/showBb')
  },
  data() {
    return {
      handsonTable: {
        params: {}
      },
      width: 300,
      middleDragTop: this.width,
      tree: {
        loading: false,
        data: []
      },
      table: {
        data: [],
        loading: false,
        selcetion: [],
        total: 0,
        size: 10,
        page: 1
      },
      nodeObj: {},
      changeBbsj: { // 修改报表数据
        show: false,
        usn: ''
      },
      showBb: {
        show: false,
        info: {}
      },
      card: {
        data: []
      }
    }
  },
  computed: {
    apiCard() {
      const { apis } = this
      const bs = [
        {
          id: 'del',
          icon: 'el-icon-circle-close',
          title: '删除',
          style: 'color: #E78686',
          api: '/bbReportFormsDataController/delete'
        }
      ]
      return bs.filter(b => apis.includes(b.api))
    },
    pageAndSize() {
      const { page, size } = this.table
      return { page, size }
    },
    apis() {
      return this.$tools.getModuleAPIS('ReportData')
    },
    btns() {
      return [
        { method: 'open', name: '打开' },
        { method: 'del', name: '删除', api: '/bbReportFormsDataController/delete' },
        { method: 'educe', name: '导出', api: '/bbReportFormsController/reportExcel' }
      ]
    },
    columns() {
      return [
        { label: '报表名称', prop: 'name' },
        { label: '报表编码', prop: 'sn' },
        { label: '会计年度', prop: 'kjnd' },
        { label: '会计期间', prop: 'kjqj' },
        { label: '单位', prop: 'unitName' },
        { label: '报表创建人', prop: 'createUserName' },
        { label: '创建时间', prop: 'createTime' },
        { label: '外部导入', prop: 'outsideImport' },
        { label: '备注', prop: 'desc_' }
      ]
    }
  },
  watch: {
    nodeObj(val) {
      if (Object.keys(val).length) {
        this.getbbsj({ flId: val.id, type: val.icon })
      }
    },
    pageAndSize({ page, size }) {
      this.getbbsj({
        page,
        size,
        flId: Object.keys(this.nodeObj).length ? this.nodeObj.id : '',
        type: Object.keys(this.nodeObj).length ? this.nodeObj.icon : 'fl'
      })
    }
  },
  created() {
    this.getTree()
    this.getbbsj({})
  },
  methods: {
    cardClick(type, data) {
      console.log(type, data)
      const DEAL = {
        choose: () => {
          this.card.data.forEach(l => {
            if (l.id === data.id) {
              data.borderStyle = true
            } else l.borderStyle = false
          })
        },
        share: () => {},
        count: () => {},
        del: () => {
          this.del(data.id)
        }
      }
      DEAL[type]()
    },
    dblclick(item) {
      // this.$router.push({
      //   name: 'ReportPage',
      //   params: { ...item }
      // })
      if (item) {
        Object.assign(this.showBb, {
          show: true,
          info: { ...item }
        })
      }
    },
    refreshBbsj() {
      this.getbbsj({})
    },
    getTree() { // 获取左侧树
      this.tree.loading = true
      this.$api.reportDesign.getTree().then(s => {
        this.tree.data = [...s.data]
        this.tree.loading = false
      }).catch(e => {
        this.tree.loading = false
        this.$message.error(e.message)
      })
    },
    getbbsj({ // 获取报表数据
      page = 1, size = 10, flId = '', type = 'fl', ztsn
    }) {
      const localAcset = JSON.parse(localStorage.getItem('startZT'))
      this.table.loading = true
      this.$api.reportDesign.getbbsj({
        page,
        size,
        flId,
        type,
        ztsn: localAcset.ztsn
      }).then(s => {
        const { records, total } = s.data
        this.table.total = total
        this.table.data = [...records]
        this.table.data.forEach(l => {
          l.createTime = this.$tools.timestamp(new Date(l.createTime), 'YYYY-MM-DD')
          l.outsideImport = l.outsideImport ? '是' : '否'
        })
        this.card.data = this.table.data.map(l => ({
          ...l,
          borderStyle: false
        }))
        this.table.loading = false
      }).catch(e => {
        this.$message.error(e.message)
        this.table.loading = false
      })
    },
    btnsHandler(met) {
      const crad = this.card.data.filter(l => l.borderStyle)
      const DEAL = {
        // edit: () => {
        //   if (this.table.selcetion.length !== 0 && this.table.selcetion.length !== 1) {
        //     this.$message.warning('只能修改单条数据')
        //   } else if (this.table.selcetion.length === 0) {
        //     this.$message.warning('请选择要修改的数据')
        //   } else if (this.table.selcetion.length === 1) {
        //     this.changeBbsj.show = true
        //     this.changeBbsj.usn = this.table.selcetion[0].id
        //   }
        // },
        del: () => {
          if (crad.length === 0) this.$message.warning('请选择要删除的数据')
          else {
            this.del(crad[0].id)
          }
        },
        open: () => {
          if (crad[0]) this.dblclick()
          else this.$message.warning('请先选择要打开的报表数据！')
        },
        educe: () => {
          if (crad[0]) {
            const { id, name } = crad[0]
            this.$api.reportDesign.getSjDesc({ id }).then(s => {
              const { data } = s.data
              const params = {
                id, data
              }
              this.$tools.downloadWithToken('/bbReportFormsController/reportExcel', {
                type: 'xls',
                ...params
              }, `${name}.xls`, 'POST')
            })
          } else this.$message.warning('请先选择要导出的报表数据！')
        }

      }
      DEAL[met]()
    },
    getInfo(id) {
      const { params } = this.handsonTable
      this.$api.reportDesign.getSjDesc({ id }).then(s => {
        const { data } = s.data
        Object.assign(params, {
          id,
          data
        })
      })
      return params
    },
    del(id) {
      this.$confirm('是否要删除已选中的数据', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.reportDesign.delBbsj({ id }).then(s => {
          this.$message.success('删除成功')
          this.getbbsj({})
        }).catch(e => this.$message.error(e.message))
      }).catch(e => e)
    },
    select(select) {
      this.table.selcetion = [...select]
    },
    setTargetNode(node) {
      this.nodeObj = { ...node }
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
.reportData {
  .borderStyle {
    border-color: #4390de;
  }
  .card {
    height: calc(100% - 59px);
    display: flex;
    overflow-y: auto;
    align-content: flex-start;
    flex-wrap: wrap;
    padding: 10px;
    .el-card {
      width: 237px;
      height: 120px;
      margin: 10px 10px 0 0;
      /deep/ .el-card__body {
        padding: 10px;
      }
    }
    .conent {
      display: flex;
      cursor: pointer;
      .left {
        margin-right: 10px;
        .image {
          img {
            width: 80px;
            height: 70px;
          }
        }
      }
      .right {
        display: flex;
        align-items: center;
        justify-content: center;
        i {
          margin-left: 5px;
          font-size: 14px;
        }
      }
    }
    .footer {
      .font {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        padding: 0 4px;
      }
    }
  }
}
</style>
