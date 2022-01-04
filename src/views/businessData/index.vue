<template>
  <div class="businessData">
    <div v-if="tables[activeName]" v-waiting="loading" class="content">
      <!-- 当前业务数据下的多个table表 tabs -->
      <el-tabs v-model="tableName[activeName]" @tab-click="tableTabClick">
        <el-tab-pane
          v-for="table in tables[activeName]"
          :key="table.id"
          :label="table.name"
          :name="table.id"
        >
          <div v-waiting="tableLoading" class="main">
            <div class="box">
              <LeftWorkbench v-show="info[table.id].width" ref="leftWorkbench" :width="info[table.id].width">
                <el-tabs slot="tree" v-model="info[table.id].active" class="treeTabs" @tab-click="treeTabClick">
                  <el-tab-pane
                    v-for="tab in info[table.id].tree"
                    :key="tab.name"
                    :label="tab.title"
                    :name="tab.name"
                  >
                    <Tree
                      ref="tree"
                      search
                      in-box
                      :data="info[table.id].tree[tab.name].data || []"
                      :node-props="{
                        children: 'children',
                        label: 'label'
                      }"
                      default-expand-all
                      @setTargetNode="setTargetNode"
                    />
                  </el-tab-pane>
                </el-tabs>
              </LeftWorkbench>
              <MiddleDrag
                v-show="info[table.id].width"
                :margin-top="middleDragTop"
                @hook:mounted="getTop"
                @move="move"
              />
              <RightWorkbench :margin-left="info[table.id].width">
                <div
                  slot="table"
                  style="height: 50px; overflow: auto; padding-top: 20px;"
                >
                  <query-form
                    ref="queryForm"
                    :cols="cols"
                    :ztsn="targetTabInfo.ztsn"
                    from="dossier"
                    inline
                    style="float: left"
                  />
                  <el-button type="primary" size="mini" @click="ordinaryQuery">
                    查询
                  </el-button>
                  <el-button
                    v-show="showSyncBtn && apis.includes('/businessTab/sync')"
                    slot="button"
                    icon="el-icon-refresh"
                    type="text"
                    size="mini"
                    style="margin-left: 10px;"
                    @click="setSyncData"
                  >
                    同步
                  </el-button>
                  <el-button
                    slot="button"
                    icon="el-icon-search"
                    type="text"
                    size="mini"
                    style="margin-left: 10px;"
                    @click="querySearch"
                  >
                    高级查询
                  </el-button>
                  <el-upload
                    ref="upload"
                    style="display: inline-block; padding: 0px 5px"
                    name="file"
                    :action="upload.url"
                    :data="upload.data"
                    :limit="1"
                    :format="['xlsx','xls']"
                    :show-file-list="false"
                    :headers="{
                      Authorization: upload.auth
                    }"
                    :before-upload="beforeUpload"
                    :on-success="uploadSuccess"
                    :on-error="uploadError"
                  >
                    <el-button
                      type="text"
                      size="small"
                      icon="el-icon-upload"
                      title="导入Excel"
                      @click="uploadExcel()"
                    >
                      导入Excel
                    </el-button>
                  </el-upload>
                </div>
                <el-table
                  slot="table"
                  :ref="table.id"
                  :data="info[table.id].data"
                  size="mini"
                  height="calc(100vh - 320px)"
                  @selection-change="selectionChange"
                >
                  <el-table-column type="selection" />
                  <el-table-column type="index" label="序号" />
                  <el-table-column
                    v-for="col in cols"
                    :key="col.name"
                    :prop="col.name"
                    :label="col.title"
                    :width="col.width || 50"
                  >
                    <template slot-scope="scope">
                      <template v-if="col.type === 'Bit'">
                        <el-checkbox
                          v-model="scope.row[col.name]"
                          :disabled="!apis.includes('/businessTab/updateControl')"
                          @change="changeRowStatus(scope.row)"
                        />
                      </template>
                      <span v-else>
                        {{ scope.row[col.name] }}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column width="150">
                    <template slot="header">
                      <span style="padding-right: 8px;">操作</span>
                      <el-button
                        v-if="apis.includes('/businessTab/saveData')"
                        type="text"
                        size="small"
                        icon="el-icon-circle-plus"
                        title="新增"
                        @click="rowHeaderHandler('add', table.id)"
                      />
                      <el-button
                        v-if="apis.includes('/businessTab/deleteData')"
                        type="text"
                        size="small"
                        icon="el-icon-delete"
                        title="删除"
                        @click="rowHeaderHandler('del', table.id)"
                      />
                    </template>
                    <template v-if="scope.row.allow_update_delete_" slot-scope="scope">
                      <el-button
                        v-if="apis.includes('/businessTab/saveData')"
                        type="text"
                        size="small"
                        icon="el-icon-edit-outline"
                        title="编辑"
                        @click="tableRowHandler('update', scope)"
                      />
                      <el-button
                        v-if="apis.includes('/businessTab/deleteData')"
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
                  :amount="info[table.id].total"
                  :page-size="info[table.id].size"
                  :current-page="info[table.id].page"
                  @handleSizeChange="handleSizeChange"
                  @handleCurrentChange="handleCurrentChange"
                />
              </RightWorkbench>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div v-else class="content">
      <div class="tips">
        当前暂无数据可供管理
      </div>
    </div>
    <Form
      v-if="form.show"
      :show.sync="form.show"
      :status="form.status"
      :info="form.info"
      :td="form.td"
      :tid="form.tid"
      :index="form.indexObj"
      :from="targetTabInfo.from"
      :ztsn="targetTabInfo.ztsn"
      @refresh="refresh"
    />
    <pDialog
      v-if="pDialog.show"
      :show.sync="pDialog.show"
      :cs="pDialog.userParams"
      @confirmParams="syncData"
    />
    <advanced-query
      v-if="queryShow"
      :show.sync="queryShow"
      :cols="cols"
      :ztsn="targetTabInfo.ztsn"
      from="dossier"
      @refresh="queryParams"
    />
  </div>
