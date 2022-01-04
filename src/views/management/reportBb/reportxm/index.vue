<template>
  <div>
    <ToolsBar
      :items="btns"
      show-zd
      module-name="Reportxm"
      @btnsHandler="btnsHandler"
      @hybbChange="hybbChange"
    />
    <LeftWorkbench ref="leftWorkbench" :width="width" title="报表项目体系" class="left" :additional="35">
      <el-button
        v-if="apis.includes('/bbReportTxController/add')"
        slot="addUnit"
        class="el-icon-plus"
        style="padding:0"
        size="mini"
        type="text"
        @click="addUnit"
      />
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
        :rightmenus="rightmenus"
        @update:rightmenus="rightmenusHandler"
        @setTargetNode="setTargetNode"
      />
    </LeftWorkbench>
    <MiddleDrag :margin-top="middleDragTop" @hook:mounted="getTop" @move="move" />
    <RightWorkbench :margin-left="width" class="right" :additional="35">
      <div slot="table" class="tableOne">
        <Search :show-icon="true" class="search" :content.sync="content" @search="searchData">
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
          ref="xmtable"
          v-waiting="table.loading"
          class="elTabl"
          :data="table.data"
          size="mini"
          style="width: 100%"
          height="calc(99% - 80px)"
          :row-key="getRowKey"
          :highlight-current-row="true"
          border
          align="center"
          @selection-change="selectChange"
          @row-click="rowClick"
        >
          <template slot="empty">
            <div style="height:92px;line-height:92px;">
              请点击左侧单位树获取数据
            </div>
          </template>
          <el-table-column type="selection" width="50" reserve-selection />
          <el-table-column type="index" label="序号" width="50" align="center" />
          <el-table-column label="名称" prop="name" :show-overflow-tooltip="true" />
          <el-table-column label="代码" prop="sn" :show-overflow-tooltip="true" />
          <el-table-column label="助记码" prop="zjm" :show-overflow-tooltip="true" />
          <el-table-column label="体系" prop="xmtxId" />
          <el-table-column label="是否启用" prop="syzt">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.syzt"
                inactive-text="否"
                active-text="是"
                active-color="#4390ee"
                @change="changeStatu(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="关联档案" prop="dossiers" />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                v-if="apis.includes('/bbReportXmController/update')"
                type="text"
                size="small"
                icon="el-icon-edit-outline"
                title="编辑"
                @click="tableRowHandler('edit', scope)"
              />
              <el-button
                v-if="apis.includes('/bbReportXmController/delete')"
                type="text"
                size="small"
                icon="el-icon-delete"
                title="删除"
                @click="tableRowHandler('del', scope)"
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
      <div slot="grid" class="tableTwo">
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px">
          <p>
            <span
              :class="{ wdStyle: wd }"
              style="cursor: pointer; margin: 0 10px; font-size: 14px; display: inline-block; padding: 5px;"
              @click="checkTable('wd')"
            >
              维度
            </span>
            <span
              :class="{ wdStyle: ld }"
              style="cursor: pointer; font-size: 14px; display: inline-block; padding: 5px;"
              @click="checkTable('ld')"
            >
              量度
            </span>
            <span
              v-if="wdTable.dataTypeData.length"
              :class="{ wdStyle: dataType }"
              style="cursor: pointer; font-size: 14px; display: inline-block; padding: 5px; margin-left: 10px"
              @click="checkTable('dataType')"
            >
              数据类型
            </span>
          </p>
          <p style="padding-right: 5px">
            <el-button
              v-if="apis.includes('/bbReportXmController/updateDimension')"
              size="mini"
              @click="tableRowHandler('save')"
            >
              保存
            </el-button>
            <el-button
              v-if="apis.includes('/bbReportXmController/updateDimension')"
              size="mini"
              @click="tableRowHandler('wddels')"
            >
              删除
            </el-button>
          </p>
        </div>
        <el-table
          ref="wdtable"
          v-waiting="wdTable.loading"
          class="table-fixed"
          :data="wd ? wdTable.wdData : (ld ? wdTable.ldData : (dataType ? wdTable.filterDataType : []))"
          size="mini"
          style="width: 100%"
          height="calc(99% - 30px - 40%)"
          :row-key="getRowKey"
          :highlight-current-row="true"
          border
          align="center"
          @selection-change="wdselectChange"
        >
          <template slot="empty">
            <div style="height:92px;line-height:92px;">
              请点击上面报表获取数据
            </div>
          </template>
          <el-table-column type="selection" width="50" fixed="left" reserve-selection />
          <div v-if="wd">
            <el-table-column label="维度" prop="dimension_id_">
              <template slot-scope="scope">
                <el-select
                  ref="wdSelect"
                  v-model="scope.row.dimension_id_"
                  allow-create
                  filterable
                  placeholder="请选择维度"
                  size="mini"
                >
                  <el-option
                    v-for="item in wdData"
                    :key="item.id_"
                    :label="item.name_"
                    :value="`${'sys_@'}${item.id_}`"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="函数" prop="hs_id_">
              <template slot-scope="scope">
                <el-select v-model="scope.row.hs_id_" placeholder="请选择" size="mini" @change="getCs(scope.row)">
                  <el-option
                    v-for="item in functionData"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="参数" prop="hs_param_ids_">
              <template slot-scope="scope">
                <el-select v-model="scope.row.hs_param_ids_" placeholder="请选择" size="mini">
                  <el-option
                    v-for="item in csData"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </template>
            </el-table-column>
          </div>
          <div v-if="ld">
            <el-table-column label="量度" prop="measure_name_">
              <template slot-scope="scope">
                <el-input v-model="scope.row.measure_name_" placeholder="请输入量度名称" size="mini" />
              </template>
            </el-table-column>
            <el-table-column label="关联档案" prop="xm_dossier_id_">
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.xm_dossier_id_"
                  placeholder="请选择"
                  size="mini"
                  @change="getldCS(scope.row)"
                >
                  <el-option
                    v-for="item in dossierData"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="函数" prop="hs_id_">
              <template slot-scope="scope">
                <el-select v-model="scope.row.hs_id_" placeholder="请选择" size="mini" @change="getldHs(scope.row)">
                  <el-option
                    v-for="item in ldfunctionData"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="返回值" prop="hs_return_data_">
              <template slot-scope="scope">
                <el-select v-model="scope.row.hs_return_data_" multiple placeholder="请选择" size="mini">
                  <el-option
                    v-for="item in fhzData"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </template>
            </el-table-column>
          </div>
          <div v-if="dataType">
            <el-table-column label="函数" prop="hsName_">
              <template slot-scope="scope">
                {{ scope.row.hsName_ }}
              </template>
            </el-table-column>
            <el-table-column label="数据类型" prop="dataType">
              <template slot-scope="scope">
                <el-select v-model="scope.row.dataType_" clearable size="mini">
                  <el-option label="记账" value="1" />
                  <el-option label="未记账" value="0" />
                </el-select>
              </template>
            </el-table-column>
          </div>
          <el-table-column v-if="!dataType" label="操作" fixed="right" width="80">
            <template slot="header">
              <span style="padding-right:10px;">操作</span>
              <el-button
                v-if="apis.includes('/bbReportXmController/updateDimension')"
                type="text"
                size="small"
                icon="el-icon-circle-plus"
                title="添加"
                @click="tableRowHandler('wdadd')"
              />
            </template>
            <template slot-scope="scope">
              <el-button
                v-if="apis.includes('/bbReportXmController/updateDimension')"
                type="text"
                size="small"
                icon="el-icon-delete"
                title="删除"
                @click="tableRowHandler('wddel', scope)"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </Rightworkbench>
    <Bbtx
      v-if="bbtx.show"
      :show.sync="bbtx.show"
      :usn="bbtx.usn"
      :hy-info="hyInfo"
      :data="tree.data"
      @refreshTree="getBbTxTree"
    />
    <Bbxm
      v-if="bbxm.show"
      :show.sync="bbxm.show"
      :usn="bbxm.usn"
      :hy-info="hyInfo"
      :data="tree.data"
      @refresh="refreshTable"
    />
    <Upload
      v-if="upload.show"
      :show.sync="upload.show"
      :action="upload.action"
      :format="['xls', 'xlsx', 'xml']"
      :params="upload.params"
      @success="uploadSuccess"
    />
  </div>
