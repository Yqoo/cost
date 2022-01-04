<template>
  <div style="height: 100%">
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item name="xmTable">
        <span slot="title" class="el-collapse-item__hearde">
          档案数据
        </span>
        <div class="xmTable">
          <div style="margin: 0 0 5px 10px;">
            <el-button
              type="text"
              size="small"
              style="margin-top: 8px"
              @click="showDataList = !showDataList"
            >
              数据列表
              <i :class="{
                'el-icon-d-arrow-left': showDataList,
                'el-icon-d-arrow-right': !showDataList,
                // 'el-icon--right': true
              }"
              />
            </el-button>
          </div>
          <div class="main">
            <div v-show="tree.data.length" v-if="showDataList" class="left">
              <Tree
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
            </div>
            <div
              :class="{
                boxOne: true,
                inbox: tree.data.length || showDataList,
                inbox2: !tree.data.length || !showDataList
              }"
            >
              <div class="title">
                <p style="padding-right: 5px">
                  <el-button size="mini" @click="tableRowHandler('xmadd')">
                    添加
                  </el-button>
                  <el-button size="mini" @click="tableRowHandler('volumeSet')">
                    批量设置上级
                  </el-button>
                  <el-button size="mini" @click="tableRowHandler('xmdels')">
                    删除
                  </el-button>
                </p>
              </div>
              <el-table
                ref="table"
                v-waiting="table.loading"
                class="table-fixed"
                :data="table.data"
                size="mini"
                style="width: 100%"
                :row-key="getRowKey"
                height="85%"
                highlight-current-row
                border
                :header-cell-style="{ 'text-align': 'left' }"
                :row-class-name="tableRowClassName"
                @selection-change="xmSelectChange"
                @row-click="rowClick"
              >
                <template slot="empty">
                  <div style="height:92px;line-height:92px;">
                    选择项目后再进行档案填充
                  </div>
                </template>
                <el-table-column type="selection" width="50" reserve-selection />
                <el-table-column type="index" label="序号" align="center" width="50">
                  <template slot-scope="scope">
                    <span style="display: inline-block; margin-top: 14px">{{ scope.$index+1 }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="报表项目编码" prop="sn">
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.sn"
                      class="printInput"
                      placeholder="请输入编码"
                      size="mini"
                      @blur="tableRowHandler('sn', scope)"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="报表项目名称" prop="name">
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.name"
                      placeholder="请输入名称"
                      size="mini"
                      class="printInput"
                      @blur="tableRowHandler('name', scope)"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="上级编码" prop="pid">
                  <template slot-scope="scope">
                    <Treeselect
                      v-model="scope.row.pid"
                      :multiple="false"
                      :clearable="false"
                      :options="higherupData"
                      :normalizer="normalizer"
                      placeholder="请选择上级"
                      open-on-focus
                      @input="inputValue"
                      @open="getHigherup(scope.row)"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="关联档案公式" show-overflow-tooltip prop="dataFormulaShow">
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.dataFormulaShow"
                      placeholder="请输入档案公式"
                      size="mini"
                      class="printInput"
                      :disabled="disabled"
                      @focus="tableRowHandler('dataFormulaShow', scope)"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="关联档案" align="center" prop="">
                  <template slot-scope="scope">
                    <span style="display: inline-block; margin-top: 14px;">{{ scope.row.xmDossierName }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="80">
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      size="small"
                      icon="el-icon-delete"
                      title="删除"
                      style="margin-top: 8px"
                      @click="tableRowHandler('xmdel', scope)"
                    />
                  </template>
                </el-table-column>
              </el-table>
              <Pagination
                slot="page"
                class="pagination"
                :amount="table.total"
                :page-size="table.size"
                :current-page="table.page"
                @handleSizeChange="val => table.size = val"
                @handleCurrentChange="val => table.page = val"
              />
            </div>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item name="ldTable">
        <span slot="title" class="el-collapse-item__hearde">
          量度
        </span>
        <div class="inbox box-tow">
          <el-table
            ref="ldTable"
            v-waiting="ldTable.loading"
            class="elTabl table-fixed"
            :data="ldTable.data"
            size="mini"
            :row-key="getRowKey"
            style="width: 100%"
            highlight-current-row
            height="100%"
            border
            :header-cell-style="{ 'text-align': 'left' }"
          >
            <template slot="empty">
              <div style="height:92px;line-height:92px;">
                点击项目档案获取数据
              </div>
            </template>
            <el-table-column type="selection" width="50" reserve-selection />
            <el-table-column type="index" label="序号" width="50" />
            <el-table-column label="量度" prop="measure" width="250" />
            <el-table-column label="函数" prop="dataFormula">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.dataFormula"
                  type="textarea"
                  :rows="3"
                  size="mini"
                  @blur="tableRowHandler('hsFunction', scope)"
                />
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-collapse-item>
    </el-collapse>
    <gl-comp
      :show.sync="gl.show"
      :row="gl.row"
      :uid="xmId"
      :disabled="disabled"
      :tree-data="tree.data"
      @refreshTable="refreshTable"
      @close="close"
    />
    <Higherup
      v-if="higherup.show"
      :show.sync="higherup.show"
      :data="table.selectChecked"
      :xm-id="dossierId"
      @refreshTable="refreshTable"
    />
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  components: {
    glComp: () => import('./glComp'),
    Higherup: () => import('../dialog/higherup'),
    Treeselect
  },
  props: {
    xmId: {
      type: String,
      default: ''
    },
    freshTime: {
      type: String,
      default: ''
    },
    dossierCheck: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      showDataList: true,
      tree: {
        loading: false,
        data: []
      },
      higherupData: [], // 上级编码下拉数据
      activeName: 'xmTable',
      disabled: false, // 关联档案公式状态
      gl: {
        show: false,
        row: {}
      },
      table: {
        id: '',
        data: [],
        row: {},
        selectChecked: [],
        loading: false,
        total: 0,
        size: 200,
        page: 1
      },
      ldTable: {
        data: [],
        loading: false,
        selectChecked: []
      },
      targetNode: {},
      dossierId: '',
      higherup: { // 批量设置上级
        show: false
      },
      row: {}
    }
  },
  computed: {
    pageAndSize() {
      const { page, size } = this.table
      return { page, size }
    }
  },
  watch: {
    pageAndSize({ page, size }) {
      this.getDossierTableData({ dossierDataId: this.dossierId, page, size })
    },
    targetNode: { // 上级树节点信息
      immediate: true,
      handler(val) {
        if (Object.keys(val).length) {
          // this.getTable(val.id)
        }
      }
    },
    xmId: {
      immediate: true,
      handler(val) {
        if (val) {
          this.dossierId = val
          this.getdasjData({ id: val })
        }
      }
    },
    freshTime: {
      immediate: true,
      handler(val) {
        if (val) {
          this.refreshTable()
        }
      }
    }
  },
  // updated() {
  //   this.$nextTick(() => {
  //     this.$refs.table.doLayout()
  //   })
  // },
  methods: {
    getHigherupData({ xmId, dossierDataId }) {
      this.$api.reportxm.getHigherup({
        xmId,
        dossierDataId
      }).then(s => {
        this.higherupData = [...s.data]
      }).catch(e => this.$message.error(e.message))
    },
    getHigherup(item) {
      this.table.row = { ...item }
      if (item) this.getHigherupData({ xmId: this.xmId, dossierDataId: item.id })
    },
    normalizer(node) { // treeSelect组件数据重组
      if (node.children && !node.children.length) {
        delete node.children
      }
      if (node.children == null || node.children === 'null') {
        delete node.children
      }
    },
    tableRowClassName({ row, rowIndex }) {
      return 'proof-table'
    },
    getdasjData({ id = '', page = 1, size = 200 }) { // 通过报表项目id项目选项档案数据
      this.tree.loading = true
      this.$api.reportxm.getDASJ({
        xmId: id,
        page: page || this.table.page,
        size: size || this.table.size
      }).then(s => {
        this.tree.data = [...s.data.tree]
        this.higherupData = [...s.data.tree]
        this.table.data = s.data.page.records.map(l => ({
          ...l,
          pid: l.pid || null
        }))
        this.table.total = s.data.total
        this.tree.loading = false
      }).catch(e => {
        this.tree.loading = false
        this.$message.error(e.message)
      })
    },
    setTargetNode(node) { // 树节点点击
      this.targetNode = { ...node }
    },
    inputValue(val) { // treeSelect事件
      if (this.table.row.sn) {
        this.table.row.pid = val
        this.$api.reportxm.editDossierData(this.table.row).then(s => {
          this.getdasjData({ id: this.dossierId })
        }).catch(e => this.$message.error(e.message))
      } this.$message.warning('请先设置报表项目编码')
    },
    close() {
      this.disabled = false
    },
    rowClick(row) {
      this.row = { ...row }
      this.table.id = row.id
      this.getLDTable(row.id)
    },
    getLDTable(id) { // 获取量度table
      this.ldTable.loading = true
      this.$api.reportxm.getLDTable({ id }).then(s => {
        this.ldTable.data = [...s.data]
        this.ldTable.loading = false
      }).catch(e => {
        this.$message.error(e.message)
        this.ldTable.loading = false
      })
    },
    refreshTable() {
      this.disabled = false
      this.getdasjData({ id: this.dossierId })
      this.$refs.table.clearSelection()
      this.getLDTable(this.gl.row.id)
    },
    getTable(val) { // 获取档案列表
      if (val) this.getDossierTableData({ dossierDataId: val })
      else if (val === '') this.table.data = []
    },
    getDossierTableData({
      xmId, dossierDataId, page = 1, size = 200
    }) { // 获取档案列表
      this.table.loading = true
      this.$api.reportxm.getDASJData({
        dossierDataId,
        xmId: this.xmId,
        page: page || this.table.page,
        size: size || this.table.size
      }).then(s => {
        this.table.data = s.data.records
        this.table.total = s.data.total
        this.table.loading = false
      }).catch(e => {
        this.$message.error(e.message)
        this.table.loading = false
      })
    },
    xmSelectChange(select) {
      this.table.selectChecked = [...select]
    },
    tableRowHandler(type, scope) { // table操作栏事件
      const Deal = {
        volumeSet: () => {
          if (this.table.selectChecked.length) {
            const IDS = this.table.selectChecked.map(s => s.id)
            if (IDS.includes('' || undefined)) this.$message.warning('含有报表项目编码为空的数据，请先设置报表项目编码')
            else if (IDS.length) this.higherup.show = true
          } else this.$message.warning('请先选择要设置的数据')
        },
        xmadd: () => {
          if (this.xmId) {
            this.$set(this.table.data, this.table.data.length, {
              sn: '',
              name: '',
              xmDossierId: '',
              xmId: this.xmId,
              dataFormula: '',
              dataFormulaShow: '',
              xmDossierName: '',
              dataFormulaShowQt: '',
              pid: null
            })
          } else this.$message.warning('请先选择左边项目或选择档案')
        },
        xmdel: () => {
          if (scope.row.id) {
            this.del([scope.row.id])
          } else {
            this.table.data.splice(scope.$index, 1)
          }
        },
        xmdels: () => {
          const IDS = []
          if (this.table.selectChecked.length) {
            this.table.selectChecked.forEach(s => {
              if (s.id) {
                IDS.push(s.id)
                this.del(IDS)
              } else {
                for (let i = 0, len = this.table.data.length; i < len; i++) {
                  if (s.sn === this.table.data[i].sn) {
                    this.table.data.splice(i, 1)
                    // this.$refs.table.clearSelection()
                    break
                  }
                }
              }
            })
          } else this.$message.warning('请先选择要删除的数据')
        },
        sn: () => {
          if (!scope.row.sn) this.$message.warning('报表项目编码不能为空')
          else if (!scope.row.id && scope.row.sn) {
            this.$api.reportxm.addDossierData(scope.row).then(s => {
              this.getdasjData({ id: this.dossierId })
            }).catch(e => this.$message.error(e.message))
          } else if (scope.row.id && scope.row.sn) {
            this.$api.reportxm.editDossierData(scope.row).then(s => {
              this.getdasjData({ id: this.dossierId })
            }).catch(e => this.$message.error(e.message))
          }
        },
        name: () => {
          if (!scope.row.sn) this.$message.warning('报表项目编码不能为空')
          else if (scope.row.sn && scope.row.name && scope.row.id) {
            this.$api.reportxm.editDossierData(scope.row).then(s => {
              this.getdasjData({ id: this.dossierId })
            }).catch(e => this.$message.error(e.message))
          }
        },
        dataFormulaShow: () => {
          if (scope.row.sn) {
            this.disabled = false // 禁用原因
            this.gl.show = true
            this.gl.row = { ...scope.row }
          } else this.$message.warning('报表项目编码不能为空')
        },
        hsFunction: () => {
          const formData = new FormData()
          formData.append('id', scope.row.id)
          formData.append('dataFormula', scope.row.dataFormula)
          this.$http.post('/bbDossierDataController/updateBbMeasureFormula', formData).then(s => {
            this.getLDTable(this.table.id)
          }).catch(e => this.$message.error(e.message))
        }
      }
      Deal[type]()
    },
    del(id) {
      this.$confirm('当前操作将会删除选中数据，是否继续？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.reportxm.delDossierData({
          id: id.join(',')
        }).then(res => {
          this.$message.success('删除成功')
          this.getdasjData({ id: this.dossierId })
          this.$refs.table.clearSelection()
          this.ldTable.data = []
        }).catch(e => this.$message.error(e.message))
      }).catch(e => e)
    },
    getRowKey(row) {
      return row.id
    }
  }
}
</script>
<style lang="scss" scope>
.el-table .cell {
  padding: 0px;
}
/deep/ .el-table--mini td, .el-table--mini th {
    padding: 0;
}
.el-collapse-item {
  &__header {
    padding-left: 10px;
    height: 36px;
    color: #4390de;
  }
}
.main {
  display: flex;
  width: 100%;
  .left {
    width: 300px;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-right: 10px;
  }
  .inbox {
    border: 1px solid #ddd;
    border-radius: 5px;
    width: calc(100% - 300px);
  }
  .inbox2 {
    border: 1px solid #ddd;
    border-radius: 5px;
    width: 100%;
    height: calc(100vh - 40vh);
  }
}
.boxOne {
  .title {
    float: right;
    line-height: 40px;
    padding-left: 10px;
    .span {
      display: inline-block;
      width: 50px;
      text-align: center;
      color: #4390de;
      border-bottom: 2px solid #4390de;
    }

  }
}
.table-fixed {
  /deep/ .el-table__fixed-right {
    height: 100% !important; //设置高优先，以覆盖内联样式
  }
  /deep/ .el-table__fixed {
    height: 100% !important; //设置高优先，以覆盖内联样式
  }
}
.inbox {
  height: calc(100vh - 40vh);
}
.vue-treeselect {
  position: absolute!important;
  top: 8px;
  left: 3px;
}
</style>