</template>

<script>

export default {
  name: 'Businessdata',
  components: {
    Form: () => import('./dialog/form'),
    pDialog: () => import('@/views/managementTable/dialog/pDialog.vue'),
    advancedQuery: () => import('@/views/adminData/dialog/advancedQuery.vue'),
    queryForm: () => import('@/views/adminData/dialog/queryForm.vue')
  },
  data() {
    return {
      middleDragTop: 300,
      loading: false,
      tables: {}, // 业务数据table tables
      tableName: {}, // tab下选中的当前table id
      info: {}, // 用于存放对应table id 的 data page size total selection 以及 tree相关数据
      tableLoading: false, // 用于各个table的加载loading
      targetTableId: '', // 当前选中的table id
      form: {
        show: false,
        status: 'add',
        info: {},
        indexObj: {} // 预先定义每一个table表的下标 子组件切换行数时需要
      },
      selectObj: {}, // 对应table 所选的行数据
      targetTabInfo: null,
      pDialog: {
        show: false,
        userParams: []
      },
      showSyncBtn: false,
      queryShow: false,
      condition: [],
      upload: { // 上传时所需参数
        url: '',
        auth: '',
        data: {
          bid: ''
        }
      }
    }
  },
  computed: {
    apis() {
      const { from } = this.targetTabInfo
      return this.$tools.getModuleAPIS(from === 'treatment' ? 'Business' : 'SysBusiness')
    },
    cols() {
      const { activeName } = this
      const tab = this.tableName[activeName]
      const data = this.tables[activeName]
      const target = data.filter(d => d.id === tab)[0]
      const cols = JSON.parse(target?.cols)?.filter(f => !f.hide)
      return cols
    }
  },
  watch: {
    // eslint-disable-next-line object-shorthand
    'form.show'(bool) {
      if (!bool) this.form.status = 'add'
    }
  },
  beforeRouteEnter(to, from, next) {
    if (to.params.param) {
      const p = JSON.parse(decodeURIComponent(to.params.param))
      to.meta.title = p.name
      next()
    }
    next()
  },
  created() {
    const { param } = this.$route.params
    const p = JSON.parse(decodeURIComponent(param))
    this.targetTabInfo = JSON.parse(JSON.stringify(p))
    this.activeName = p.id
    this.getInfo(p.id)
  },
  methods: {
    uploadExcel() {
      const { baseURL } = this.$http.defaults
      const { id, from } = this.targetTabInfo
      this.upload.url = `${baseURL}/businessTab/importData`
      this.upload.auth = this.$tools.getCookie()
      this.upload.data = {
        bid: id,
        ztsn: from === 'treatment' ? this.targetTabInfo.ztsn : ''
      }
    },
    beforeUpload(file) {
      const { name } = file
      const arr = name.split('.')
      const type = arr[arr.length - 1]
      if (['xls', 'xlsx'].includes(type)) {
        return true
      }
      this.$message.warning('请上传Excel文件！')
      return false
    },
    uploadSuccess(res, file) {
      const type = +res.code === 200 ? 'success' : 'warning'
      this.$message[type](res.message)
      this.refresh()
    },
    uploadError(err, file) {
      this.$message.error(err.message)
    },
    changeRowStatus(row) {
      this.$api.business.updateControl({
        tabId: this.targetTableId,
        id: row.id_,
        updateAndDelete: row.allow_update_delete_,
        ztsn: this.targetTabInfo.from === 'treatment' ? this.targetTabInfo.ztsn : ''
      }).then(s => {
        this.$message.success('修改成功！')
      }).catch(e => this.$message.error(e.message))
    },
    ordinaryQuery() {
      const result = this.$refs.queryForm[0]?.generateParams()
      this.queryParams(result)
    },
    queryParams(arr = []) {
      const item = this.info[this.targetTableId]
      this.condition = arr
      this.getPage({
        tabId: this.targetTableId,
        page: 1,
        size: item.size
      })
    },
    querySearch() {
      this.queryShow = true
    },
    syncData(obj) {
      this.loading = true
      this.$api.business.bussinessSyncData({
        tabId: this.targetTableId,
        cs: JSON.stringify(obj),
        ztsn: this.targetTabInfo.from === 'treatment' ? this.targetTabInfo.ztsn : ''
      }).then(s => {
        this.$message.success('同步成功！')
        this.loading = false
        this.refresh()
      }).catch(e => {
        this.loading = false
        this.$message.error(e.message)
      })
    },
    setSyncData() {
      const target = this.tables[this.activeName].filter(active => active.id === this.targetTableId)
      const params = Array.isArray(target) ? target[0].params : ''
      if (params) {
        this.pDialog.userParams = JSON.parse(params).map(p => p.name)
        if (this.pDialog.userParams.length === 0) this.syncData({})
        else this.pDialog.show = true
      }
    },
    refresh() {
      const item = this.info[this.targetTableId]
      this.getPage({
        tabId: this.targetTableId,
        page: item.page,
        size: item.size
      })
    },
    rowHeaderHandler(type, id) {
      const d = this.tables[this.activeName].filter(table => table.id === id)[0]
      const METHODS = {
        add: () => {
          this.$api.business.getDataTemplate({
            tabId: d.id,
            ztsn: this.targetTabInfo.from === 'treatment' ? this.targetTabInfo.ztsn : ''
          }).then(s => {
            this.form.td = s.data
            this.form.tid = d.id
            this.form.info = { ...d }
            const result = this.formatList(this.form.info)
            Object.keys(result).forEach(key => {
              this.$set(this.form.indexObj, key, 0)
            })
            this.form.show = true
          })
        },
        del: () => {
          const key = this.tableName[this.activeName]
          if (this.selectObj[key]) {
            const rows = this.selectObj[key]
            if (rows.length) this.delRows(rows)
            else this.$message.warning('请选择至少一行数据进行删除！')
          } else this.$message.warning('请选择至少一行数据进行删除！')
        }
      }
      METHODS[type]()
    },
    formatList(info) {
      const cols = {}
      JSON.parse(info.cols).forEach(col => {
        cols[col.name] = ''
      })
      const obj = {
        [info.id]: 0
      }
      return this.deepList(info.children, obj)
    },
    deepList(arr, obj) {
      arr.forEach(item => {
        const cols = {}
        JSON.parse(item.cols).forEach(col => {
          cols[col.name] = ''
        })
        obj[item.id] = 0
        if (item.children) this.deepList(item.children, obj)
      })
      return obj
    },
    selectionChange(selection) {
      const key = this.tableName[this.activeName]
      this.selectObj[key] = selection
    },
    delRows(rows) {
      if (rows.length) {
        this.$confirm('当前操作将删除所选数据，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.business.delYWSJ({
            tabId: this.tableName[this.activeName],
            datas: JSON.stringify(rows)
          }).then(s => {
            this.$message.success('删除成功！')
            this.refresh()
          }).catch(e => this.$message.error(e.message))
        }).catch(e => e)
      }
    },
    tableRowHandler(type, scope) {
      const METHODS = {
        update: () => {
          this.loading = true
          const tabId = this.tableName[this.activeName]
          this.$api.business.getGlsjFormInfo({
            tabId,
            datas: JSON.stringify(scope.row),
            ztsn: this.targetTabInfo.from === 'treatment' ? this.targetTabInfo.ztsn : ''
          }).then(s => {
            const d = this.tables[this.activeName].filter(table => table.id === tabId)[0]
            this.form.td = s.data
            this.form.tid = d.id
            this.form.info = { ...d }
            const result = this.formatList(this.form.info)
            Object.keys(result).forEach(key => {
              this.$set(this.form.indexObj, key, 0)
            })
            this.form.status = 'update'
            this.form.show = true
            this.loading = false
          }).catch(e => {
            this.loading = false
            this.$message.error(e.message)
          })
        },
        del: () => {
          this.delRows([scope.row])
        }
      }
      METHODS[type]()
    },
    handleSizeChange(size) {
      const { targetTableId } = this
      this.info[targetTableId].size = size
      this.getPage({
        tabId: targetTableId,
        size,
        page: this.info[targetTableId].page
      })
    },
    handleCurrentChange(page) {
      const { targetTableId } = this
      this.info[targetTableId].page = page
      this.getPage({
        tabId: targetTableId,
        page,
        size: this.info[targetTableId].size
      })
    },
    generateTreeTabs(cols = []) {
      const dossiers = cols.filter(col => col.type === 'systemDossier')
      const obj = {
        tree: {},
        width: dossiers.length ? 300 : 0,
        active: dossiers[0]?.name || ''
      }
      dossiers.forEach(dos => {
        obj.tree[dos.name] = {
          data: [],
          nodeSn: '',
          title: dos.title,
          name: dos.name,
          value: dos.value
        }
      })
      return obj
    },
    getTreeData(id, active) {
      const act = this.info[id].tree[active]
      if (act.data.length === 0) {
        const d = this.targetTabInfo
        this.$api.business.getDosTree({
          tabId: id,
          dnNodeField: active,
          faSn: d.ztsn ? '' : '',
          hiddenSn: act.value?.onlyShowName || false
        }).then(s => {
          this.$set(act, 'data', [s.data])
        }).catch(e => this.$message.error(e.message))
      }
    },
    getInfo(id) {
      if (this.tables[id] === undefined) {
        this.loading = true
        this.$api.business.getGlsjInfo({
          businessId: id,
          ztsn: this.targetTabInfo.from === 'treatment' ? this.targetTabInfo.ztsn : ''
        }).then(s => {
          if (s.data.length) {
            const firstTable = s.data[0]
            firstTable?.saveToLocal && firstTable.type === 2 && (this.showSyncBtn = true)
            this.$set(this.tables, id, s.data)
            this.$set(this.tableName, id, s.data[0].id)
            s.data.forEach((item, index) => {
              const { width, tree, active } = this.generateTreeTabs(JSON.parse(item.cols || ''))
              this.$set(this.info, item.id, {
                data: [],
                size: 200,
                page: 1,
                total: 0,
                selection: [],
                tree,
                width,
                active
              })
              active && this.getTreeData(item.id, active)
              if (index === 0) { // 获取第一个table的数据
                this.targetTableId = item.id
                this.getPage({
                  tabId: item.id,
                  page: 1,
                  size: 200
                })
              }
            })
          }
          this.loading = false
        }).catch(e => {
          this.loading = false
          this.$message.error(e.message)
        })
      }
    },
    treeTabClick(tab) {
      this.getTreeData(this.targetTableId, tab.name)
    },
    tableTabClick(tab) {
      const item = this.info[tab.name]
      this.targetTableId = tab.name
      if (item.data.length === 0) { // 避免切换tab时重复请求数据
        this.getPage({
          tabId: tab.name,
          page: item.page,
          size: item.size
        })
      }
    },
    setTargetNode(node) {
      const item = this.info[this.targetTableId]
      item.tree[item.active].nodeSn = node.sn
      this.getPage({
        tabId: this.targetTableId,
        page: item.page,
        size: item.size
      })
    },
    // eslint-disable-next-line object-curly-newline
    getPage({ tabId, page, size, pDataId = '', query = '' }) {
      this.tableLoading = true
      const target = this.info[this.targetTableId]
      this.$api.business.getGlsjPage({
        tabId,
        page,
        size,
        pDataId,
        query,
        ztsn: this.targetTabInfo.from === 'treatment' ? this.targetTabInfo.ztsn : '',
        condition: JSON.stringify(this.condition),
        dnNodeField: target.active || '',
        dnNodeId: target.tree[target.active]?.nodeSn
      }).then(s => {
        this.info[tabId].data = [...s.data.records]
        this.info[tabId].total = s.data.total
        this.tableLoading = false
      }).catch(e => {
        this.tableLoading = false
        this.$message.error(e.message)
      })
    },
    getTop() { // 拖拽
      this.middleDragTop = this.$refs.leftWorkbench[0]?.$el.offsetHeight / 2
    },
    move(x) { // 移动
      if (x < 300) x = 300
      else if (x > 800) x = 800
      this.info[this.targetTableId].width = x
    }
  }
}
</script>

<style lang="scss" scoped>
.businessData {
    position: relative;
    height: calc(100vh - 90px)
  }
  .tips {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #4390de;
  }
  .content {
    height: calc(100vh - 120px);
    .top {
      text-align: right;
      padding-bottom: 5px;
      border-bottom: 1px solid #ddd;
    }
  }
  .main {
    height: calc(100vh - 200px);
    .box {
      height:100%;
    }
  }
  .treeTabs {
    height: 100%;
    /deep/ .el-tabs__content {
      height: calc(100% - 50px);
      .el-tab-pane {
        height: 100%
      }
    }
  }
</style>
