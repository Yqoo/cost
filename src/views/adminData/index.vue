<template>
  <div class="admindata">
    <LeftWorkbench v-show="width" ref="leftWorkbench" :width="width">
      <el-tabs slot="tree" v-model="activeTabName">
        <el-tab-pane
          v-for="tab in tree"
          :key="tab.name"
          :label="tab.title"
          :name="tab.name"
        />
      </el-tabs>
      <Tree
        slot="tree"
        ref="tree"
        v-waiting="tdLoading"
        search
        :data="td"
        :node-props="{
          children: 'children',
          label: 'label'
        }"
        :height="'calc(100% - 60px)'"
        default-expand-all
        @setTargetNode="setTargetNode"
      />
    </LeftWorkbench>
    <MiddleDrag v-show="width" :margin-top="middleDragTop" @hook:mounted="getTop" @move="move" />
    <RightWorkbench :margin-left="width">
      <ToolsBar
        slot="toolsBar"
        class="btnColor"
        :module-name="targetTabInfo.ztsn ? 'Dossier' : 'SysDossier'"
        :items="btns"
        style="border-bottom: 1px solid #ddd"
        @btnsHandler="btnsHandler"
      />
      <div
        v-if="columns.length"
        slot="table"
        style="height: 50px; overflow: auto; padding-top: 20px;"
      >
        <query-form
          ref="queryForm"
          :cols="columns"
          :ztsn="targetTabInfo.ztsn"
          :from="targetTabInfo.from"
          inline
          style="float: left"
        />
        <el-button type="primary" size="mini" @click="ordinaryQuery">
          查询
        </el-button>
      </div>
      <el-table
        ref="table"
        slot="table"
        v-waiting="table.loading"
        :data="table.data"
        border
        size="mini"
        style="height: 100%;"
        height="calc(100% - 150px)"
        :row-key="getRowKey"
        :header-cell-style="{'text-align':'center'}"
        @selection-change="selectRows"
      >
        <el-table-column type="selection" reserve-selection />
        <el-table-column
          v-for="col in formatterColumns"
          :key="col.prop"
          :prop="col.prop"
          :label="col.label"
          :width="col.width"
        >
          <template slot-scope="scope">
            <div :style="{ textAlign: col.position }">
              <template v-if="col.type === 'Bit'">
                <el-checkbox
                  v-model="scope.row[col.prop]"
                  :disabled="!apis.includes('/dossier/updateControl')"
                  @change="changeRowStatus(scope.row)"
                />
              </template>
              <span v-else-if="['Float', 'Money', 'Int'].includes(col.type)">
                {{ scope.row[col.prop] === null ? '' : formatterNumber(scope.row[col.prop], col) }}
              </span>
              <span v-else>
                {{ scope.row[col.prop] }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="type !== 1" label="操作" width="120">
          <template v-if="scope.row.allow_update_delete_" slot-scope="scope">
            <el-button
              v-if="apis.includes('/dossier/saveData')"
              type="text"
              size="mini"
              icon="el-icon-edit-outline"
              title="编辑"
              @click="tableToolsHandler('update', scope)"
            />
            <el-button
              v-if="apis.includes('/dossier/deleteData')"
              type="text"
              size="mini"
              icon="el-icon-delete"
              title="删除"
              @click="tableToolsHandler('del', scope)"
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
    </RightWorkbench>
    <Form
      v-if="form.show"
      :show.sync="form.show"
      :form-items="formatterColumns"
      :info="form.info"
      :from="targetTabInfo.from"
      :daid="targetTabInfo.sn"
      :ztsn="targetTabInfo.ztsn"
      :has-parent="hasParent"
      :list="form.list"
      @refreshTable="refreshTable"
    />
    <Upload
      v-if="upload.show"
      :show.sync="upload.show"
      :action="upload.action"
      :format="['xls', 'xlsx']"
      :params="upload.params"
      @success="uploadSuccess"
    />
    <advanced-query
      :show.sync="queryShow"
      :cols="columns"
      :ztsn="targetTabInfo.ztsn"
      :from="targetTabInfo.from"
      @refresh="queryParams"
    />
  </div>
</template>

<script>
/* eslint-disable object-curly-newline */

import queryForm from './dialog/queryForm.vue'

export default {
  name: 'Admindata',
  components: {
    Form: () => import('./dialog/form'),
    advancedQuery: () => import('./dialog/advancedQuery'),
    queryForm
  },
  data() {
    return {
      width: 300,
      middleDragTop: this.width,
      tree: {},
      table: {
        loading: false,
        data: [],
        total: 0,
        page: 1,
        size: 200,
        selection: []
      },
      targetTabInfo: null,
      dataType: 1,
      columns: [],
      form: {
        show: false,
        info: {},
        list: [] // 树的平铺数据
      },
      hasParent: false,
      upload: {
        show: false,
        action: '',
        params: {}
      },
      type: 3, // 来源类型
      queryShow: false,
      condition: [],
      activeTabName: ''
    }
  },
  computed: {
    apis() {
      const { ztsn } = this.targetTabInfo
      return this.$tools.getModuleAPIS(ztsn ? 'Dossier' : 'SysDossier')
    },
    td() {
      const { activeTabName, tree } = this
      return tree[activeTabName] ? tree[activeTabName].data : []
    },
    tdLoading() {
      const { activeTabName, tree } = this
      return tree[activeTabName] ? tree[activeTabName].loading : false
    },
    pageAndSize() {
      const { size, page } = this.table
      return { size, page }
    },
    btns() {
      const { dataType } = this
      const btn = {
        1: [
          { method: 'download', name: '导出', icon: 'el-icon-download', api: '/dossier/exportData' },
          { method: 'imp', name: '导入', icon: 'el-icon-upload', api: '/dossier/importData' },
          { method: 'query', name: '高级查询', icon: 'el-icon-search' }
        ],
        2: [
          { method: 'synch', name: '同步', icon: 'el-icon-refresh', api: '/dossier/sync' },
          { method: 'add', name: '新增', icon: 'el-icon-circle-plus', api: '/dossier/saveData' },
          { method: 'del', name: '删除', icon: 'el-icon-delete', api: '/dossier/deleteData' },
          { method: 'query', name: '高级查询', icon: 'el-icon-search' }
        ],
        3: [
          { method: 'add', name: '新增', icon: 'el-icon-circle-plus', api: '/dossier/saveData' },
          { method: 'update', name: '编辑', icon: 'el-icon-edit-outline', api: '/dossier/saveData' },
          { method: 'del', name: '删除', icon: 'el-icon-delete', api: '/dossier/deleteData' },
          { method: 'download', name: '导出', icon: 'el-icon-download', api: '/dossier/exportData' },
          { method: 'imp', name: '导入', icon: 'el-icon-upload', api: '/dossier/importData' },
          { method: 'query', name: '高级查询', icon: 'el-icon-search' }
        ]
      }
      return btn[dataType]
    },
    formatterColumns() {
      const { columns } = this
      const cols = columns.filter(f => !f.hidden).map(col => ({
        label: col.title,
        prop: col.name,
        required: col.required,
        type: col.type,
        value: col.value,
        isSnField: col.isSnField,
        sym: col.sym || '',
        digit: col.digit || 0,
        percent: col.percent,
        position: col.position || 'center',
        width: col.width || '50'
      }))
      return cols
    },
    tableTools() {
      const { dataType } = this
      const tools = {
        1: [{
          icon: 'el-icon-edit-outline',
          type: 'update',
          title: '编辑'
        }],
        3: [
          {
            icon: 'el-icon-edit-outline',
            type: 'update',
            title: '编辑'
          },
          {
            icon: 'el-icon-delete',
            type: 'del',
            title: '删除'
          }
        ]
      }
      return tools[dataType]
    }
  },
  watch: {
    activeTabName(name) {
      if (this.tree[name] && this.tree[name].data.length === 0) {
        this.getTree(name)
      }
    },
    // eslint-disable-next-line func-names
    'form.show': function (bool) {
      if (!bool) this.form.info = {}
    },
    pageAndSize(obj) {
      const { activeTabName } = this
      const dataId = activeTabName ? this.tree[activeTabName].targetNode && this.tree[activeTabName].targetNode.id : 0
      this.getPage({
        page: obj.page,
        size: obj.size,
        from: this.targetTabInfo.from,
        sn: this.targetTabInfo.sn,
        dataId: dataId || 0,
        dnNodeField: activeTabName
      })
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
  beforeRouteUpdate(to, from, next) {
    if (to.params.param) {
      const p = JSON.parse(decodeURIComponent(to.params.param))
      to.meta.title = p.name
      next()
    }
  },
  created() {
    const { param } = this.$route.params
    const p = JSON.parse(decodeURIComponent(param))
    this.targetTabInfo = JSON.parse(JSON.stringify(p))
    this.getInfo(p.id)
  },
  methods: {
    formatterNumber(value, col) {
      let p = '1'
      const arr = new Array(+col.digit).fill(0)
      arr.forEach(() => {
        p += '0'
      })
      const v = col.type === 'Int' ? value : Math.round(value * p) / p
      const str = col.percent
        ? this.$tools.formatNumber(v, +col.digit)
        : v && v.toFixed(col.type === 'Int' ? 0 : +col.digit)
      return `${str === '' ? '' : col.sym || ''} ${str}`
    },
    ordinaryQuery() {
      const result = this.$refs.queryForm.generateParams()
      this.queryParams(result)
    },
    queryParams(arr = []) {
      const info = this.targetTabInfo
      this.condition = arr
      this.getPage({
        from: info.from,
        sn: info.sn,
        dnNodeField: this.activeTabName
      })
    },
    searchSth() {
      const { activeTabName } = this
      const dataId = this.tree[activeTabName].targetNode && this.tree[activeTabName].targetNode.id
      const { from, sn } = this.targetTabInfo
      this.getPage({
        from,
        sn,
        dataId: dataId || 0,
        dnNodeField: this.activeTabName
      })
    },
    changeRowStatus(row) {
      this.$api.record.changeSjStatus({
        daId: this.targetTabInfo.sn,
        id: row.id_,
        updateAndDelete: row.allow_update_delete_,
        addChildren: row.allow_add_,
        ztsn: this.targetTabInfo.ztsn
      }).then(s => {
        this.$message.success('修改成功！')
      }).catch(e => this.$message.error(e.message))
    },
    getRowKey(row) {
      return row.id_
    },
    uploadSuccess() {
      const { activeTabName } = this
      const dataId = this.tree[activeTabName].targetNode && this.tree[activeTabName].targetNode.id
      const { from, sn } = this.targetTabInfo
      this.getPage({
        from,
        sn,
        dataId: dataId || 0,
        dnNodeField: this.activeTabName
      })
      this.getTree('default')
    },
    getInfo(id) {
      if (id) {
        const info = this.targetTabInfo
        this.getColumns(info.from, info.id)
        this.getPage({ from: info.from, sn: info.sn })
      }
    },
    // eslint-disable-next-line object-curly-newline
    getPage({ from, page, size, dataId = 0, sn, dnNodeField = '' }) {
      this.table.loading = true
      this.$api.record.getSJPage(from, {
        page: page || this.table.page,
        size: size || this.table.size,
        dataId,
        sn,
        ztsn: this.targetTabInfo.ztsn,
        condition: JSON.stringify(this.condition),
        dnNodeField: dnNodeField === 'default' ? '' : dnNodeField
      }).then(s => {
        this.table.data = [...s.data.records]
        this.table.total = s.data.total
        this.$refs.table.doLayout()
        this.table.loading = false
      }).catch(e => {
        this.table.loading = false
        this.$message.error(e.message)
      })
    },
    getTree(field = '') {
      const { targetTabInfo } = this
      const tf = this.tree[field]
      tf && (tf.loading = true)
      this.$api.record.getSJTree(targetTabInfo.from, {
        sn: targetTabInfo.sn,
        ztsn: targetTabInfo.ztsn,
        dnNodeField: field === 'default' ? '' : field,
        hiddenSn: tf.value?.onlyShowName || false
      }).then(s => {
        const { list, tree } = s.data
        this.form.list = list
        tf && (tf.data = [tree])
        tf && (tf.loading = false)
      }).catch(e => {
        tf && (tf.loading = false)
        this.$message.error(e.message)
      })
    },
    getColumns(from, id) {
      this.$api.record.getInfoById(from, {
        id,
        ztsn: this.targetTabInfo.ztsn
      }).then(s => {
        // eslint-disable-next-line object-curly-newline
        const { cols, dataType, treeUseId, type, name } = s.data
        this.type = type
        this.columns = JSON.parse(cols)
        const def = dataType === 2 ? {} : { name: 'default', title: name }
        this.generateTabs(this.columns, def)
        this.hasParentTree(dataType, treeUseId, type)
        this.isNeedShowWidth(this.columns, dataType)
        this.dataType = s.data.type
      }).catch(e => {
        this.$message.error(e.message)
      })
    },
    generateTabs(cols, def = {}) {
      const arr = [...cols.filter(col => col.type === 'systemDossier')]
      def.name && arr.unshift(def)
      arr.forEach(tab => {
        const enabelTree = tab.value?.enabelTree || false
        !enabelTree && this.$set(this.tree, tab.name, {
          loading: false,
          data: [],
          targetNode: {},
          title: tab.title,
          name: tab.name,
          value: tab.value ? tab.value : {}
        })
      })
      this.activeTabName = def.name ? def.name : arr[0]?.name
    },
    isNeedShowWidth(cols, dataType) {
      const dossiers = cols.filter(col => col.type === 'systemDossier' && !col.value?.enabelTree)
      if (dataType === 2 && dossiers.length === 0) this.width = 0
    },
    hasParentTree(dataType, treeUseId, type) {
      if (dataType === 1 && treeUseId && [2, 3].includes(type)) this.hasParent = true
      else this.hasParent = false
    },
    refreshTable(id) {
      const { from, sn } = this.targetTabInfo
      this.getTree('default')
      this.getPage({
        from, sn, dataId: '', dnNodeField: this.activeTabName
      })
    },
    selectRows(rows) {
      this.table.selection = rows
    },
    delRows(rows = []) {
      if (rows.length) {
        this.$confirm('当前操作将会删除所选数据，是否继续？', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.record.delSJ(this.targetTabInfo.from, {
            daId: this.targetTabInfo.sn,
            ids: rows.join(','),
            ztsn: this.targetTabInfo.ztsn
          }).then(s => {
            this.getPage({
              from: this.targetTabInfo.from,
              page: this.table.page,
              size: this.table.size,
              sn: this.targetTabInfo.sn,
              dnNodeField: this.activeTabName
            })
            if (Array.isArray(this.$refs.table)) this.$refs.table.forEach(t => t.clearSelection())
            else this.$refs.table.clearSelection()
            this.$message.success('删除成功！')
          }).catch(e => {
            this.$message.error(e.message)
          })
        }).catch(e => e)
      }
    },
    tableToolsHandler(type, scope) {
      const METHODS = {
        update: () => {
          Object.assign(this.form.info, scope.row)
          this.form.show = true
        },
        del: () => {
          this.delRows([scope.row.id_])
        }
      }
      METHODS[type]()
    },
    btnsHandler(type) {
      const METHODS = {
        add: () => {
          this.form.show = true
        },
        update: () => {
          const { selection } = this.table
          if (selection.length !== 1) this.$message.warning('请选择一行数据进行编辑！')
          else {
            Object.assign(this.form.info, selection[0])
            this.form.show = true
          }
        },
        del: () => {
          const { selection } = this.table
          if (selection.length === 0) this.$message.warning('请选择至少一行数据进行删除！')
          else {
            const ids = selection.map(s => s.id_)
            this.delRows(ids)
          }
        },
        download: () => {
          const { sn, name, ztsn } = this.targetTabInfo
          this.$tools.downloadWithToken('/dossier/exportData', {
            daId: sn,
            ztsn
          }, `${name}.xls`)
        },
        imp: () => {
          const { baseURL } = this.$http.defaults
          const { sn, ztsn } = this.targetTabInfo
          this.upload.action = `${baseURL}/dossier/importData`
          this.upload.params = { daId: sn, ztsn }
          this.upload.show = true
        },
        synch: () => {
          this.table.loading = true
          this.$api.record.syncData({
            daId: this.targetTabInfo.sn,
            ztsn: this.targetTabInfo.ztsn
          }).then(s => {
            this.getPage({
              from: this.targetTabInfo.from,
              page: 1,
              size: this.table.size,
              sn: this.targetTabInfo.sn,
              dnNodeField: this.activeTabName
            })
            this.table.loading = false
            this.$message.success('同步成功！')
          }).catch(e => {
            this.table.loading = false
            this.$message.error(e.message)
          })
        },
        query: () => {
          this.queryShow = true
        }
      }
      METHODS[type]()
    },
    setTargetNode(node) {
      const { activeTabName } = this
      this.tree[activeTabName].targetNode = node
      this.getPage({
        from: this.targetTabInfo.from,
        dataId: node.sn,
        sn: this.targetTabInfo.sn,
        dnNodeField: this.activeTabName
      })
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

<style lang='scss' scoped>
  .admindata {
    height: calc(100vh - 150px)
  }
</style>