</template>

<script>
export default {
  name: 'Reportxm',
  components: {
    Bbtx: () => import('./dialog/bbtx'),
    Bbxm: () => import('./dialog/bbxm')
  },
  data() {
    return {
      xmId: '',
      wd: true,
      ld: false,
      dataType: false,
      width: 300,
      middleDragTop: this.width,
      content: '',
      wdData: [], // 维度下拉列表
      ldData: [], // 量度下拉列表
      dossierData: [], // 关联档案下拉列表
      functionData: [], // 维度函数下拉
      ldfunctionData: [], // 量度函数下拉
      csData: [],
      fhzData: [], // 量度返回值下拉
      flId: '',
      hyInfo: {
        kjzd: '',
        hybb: '',
        pName: '',
        pid: ''
      },
      tree: {
        loading: false,
        data: [],
        focusId: []
      },
      bbtx: {
        show: false,
        usn: ''
      },
      table: {
        data: [],
        loading: false,
        checkSelect: [],
        total: 0,
        page: 1,
        size: 200
      },
      wdTable: {
        wdData: [], // 维度
        ldData: [], // 量度
        dataTypeData: [], // 数据类型
        filterDataType: [], // 过滤后的数据类型数据
        checkSelect: [],
        loading: false
      },
      bbxm: {
        show: false,
        usn: ''
      },
      targetNode: {},
      obj: {},
      upload: {
        show: false,
        action: '',
        params: {}
      }
    }
  },
  computed: {
    apis() {
      return this.$tools.getModuleAPIS('Reportxm')
    },
    btns() {
      return [
        {
          method: 'add', name: '新增', icon: 'el-icon-circle-plus-outline', api: '/bbReportXmController/add'
        },
        {
          method: 'edit', name: '修改', icon: 'el-icon-circle-plus-outline', api: '/bbReportXmController/update'
        },
        {
          method: 'del', name: '删除', icon: 'el-icon-circle-plus-outline', api: '/bbReportXmController/delete'
        },
        {
          method: 'more',
          name: '更多',
          icon: 'el-icon-circle-plus-outline',
          children: [
            {
              method: 'educe', name: '导出', icon: 'el-icon-top', api: '/bbReportXmController/export'
            },
            {
              method: 'import', name: '导入', icon: 'el-icon-top', api: '/bbReportXmController/importFile'
            }
          ]
        }
      ]
    },
    pageAndSize() {
      const { page, size } = this.table
      return { page, size }
    },
    avaliableFun() {
      const wdFun = this.wdTable.wdData.map(i => i.hs_id_)
      const ldFun = this.wdTable.ldData.map(i => i.hs_id_)
      const newArr = [...wdFun, ...ldFun]
      return [...new Set(newArr)]
    }
  },
  watch: {
    // eslint-disable-next-line func-names
    'hyInfo.kjzd': function (val) {
      if (val) {
        this.getBbTxTree()
        this.getTable({})
        this.clear()
      }
    },
    // eslint-disable-next-line func-names
    'hyInfo.hybb': function (val) {
      if (val) {
        this.getBbTxTree()
        this.getTable({})
        this.clear()
      }
    },
    avaliableFun: {
      immediate: true,
      handler(val) {
        if (val && val.length) {
          const filterArr = []
          const { dataTypeData } = this.wdTable
          for (let i = 0; i < val.length; i++) {
            for (let j = 0; j < dataTypeData.length; j++) {
              if (val[i] === dataTypeData[j].hsId_) {
                this.$set(filterArr, filterArr.length, dataTypeData[j])
              }
            }
          }
          this.wdTable.filterDataType = filterArr
        } else {
          this.wdTable.filterDataType = []
        }
      }
    },
    targetNode: {
      immediate: true,
      handler(val) {
        if (Object.keys(val).length) {
          this.flId = val.id
          this.getTable({ flId: this.flId })
          this.hyInfo.pName = val.label
          this.hyInfo.pid = val.id
        }
        this.clear()
      }
    },
    pageAndSize({ page, size }) {
      if (this.flId) {
        this.getTable({
          size, page, flId: this.flId, query: this.content
        })
      }
    },
    xmId: {
      immediate: true,
      handler(val) {
        if (val) {
          this.getwdTable(val)
          if (this.dataType) {
            this.wd = true
            this.dataType = false
          }
        }
      }
    }
  },
  created() {
    this.getwdList()
  },
  updated() {
    this.$nextTick(() => {
      this.$refs.wdtable.doLayout()
    })
  },
  methods: {
    clear() { // 切换时清空效果
      this.xmId = ''
      this.wdTable.wdData = []
      this.wdTable.ldData = []
      this.wdTable.dataTypeData = []
    },
    refreshTable() {
      this.getTable({})
      this.getwdTable(this.xmId)
    },
    getCs(row) { // 获取维度参数下拉列表
      if (Array.isArray(row)) {
        row.forEach(k => {
          if (k.hs_id_) {
            this.$api.reportxm.getDacs({ hxId: k.hs_id_ }).then(s => {
              this.csData = [...s.data]
            }).catch(e => this.$message.error(e.message))
          }
        })
      } else {
        row.hs_param_ids_ = ''
        this.$api.reportxm.getDacs({ hxId: row.hs_id_ }).then(s => {
          this.csData = [...s.data]
        }).catch(e => this.$message.error(e.message))
      }
    },
    getwdList() { // 获取维度下拉列表
      this.$api.reportxm.getwdList({ ztsn: '' }).then(s => {
        this.wdData = [...s.data]
      }).catch(e => this.$message.error(e.message))
    },
    checkTable(type) { // 选择维度或者量度table
      const Check = {
        wd: () => {
          this.ld = false
          this.wd = true
          this.dataType = false
          this.getCs(this.wdTable.wdData)
          this.$refs.wdtable.clearSelection()
        },
        ld: () => {
          this.ld = true
          this.wd = false
          this.dataType = false
          this.getldCS(this.wdTable.ldData)
          this.getldHs(this.wdTable.ldData)
          this.$refs.wdtable.clearSelection()
        },
        dataType: () => {
          this.ld = false
          this.wd = false
          this.dataType = true
        }
      }
      Check[type]()
    },
    getldHs(row) { // 获取量度返回值下拉
      if (Array.isArray(row)) {
        row.forEach(el => {
          if (el.hs_id_) {
            this.$api.reportxm.getLdFHZ({ hsId: el.hs_id_ }).then(s => {
              this.fhzData = [...s.data]
            }).catch(e => this.$message.error(e.message))
          }
        })
      } else {
        this.$api.reportxm.getLdFHZ({ hsId: row.hs_id_ }).then(s => {
          this.fhzData = [...s.data]
        }).catch(e => this.$message.error(e.message))
      }
    },
    getldCS(row) { // 获取量度函数下拉
      if (Array.isArray(row)) {
        row.forEach(key => {
          if (key.xm_dossier_id_) {
            this.$api.reportxm.getLdHS({ xmId: this.xmId, dossierId: key.xm_dossier_id_ }).then(s => {
              this.ldfunctionData = [...s.data]
            }).catch(e => this.$message.error(e.message))
          }
        })
      } else {
        this.$api.reportxm.getLdHS({ xmId: this.xmId, dossierId: row.xm_dossier_id_ }).then(s => {
          this.ldfunctionData = [...s.data]
        }).catch(e => this.$message.error(e.message))
      }
    },
    wdselectChange(row) { // 维度table选中
      this.wdTable.checkSelect = [...row]
    },
    selectChange(select) { // 报表table选中数据
      this.table.checkSelect = [...select]
      if (this.table.checkSelect.length === 1) {
        this.getwdTable(this.table.checkSelect[0].id)
      }
    },
    verdictArr() { // 保存时数组判断
      const { wdData, ldData } = this.wdTable
      const result = {
        done: true,
        message: '验证成功'
      }
      if (wdData.length === [] && ldData.length === []) {
        result.done = false
        result.message = '请先添加数据'
      }
      const obj = {}
      const ldObj = {}
      const IDS = this.wdData.map(s => `${'sys_@'}${s.id_}`)
      for (let i = 0, len = wdData.length; i < len; i++) {
        if (!IDS.includes(wdData[i].dimension_id_)) {
          if (wdData[i].dimension_id_.search('sys_@') !== -1) {
            result.done = false
            result.message = `维度数据表第${i + 1}行数据含有特殊字符`
            break
          }
        }
        if (wdData[i].dimension_id_ === '' || wdData[i].hs_id_ === '' || wdData[i].hs_param_ids_ === '') {
          result.done = false
          result.message = `维度数据表第${i + 1}行数据填写不完整`
          break
        }
        if (obj[wdData[i].dimension_id_] && obj[wdData[i].hs_id_] && obj[wdData[i].hs_param_ids_]) {
          result.done = false
          result.message = `维度数据表第${i + 1}行数据填写重复`
          break
        } else {
          obj[wdData[i].dimension_id_] = true
          obj[wdData[i].hs_id_] = true
          obj[wdData[i].hs_param_ids_] = true
        }
      }
      for (let i = 0, len = ldData.length; i < len; i++) {
        if (ldData[i].measure_name_ === ''
        || ldData[i].hs_id_ === ''
        || ldData[i].xm_dossier_id_ === ''
        || ldData[i].hs_return_data_ === []) {
          result.done = false
          result.message = `量度数据表第${i + 1}行数据填写不完整`
          break
        }
        if (ldObj[ldData[i].measure_name_]) {
          result.done = false
          result.message = `量度数据表第${i + 1}行量度名称填写重复`
          break
        } else ldObj[ldData[i].measure_name_] = true
      }
      return result
    },
    tableRowHandler(type, scope) { // table操作
      const DEAL = {
        edit: () => {
          this.bbxm.usn = scope.row.id
          this.bbxm.show = true
        },
        del: () => {
          this.del([scope.row.id])
        },
        wddel: () => {
          if (this.wd) {
            this.wdTable.wdData.splice(scope.$index, 1)
          } else if (this.ld) {
            this.wdTable.ldData.splice(scope.$index, 1)
          } else if (this.dataType) {
            this.wdTable.dataTypeData.splice(scope.$index, 1)
          }
        },
        wdadd: () => {
          if (this.table.checkSelect.length > 1) {
            this.$message.warning('只能选择单条数据')
          } else if (this.table.checkSelect.length === 0 && !this.xmId) {
            this.$message.warning('请先选择报表项目数据')
          } else if (this.xmId || this.table.checkSelect.length === 1) {
            if (this.wd) {
              this.$set(this.wdTable.wdData, this.wdTable.wdData.length, {
                dimension_id_: '',
                hs_id_: '',
                hs_param_ids_: ''
              })
            } else if (this.ld) {
              this.$set(this.wdTable.ldData, this.wdTable.ldData.length, {
                id_: '',
                measure_name_: '',
                hs_id_: '',
                hs_return_data_: [],
                xm_dossier_id_: ''
              })
            }
          }
        },
        wddels: () => {
          if (this.wdTable.checkSelect.length) {
            this.wdTable.checkSelect.forEach(s => {
              if (this.wd) {
                for (let i = 0, len = this.wdTable.wdData.length; i < len; i++) {
                  if (s.id === this.wdTable.wdData[i].id) {
                    this.wdTable.wdData.splice(i, 1)
                    this.$refs.wdtable.clearSelection()
                    break
                  }
                }
              } else if (this.ld) {
                for (let i = 0, len = this.wdTable.ldData.length; i < len; i++) {
                  if (s.id === this.wdTable.ldData[i].id) {
                    this.wdTable.ldData.splice(i, 1)
                    this.$refs.wdtable.clearSelection()
                    break
                  }
                }
              } else if (this.dataType) {
                for (let i = 0, len = this.wdTable.dataTypeData.length; i < len; i++) {
                  if (s.id === this.wdTable.dataTypeData[i].id) {
                    this.wdTable.dataTypeData.splice(i, 1)
                    this.$refs.wdtable.clearSelection()
                    break
                  }
                }
              }
            })
          } else this.$message.warning('请选择要删除的数据')
        },
        save: () => {
          const table = JSON.parse(JSON.stringify(this.wdTable.ldData))
          table.forEach(e => {
            if (e.hs_return_data_) {
              e.hs_return_data_ = e.hs_return_data_.join(',')
            }
          })
          const wdtable = [...this.wdTable.wdData]
          const dataType = [...this.wdTable.dataTypeData]
          const formData = new FormData()
          formData.append('xmId', this.xmId)
          formData.append('dimension', JSON.stringify(wdtable))
          formData.append('measure', JSON.stringify(table))
          formData.append('dataType', JSON.stringify(dataType))
          const result = this.verdictArr()
          if (result.done && this.xmId) {
            this.$http.post('/bbReportXmController/updateDimension', formData).then(s => {
              this.$message.success('保存成功')
              this.getwdTable(this.xmId)
            }).catch(e => this.$message.error(e.message))
          } else this.$message.warning(result.message)
        }
      }
      DEAL[type]()
    },
    rowClick(row) { // 点击报表行
      this.xmId = row.id
    },
    changeStatu(row) { // 改变报表table
      this.$api.reportxm.changeSyzt({
        id: row.id,
        syzt: row.syzt
      }).then(s => {
        this.$message.success('状态修改成功')
      }).catch(e => {
        this.$message.error(e.message)
        if (row.syzt === true) row.syzt = false
        else row.syzt = true
      })
    },
    async getwdTable(id) { // 获取维度量度表
      const table = await this.$api.reportxm.getwdLdTable({ xmId: id })
      const dossierData = await this.$api.reportxm.getLdGlda({ xmId: id })
      const functionData = await this.$api.reportxm.getwdFunction({ id })
      const { data } = table
      this.dossierData = [...dossierData.data]
      this.functionData = [...functionData.data]
      if (data.dimension.length) this.getCs(data.dimension)
      this.wdTable.wdData = [...data.dimension]
      this.wdTable.ldData = [...data.measure]
      this.wdTable.dataTypeData = [...data.dataType]
      this.wdTable.ldData.forEach(d => {
        d.hs_return_data_ = d.hs_return_data_.split(',')
      })
      if (this.wdTable.ldData) {
        this.getldCS(this.wdTable.ldData)
        this.getldHs(this.wdTable.ldData)
      }
    },
    getTable({ // 获取报表项目
      size = '200', page = '1', flId = '', query = '', kjzd = '', hybb = ''
    }) {
      this.table.loading = true
      this.$api.reportxm.getTable({
        size: size || this.table.size,
        page: page || this.table.page,
        flId: this.flId,
        query,
        kjzd: this.hyInfo.kjzd,
        hybb: this.hyInfo.hybb
      }).then(s => {
        this.table.data = [...s.data.records]
        this.table.total = s.data.total
        this.table.loading = false
      }).catch(e => {
        this.$message.error(e.message)
        this.table.loading = false
      })
    },
    getBbTxTree() { // 获取左边树
      this.tree.loading = true
      this.$api.reportxm.getBbTxTree({
        kjzd: this.hyInfo.kjzd,
        hybb: this.hyInfo.hybb
      }).then(res => {
        this.tree.data = [...res.data]
        this.tree.loading = false
      }).catch(e => {
        this.tree.loading = false
        this.$message.error(e.message)
      })
    },
    searchData(query) { // 搜索
      this.content = query
      if (this.flId) this.getTable({ query: this.content, flId: this.flId })
    },
    refresh() { // 刷新
      this.content = ''
      this.getTable({ flId: this.flId })
    },
    addUnit() { // 添加左边树
      if (!this.hyInfo.kjzd) this.$message.warning('请先选择行业版本和会计制度')
      else {
        this.bbtx.show = true
        this.hyInfo.pName = ''
        this.hyInfo.pid = ''
        this.bbtx.usn = ''
      }
    },
    rightmenus(node) { // 树节点功能
      const { apis } = this
      const rm = [
        {
          label: '添加报表体系', icon: 'el-icon-circle-plus-outline', type: 'add', api: '/bbReportTxController/add'
        },
        {
          label: '修改报表体系', icon: 'el-icon-edit-outline', type: 'edit', api: '/bbReportTxController/update'
        },
        {
          label: '删除报表体系', icon: 'el-icon-delete', type: 'del', api: '/bbReportTxController/delete'
        }
      ]
      return rm.filter(l => apis.includes(l.api))
    },
    rightmenusHandler(obj) { // 树节点功能事件
      const { data, type } = obj
      const Deal = {
        add: () => {
          this.bbtx.show = true
          this.hyInfo.pName = data.label
          this.hyInfo.pid = data.id
          this.bbtx.usn = ''
        },
        edit: () => {
          this.bbtx.show = true
          this.bbtx.usn = data.id
        },
        del: () => {
          this.$confirm('当前操作将会删除所选数据，是否继续？', '删除', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$api.reportxm.delTree({
              id: data.id
            }).then(res => {
              this.$message.success('删除成功')
              this.getBbTxTree()
            }).catch(e => this.$message.error(e.message))
          }).catch(e => e)
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
        this.$api.reportxm.delXm({
          id: id.join(',')
        }).then(res => {
          this.$message.success('删除成功')
          this.getTable({})
          this.$refs.xmtable.clearSelection()
          this.wdTable.wdData = []
          this.wdTable.ldData = []
        }).catch(e => this.$message.error(e.message))
      }).catch(e => e)
    },
    setTargetNode(node) { // 点击树节点事件
      this.targetNode = node
    },
    uploadSuccess() { // 上传成功事件
      this.getBbTxTree()
      this.getTable({ flId: this.flId })
    },
    btnsHandler(met) { // toolBar事件
      const DEAL = {
        add: () => {
          if (this.hyInfo.kjzd) {
            this.bbxm.show = true
            this.bbxm.usn = ''
          } else this.$message.warning('请选择会计制度')
        },
        edit: () => {
          if (this.hyInfo.kjzd) {
            if (!this.table.checkSelect.length) this.$message.warning('请选择要修改的数据')
            else if (this.table.checkSelect.length > 1) this.$message.warning('只能修改单条数据')
            else if (this.table.checkSelect.length === 1) {
              this.bbxm.show = true
              this.table.checkSelect.forEach(l => {
                this.bbxm.usn = l.id
              })
            }
          } else this.$message.warning('请选择会计制度')
        },
        del: () => {
          if (this.hyInfo.kjzd) {
            if (!this.table.checkSelect.length) this.$message.warning('请选择要删除的数据')
            else {
              const IDS = this.table.checkSelect.map(s => s.id)
              this.del(IDS)
            }
          } else this.$message.warning('请选择会计制度')
        },
        educe: () => {
          if (this.table.checkSelect.length) {
            const params = {
              kjzd: this.hyInfo.kjzd,
              hybb: this.hyInfo.hybb
            }
            this.$exportFn({
              url: '/bbReportXmController/export',
              name: '报表项目',
              params
            })
          } else this.$message.warning('请选择要导出的数据')
        },
        import: () => {
          if (this.hyInfo.kjzd) {
            const { baseURL } = this.$http.defaults
            this.upload.action = `${baseURL}/bbReportXmController/importFile`
            this.upload.show = true
          } else this.$message.warning('请选择会计制度')
        }
      }
      DEAL[met]()
    },
    hybbChange(obj) { // 获取行业版本
      const { kjzd, hybb } = obj
      this.hyInfo.hybb = hybb
      this.hyInfo.kjzd = kjzd
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
  height: calc(99% - 45px);
  .tableOne {
    height: calc(99% - 40% - 30px);
    margin-bottom: 10px;
    .search {
      width: 50%;
    }
  }
  .tableTwo {
    height: calc(99% - 30%);
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
.wdStyle {
  border-bottom: 2px solid #018DF7;
  color: #018DF7;
}
</style>
