<template>
  <div class="accountingfile">
    <div ref="leftWorkbench" class="left" :style="{ width: width + 'px'}">
      <el-card v-if="isShow" class="box-card system">
        <div slot="header" class="clearfix">
          <span>映射管理</span>
        </div>
        <div style="height:100%">
          <Tree
            slot="tree"
            ref="leftTree"
            v-waiting="leftTree.loading"
            class="treeYS"
            :highlight-current="true"
            search
            :node-props="{
              children: 'children',
              label: 'label'
            }"
            :data="leftTree.data"
            :default-expand-all="leftTree.defaultExpandAll"
            @setTargetNode="leftTreeTargetNode"
          />
        </div>
      </el-card>
      <el-card :class="isShow?'box-card formula like':'box-card formula change'">
        <div slot="header" class="clearfix">
          <span>版本管理</span>
          <el-button
            v-if="apis.includes('/dataMapSchemeVersion/save')"
            style="float: right; padding: 3px 0"
            title="增加版本管理"
            type="text"
            class="el-icon-plus"
            @click.stop="addVersion"
          />
        </div>
        <div>
          <p v-for="(item,index) in versionList"
             :key="item.id"
             :class="{active:index==isBbActive}"
             @click="selectVersion(item,index)"
          >
            <el-row>
              <el-col :span="14">
                <span>{{ item.name }}</span>
              </el-col>
              <el-col :span="6">
                <span>{{ item.version }}</span>
              </el-col>
              <el-col :span="4">
                <span>
                  <el-button
                    v-if="apis.includes('/dataMapSchemeVersion/save')"
                    style="padding: 3px 0"
                    title="修改"
                    type="text"
                    class="el-icon-edit-outline"
                    @click.stop="editVersion(item.id)"
                  />
                  <el-button
                    v-if="apis.includes('dataMapSchemeVersion/removee')"
                    style="padding: 3px 0"
                    title="删除"
                    type="text"
                    class="el-icon-delete"
                    @click.stop="delVersion(item.id)"
                  />
                </span>
              </el-col>
            </el-row>
          </p>
        </div>
      </el-card>
      <el-card :class="isShow?'box-card during like':'box-card during change'">
        <div slot="header" class="clearfix">
          <el-row>
            <el-col :span="6">
              <span>应用期间</span>
            </el-col>
            <el-col :span="12">
              <el-select
                v-model="during"
                placeholder="请选择"
                size="mini"
                @change="selectChange"
              >
                <el-option
                  label="全部"
                  value=""
                />
                <el-option
                  v-for="item in duringType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-button
                v-if="apis.includes('/dataMapSchemeVersionQj/save')"
                style="float: right; padding: 3px 0"
                title="增加应用期间"
                type="text"
                class="el-icon-plus"
                @click="addDuring"
              />
            </el-col>
          </el-row>
        </div>
        <div>
          <p
            v-for="(item,index) in duringList"
            :key="item.id"
            :class="{active:index==isQjActive}"
            @click="selectDuring(item,index)"
          >
            <el-row>
              <el-col :span="8">
                <span>{{ item.rangeTypeName }}</span>
              </el-col>
              <el-col :span="12">
                <span>{{ item.showText }}</span>
              </el-col>
              <el-col :span="4">
                <span>
                  <el-button
                    v-if="apis.includes('/dataMapSchemeVersionQj/save')"
                    style="padding: 3px 0"
                    title="修改"
                    type="text"
                    class="el-icon-edit-outline"
                    @click.stop="updateDuring(item)"
                  />
                  <el-button
                    v-if="item.endFlag && apis.includes('/dataMapSchemeVersionQj/remove')"
                    style="padding: 3px 0"
                    title="删除"
                    type="text"
                    class="el-icon-delete"
                    @click.stop="delDuring(item.id)"
                  />
                </span>
              </el-col>
            </el-row>
          </p>
        </div>
      </el-card>
    </div>
    <MiddleDrag :margin-top="middleDragTop" @hook:mounted="getTop" @move="move" />
    <RightWorkbench :margin-left="width" class="rightWorkbench">
      <div slot="grid" ref="right" class="right">
        <div v-if="tableTree.data.length" class="tree">
          <Tree
            ref="tree"
            v-waiting="tableTree.loading"
            class="rightTree"
            :data="tableTree.data"
            :node-props="{
              children: 'children',
              label: 'label'
            }"
            @setTargetNode="setTargetNode"
          />
        </div>
        <div class="table">
          <ToolsBar
            slot="toolsBar"
            class="btnColor"
            module-name="DataMapManage"
            :items="btns"
            @btnsHandler="btnsHandler"
          />
          <div slot="search" class="row">
            <el-tabs v-model="activeName" class="tabs" @tab-click="handleClick">
              <el-tab-pane label="全部" name="ALL" />
              <el-tab-pane label="已映射" name="MAPPED" />
              <el-tab-pane label="未映射" name="UNMAPPED" />
            </el-tabs>
            <Search class="search" :content.sync="content" @search="searchData">
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
          </div>
          <div slot="table" class="rightTable">
            <el-table
              ref="table"
              :data="table.data"
              style="width: 100%"
              :height="tableHeight"
              @cell-click="cellClick"
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                v-if="table.data.length"
                type="selection"
                width="55"
              />
              <el-table-column v-for="(item,index) in tableTh" :key="item.id" :label="item.title" align="center">
                <el-table-column
                  v-for="(e,i) in item.childrens"
                  :key="e.name"
                  :prop="e.name"
                  :label="e.title"
                  :width="index===1&&i===0?180:''"
                >
                  <template slot-scope="scope">
                    <template v-if="index===1&&i===0">
                      <span class="showSpan">{{ scope.row[e.name] }}</span>
                    </template>
                    <template v-else>
                      {{ scope.row[e.name] }}
                    </template>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column
                v-if="table.data.length"
                fixed="right"
                label="操作"
                width="80"
              >
                <template slot-scope="scope">
                  <el-button
                    v-if="apis.includes('/dataMapSchemeItem/removeByValue')"
                    class="el-icon-delete"
                    type="text"
                    size="small"
                    @click.native.prevent="deleteRow(scope.row)"
                  />
                </template>
              </el-table-column>
            </el-table>
          </div>
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
      </div>
    </RightWorkbench>
    <!-- 版本管理弹框 -->
    <version-manage
      v-if="versionInfo.show"
      :id="versionInfo.id"
      :map-sn="versionInfo.mapSn"
      :show.sync="versionInfo.show"
      @success="versionSucSubmit"
    />
    <!-- 应用期间弹框 -->
    <app-during
      v-if="duringInfo.show"
      :id="duringInfo.id"
      :type="duringInfo.type"
      :version-id="duringInfo.versionId"
      :show.sync="duringInfo.show"
      :update-info="duringInfo.updateInfo"
      :during-type="duringInfo.duringType"
      @success="appDuringSucSubmit"
    />
    <!-- 另存为新版本 -->
    <copy
      v-if="copyInfo.show"
      :show.sync="copyInfo.show"
      :version-id="copyInfo.versionId"
      :info="copyInfo.info"
      @success="copySucSubmit"
    />
    <Treeselect
      v-show="toUpdateRowShow"
      ref="treeselect"
      v-model="toUpdateRow.targetValue"
      no-options-text="没有数据可以选择！"
      no-results-text="没有匹配的结果！"
      :style="treeSelectStyle"
      disable-branch-nodes
      :multiple="reverse"
      :flat="reverse"
      :clearable="false"
      :options="cys"
      :normalizer="normalizer"
      placeholder="请选择目标"
      open-on-focus
      @close="(value) => treeSelectChange(toUpdateRow, value)"
    />
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'DataMapManage',
  components: {
    Treeselect,
    versionManage: () => import('./dialog/versionManage'),
    dataMap: () => import('./dialog/dataMap'),
    appDuring: () => import('./dialog/appDuring'),
    copy: () => import('./dialog/copy')
  },
  data() {
    return {
      isShow: true,
      minorElements: [],
      activeName: 'ALL',
      cys: [],
      selectValue: [],
      loading: false,
      isBbActive: 0,
      isQjActive: 0,
      width: 300,
      middleDragTop: this.width,
      content: '',
      leftTree: {
        defaultExpandAll: true,
        defaultCheckedKeys: [],
        loading: false,
        data: [],
        targetNode: {}
      },
      versionList: [], // 左侧管理列表
      duringType: [],
      during: '',
      duringList: [], // 左侧版本期间列表
      tableTree: { // 表格左侧树
        loading: false,
        data: [],
        targetNode: {},
        sn: ''
      },
      table: {
        versionId: '',
        loading: false,
        data: [],
        selection: [],
        search: '',
        total: 0,
        page: 1,
        size: 200
      },
      tableTh: [], // 表格表头数据
      reverse: false,
      sourceValue: '',
      value: '',
      qjType: '',
      tableHeight: 300,
      defaultTreeNode: [],
      options: 'ALL',
      // 版本管理弹框信息
      versionInfo: {
        show: false,
        id: '',
        mapSn: ''
      },
      // 应用期间弹框信息
      duringInfo: {
        show: false,
        versionId: '',
        id: '',
        type: 'YEAR',
        updateInfo: {},
        duringType: []
      },
      // 另存为新版本信息
      copyInfo: {
        show: false,
        versionId: '',
        info: {}
      },
      toUpdateRow: {},
      toUpdateRowShow: false,
      treeSelectStyle: {
        position: 'fixed',
        top: '10px',
        left: '3px'
      }
    }
  },
  computed: {
    apis() {
      return this.$tools.getModuleAPIS('DataMapManage')
    },
    pageAndSize() { // 获取页数据
      const { page, size } = this.table
      return { page, size }
    },
    btns() {
      return [
        {
          method: 'del', name: '删除', icon: 'el-icon-delete', api: '/dataMapSchemeItem/removeByValue'
        },
        { method: 'change', name: this.reverse ? '还原' : '反转', icon: 'el-icon-download' },
        {
          method: 'more',
          name: '更多',
          icon: 'el-icon-arrow-down',
          children: [
            {
              method: 'copy', name: '另存为新版本', icon: 'el-icon-top', api: '/dataMapSchemeVersion/copyAsNewVersion'
            }
          ]
        }
      ]
    },
    tableTools() { // table 操作栏
      return [
        {
          icon: 'el-icon-delete-solid',
          type: 'del',
          title: '删除'
        }
      ]
    }
  },
  watch: {
    pageAndSize(obj) {
      this.getPage({
        page: obj.page,
        size: obj.size
      })
    }
  },
  beforeRouteEnter(to, from, next) {
    if (to.params.sn) {
      try {
        to.meta.title = `映射管理 - ${to.params.sn}`
        next()
      } catch (error) {
        next()
      }
    }
    next()
  },
  beforeRouteUpdate(to, from, next) {
    if (to.params.sn) {
      try {
        to.meta.title = `映射管理 - ${to.params.sn}`
        next()
      } catch (error) {
        next()
      }
    }
    next()
  },
  created() {
    if (!this.$route.params.sn) {
      this.getLeftTree()
      this.getDuringType()
    } else {
      this.fromDataMap(this.$route.params.sn)
      this.getDuringType()
    }
  },
  methods: {
    fromDataMap(sn) {
      if (sn) {
        this.isShow = false
        this.versionInfo.mapSn = sn
        this.getBBGLList(sn)
      } else {
        this.isShow = true
        // this.getLeftTree()
      }
    },
    cellClick(row, column, cell, event) {
      if (column.property === this.tableTh[1].childrens[0].name) {
        // console.log(...arguments, this.$refs.treeselect)
        this.toUpdateRow = row
        this.treeSelectStyle.left = `${event.clientX - 20}px`
        this.treeSelectStyle.top = `${event.clientY}px`
        this.treeSelectStyle.width = `${cell.offsetWidth}px`
        // console.log(event.clientX, event.clientY)
        this.toUpdateRowShow = true
        this.$nextTick(() => {
          document.querySelector('.vue-treeselect__input').focus()
        })
        this.$refs.treeselect.openMenu()
      } else {
        this.toUpdateRowShow = false
      }
    },
    save(sourceValue, rowInfo) {
      sourceValue = sourceValue || this.sourceValue
      const p = {
        versionId: this.table.versionId,
        targetValue: sourceValue,
        sourceValue: JSON.stringify(this.minorElements),
        reverse: this.reverse
      }
      if (this.reverse) {
        p.sourceValue = JSON.stringify(this.minorElements)
        p.targetValue = sourceValue
      } else {
        p.sourceValue = JSON.stringify([sourceValue])
        p.targetValue = [this.minorElements[0]].join()
      }
      this.$api.dataMapManage
        .saveDataTree(p)
        .then(s => {
          this.updateRow(sourceValue, rowInfo)
        })
        .catch(e => {
          this.$message.error(e.message)
        })
    },
    updateRow(sourceValue, rowInfo = null, doDeep = true) {
      rowInfo = rowInfo || this.table.data.filter(e => e.sourceValue === this.table.data)[0]
      this.getRowData(sourceValue, row => {
        const index = this.table.data.indexOf(rowInfo)
        this.table.data.splice(index, 1, row)
        doDeep && this.doUpdateOtherRows(row.targetValue, row)
      })
    },
    doUpdateOtherRows(targets, ex) {
      this.table.data.forEach(e => {
        if (ex !== e && this.hasCross(e.targetValue, targets)) {
          this.updateRow(e.sourceValue, e, false)
        }
      })
    },
    hasCross(arr1, arr2) {
      if (!arr1 || !(arr1 instanceof Array) || !arr1.length) {
        return false
      }
      if (!arr2 || !(arr2 instanceof Array) || !arr2.length) {
        return false
      }
      for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] && arr2.indexOf(arr1[i]) > -1) {
          return true
        }
      }
      return false
    },
    normalizer(node) { // treeSelect组件数据重组
      if (node.children && !node.children.length) {
        delete node.children
      }
    },
    treeSelectChange(rowsInfo, value) { // treeSelect组件获取数据
      this.toUpdateRowShow = false
      if (this.reverse) {
        this.minorElements = value
      } else {
        this.minorElements = [value]
      }
      this.save(rowsInfo.sourceValue, rowsInfo)
      // this.toUpdateRow = {}
    },
    handleClick(tab, event) {
      this.options = tab.$options.propsData.name
      this.getPage({})
    },
    // 获取数据选择树
    getDataTree() {
      const params = { }
      params.versionId = this.table.versionId
      this.reverse ? params.type = 'SOURCE' : params.type = 'TARGET'
      this.$api.dataMapManage
        .getDataTree(params)
        .then(s => {
          if (s.data && s.data.length) {
            this.cys = [...s.data]
          } else {
            this.cys = []
          }
        })
        .catch(e => {
          this.$message.error(e.message)
        })
    },
    isFirstRow(row) {
      const ds = this.table.data || []
      return row === 0 || ds[row].sourceValue !== ds[row - 1].sourceValue
    },
    calcRowSpan(row) {
      const ds = this.table.data || []
      const v = ds[row].sourceValue
      let n = 0
      for (let i = row; i < ds.length; i++) {
        if (ds[i].sourceValue === v) {
          n++
        }
      }
      return n
    },
    calcTableHeight() {
      this.tableHeight = `${this.$refs.right.offsetHeight - 120}px`
    },
    objectSpanMethod({
      row, column, rowIndex, columnIndex
    }) {
      if (!this.reverse) return [1, 1]
      const st = this.tableTh[0].childrens.length
      const et = st + this.tableTh[1].childrens.length + 1
      if (columnIndex > st && columnIndex < et) {
        return [1, 1]
      }
      if (this.isFirstRow(rowIndex)) {
        return [this.calcRowSpan(rowIndex), 1]
      }
      return [0, 0]
    },
    // 获取左侧树结构
    getLeftTree(expand = []) {
      this.leftTree.loading = true
      this.$api.dataMapManage
        .getYSGLTree()
        .then(s => {
          this.leftTree.data = Array.isArray(s.data) ? [...s.data] : [s.data]
          const node = this.getFirstUsefullNode(this.leftTree.data, e => {
            if (e.type === 'DataMapScheme') {
              return true
            }
            return false
          })
          if (node) {
            this.versionInfo.mapSn = node.id
            this.getBBGLList(node.id)
          }
          this.leftTree.loading = false
        })
        .catch(e => {
          this.leftTree.loading = false
          this.$message.error(e.message)
        })
    },
    getFirstUsefullNode(tree, fn) {
      for (let i = 0; i < tree.length; i++) {
        let node = tree[i]
        if (fn(node)) {
          return node
        }
        if (node.children && node.children.length) {
          node = this.getFirstUsefullNode(node.children, fn)
          if (node) {
            return node
          }
        }
      }
      return null
    },
    // 通过ID获取版本
    getBBGLList(id) {
      this.$api.dataMapManage
        .getBBGLList({ mapSn: id })
        .then(s => {
          if (!s.data || !s.data.length) {
            this.createDefault(id)
          } else {
            this.versionList = s.data
            const qjNode = this.getFirstUsefullNode(s.data, () => true)
            if (qjNode) {
              this.copyInfo.info.id = qjNode.id
              this.copyInfo.info.name = qjNode.name
              this.copyInfo.info.version = qjNode.version
              this.table.versionId = qjNode.id
              this.getYYQJList()
              this.getTableTree()
              this.getTableTh()
              this.getPage({})
              this.getDataTree()
              this.isBbActive = 0
            }
          }
        })
        .catch(e => {
          this.$message.error(e.message)
        })
    },
    // 建立默认版本
    createDefault(id) {
      this.$api.dataMapManage
        .createDefault({ mapSn: id })
        .then(s => {
          this.versionList = s.data
        })
        .catch(e => {
          this.$message.error(e.message)
        })
    },
    // 左侧树的目标节点
    leftTreeTargetNode(node) {
      if (node.type === 'DataMapScheme') {
        const flag = this.versionInfo.mapSn !== node.id
        if (flag) {
          this.versionInfo.mapSn = node.id
          this.reverse = false
          this.getBBGLList(node.id)
        }
      }
    },
    // 点击版本管理列表的项
    selectVersion(val, i) {
      this.copyInfo.info.id = val.id
      this.copyInfo.info.name = val.name
      this.copyInfo.info.version = val.version
      this.table.versionId = val.id
      this.copyInfo.versionId = val.id
      this.duringInfo.versionId = val.id
      this.isBbActive = i
      this.isQjActive = 0
      this.getYYQJList()
      this.getTableTree()
      this.getTableTh()
      this.getPage({})
      this.getDataTree()
      this.calcTableHeight()
    },
    // 获取左侧应用期间列表
    getYYQJList() {
      this.$api.dataMapManage
        .getYYQJList({ versionId: this.table.versionId, type: this.qjType })
        .then(s => {
          this.isQjActive = 0
          this.duringList = s.data
        })
        .catch(e => {
          this.$message.error(e.message)
        })
    },
    // 获取期间类型
    getDuringType() {
      this.$api.dataMapManage
        .getDuringType()
        .then(s => {
          this.duringType = s.data
          this.duringInfo.duringType = s.data
        })
        .catch(e => {
          this.$message.error(e.message)
        })
    },
    // 期间选择
    selectChange(val) {
      this.qjType = val
      this.duringInfo.type = val
      this.isQjActive = 0
      this.getYYQJList()
    },
    // 获取表格左侧树
    getTableTree() {
      this.$api.dataMapManage
        .getTableTree({
          versionId: this.table.versionId,
          reverse: this.reverse
        })
        .then(s => {
          this.tableTree.data = s.data
        })
        .catch(e => {
          this.$message.error(e.message)
        })
    },
    // 点击应用期间列表项
    selectDuring(val, index) {
      if (this.duringList.length) {
        this.duringInfo.type = val.rangeType
        this.isQjActive = index
      }
    },
    // 新增应用期间
    addDuring() {
      this.duringInfo.show = true
      this.duringInfo.id = ''
      this.duringInfo.versionId = this.table.versionId
      this.duringInfo.updateInfo = { rangeType: this.duringInfo.type }
    },
    // 修改应用期间
    updateDuring(val) {
      this.duringInfo.show = true
      this.duringInfo.id = val.id
      this.duringInfo.updateInfo = val
      this.duringInfo.type = val.rangeType
    },
    // 删除应用期间
    delDuring(val) {
      this.$confirm('当前操作将删除所选数据，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$api.dataMapManage
            .delAppDuring({
              ids: val
            })
            .then(s => {
              this.getYYQJList()
              this.$message.success('删除成功！')
            })
            .catch(e => {
              this.$message.error(e.message)
            })
        })
        .catch(e => e)
    },
    appDuringSucSubmit() {
      this.getYYQJList()
    },
    // 获取表格展示表头
    getTableTh() {
      this.$api.dataMapManage
        .getTableTh({
          versionId: this.table.versionId,
          reverse: this.reverse
        })
        .then(s => {
          let cnt = new Date().getTime()
          s.data.forEach(e => {
            e.id = cnt++
          })
          this.tableTh = s.data
        })
        .catch(e => {
          this.$message.error(e.message)
        })
    },
    // 获取当前行数据
    getRowData(val, callback) {
      this.$api.dataMapManage
        .getTableList({
          versionId: this.table.versionId,
          reverse: this.reverse,
          value: val
        })
        .then(s => {
          s.data.forEach(e => {
            if (this.reverse) {
              if (e.targetValue && e.targetValue.length) {
                e.targetValue = e.targetValue.split(',')
              } else {
                e.targetValue = []
              }
            } else {
              e.targetValue = e.targetValue || null
            }
          })
          if (s.data.length) {
            callback(s.data[0])
          }
        })
        .catch(e => {
          this.$message.error(e.message)
        })
    },
    // 获取表格数据
    getPage({ page, size }) {
      this.$api.dataMapManage
        .getTableData({
          versionId: this.table.versionId,
          reverse: this.reverse,
          page: page || this.table.page,
          size: size || this.table.size,
          value: this.value,
          s: this.content,
          scope: this.options
        })
        .then(s => {
          s.data.records.forEach(e => {
            if (this.reverse) {
              if (e.targetValue && e.targetValue.length) {
                e.targetValue = e.targetValue.split(',')
              } else {
                e.targetValue = []
              }
            } else {
              e.targetValue = e.targetValue || null
            }
          })
          this.table.data = s.data.records
          this.table.total = s.data.total
          this.calcTableHeight()
        })
        .catch(e => {
          this.$message.error(e.message)
        })
    },
    // 版本管理增加
    addVersion() {
      this.versionInfo.id = ''
      this.versionInfo.show = true
    },
    // 版本管理修改
    editVersion(id) {
      this.versionInfo.id = id
      this.versionInfo.show = true
    },
    versionSucSubmit(id) {
      this.getBBGLList(id)
    },
    dataMapSucSubmit() {
      this.getPage({})
    },
    copySucSubmit(val) {
      this.getBBGLList(this.versionInfo.mapSn)
    },
    doDelVersion(versionId, force = false) {
      this.$api.dataMapManage
        .delYSFAVersion({
          ids: versionId,
          force
        })
        .then(s => {
          this.getBBGLList(this.versionInfo.mapSn)
          this.getYYQJList()
          this.$message.success('删除成功！')
        })
        .catch(e => {
          if (!force) {
            this.$confirm(e.message, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.doDelVersion(versionId, true)
            }).catch(ex => ex)
          } else {
            this.$message.error(e.message)
          }
        })
    },
    // 版本管理删除
    delVersion(versionId, force = false) {
      this.$confirm('当前操作将删除所选数据，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.doDelVersion(versionId, force)
        })
        .catch(e => e)
    },
    searchData(val) {
      this.getPage({})
      this.content = val
    },
    setTargetNode(node) {
      this.value = node.id === 'root' ? '' : node.id
      this.getPage({})
    },
    // 表格多选
    handleSelectionChange(val) {
      this.table.selection = val
    },
    // 操作按钮
    btnsHandler(type) {
      const { selection } = this.table
      const METHODS = {
        del: () => {
          if (selection.length === 0) this.$message.warning('至少选择一行数据进行删除！')
          else {
            this.delDataTable(selection.map(s => s.sourceValue))
          }
        },
        change: () => {
          this.reverse = !this.reverse
          this.sourceValue = ''
          this.value = ''
          // this.toUpdateRow = {}
          this.getTableTree()
          this.getTableTh()
          this.getPage({})
          this.getDataTree()
        },
        copy: () => {
          this.copyInfo.show = true
        }
      }
      METHODS[type]()
    },
    refresh() {
      this.getPage({})
    },
    // 表格删除行
    deleteRow(val) {
      this.delDataTable([val.sourceValue])
      // console.log(val)
    },
    // 表格删除
    delDataTable(rows = []) {
      this.$confirm('当前操作将删除所选数据，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // this.reverse ? this.reverse = 1 : this.reverse = 0
          this.$api.dataMapManage
            .delDataTable({
              versionId: this.table.versionId,
              reverse: this.reverse,
              values: rows.join(',')
            })
            .then(s => {
              this.getPage({})
              this.$message.success('删除成功！')
            })
            .catch(e => {
              this.$message.error(e.message)
            })
        })
        .catch(e => e)
    },
    select(selection) {
      this.table.selection = [...selection]
    },
    getTop() { // 拖拽
      this.middleDragTop = this.$refs.leftWorkbench.offsetHeight / 2
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
.vue-treeselect{
  min-width: 300px !important;
  z-index: 100 !important;
}
.treeYS{
  /deep/.el-tree{
    height: calc(100% - 40px) !important;
  }
}
.right {
  width:100%;
  height:98%;
  display: flex;
  justify-content: space-between;
  padding: 5px;
  .rightTree {
    width: 300px;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-right: 10px;
  }
  .row{
    position: relative;
    height: 38px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    /deep/.el-tabs{
      padding-left: 0;
      width:100%;
      .el-tabs__nav-wrap{
        padding-left: 20px;
      }
    }
    /deep/.search{
      position: absolute;
      right: 0;
      top:0;
      width:340px;
    }
  }
  .table {
    flex:1;
    width: calc(100% - 350px);
    margin-right: 9px;
    border: 1px solid #ddd;
    border-radius: 5px;
    .btnColor{
      border-bottom: 1px solid #ddd;
    }
  }
}
.el-tabs{
  width:176px;
  padding-left: 10px;
}
.active{
  background-color: #F0F7FF;
}
.left {
  height: 98%;
  float: left;
  .system {
    border: 1px solid #ccc;
    height: 40% !important;
    /deep/.el-card__body{
      height:calc(100% - 40px);
      overflow-y: auto;
    }
  }
  .like{
    height:calc(30% - 10px);
  }
  .change{
    height:calc(50% - 10px);
  }
  .during,.formula{
    border: 1px solid #ccc;
    margin-top: 10px;
    /deep/.el-card__body{
      height:calc(100% - 44px);
      overflow-y: auto;
      p{
        cursor: pointer;
      }
    }
  }
}
.search {
  width: 60%;
}
.showSpan{
  overflow: auto;
  display: inline-block;
  width:93%;
  height:36px;
  line-height: 36px;
  border-radius: 5px;
  padding-left: 10px;
  border: 1px solid #ddd;
  cursor: pointer;
}

/deep/.el-button{
  margin-left: 3px !important;
}
.el-icon-plus {
  font-size: 16px;
}
/deep/.el-card__header{
  padding:8px 18px;
}
/deep/.el-table__empty-block{
  width:100% !important;
}
</style>
