<template>
  <el-dialog
    v-dialog-drag
    :modal="false"
    width="950px"
    custom-class="globalBox"
    append-to-body
    :visible.sync="show"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :fullscreen="fullscreen"
    :before-close="() => $emit('update:show', false)"
  >
    <div slot="title">
      <div class="title">
        {{ title }}
        <i
          :class="fullscreen ? 'el-icon-copy-document' : 'el-icon-full-screen'"
          @click="fullscreen = !fullscreen"
        />
      </div>
    </div>
    <div v-if="!isNotHasSelect" class="search">
      <div class="search-inside">
        <el-form
          ref="form"
          :model="form"
          size="mini"
          label-width="70px"
          inline
        >
          <el-form-item
            v-for="item in select"
            :key="item.prop"
            :label="item.label"
            :prop="item.prop"
          >
            <el-input v-model="form[item.prop]" clearable />
          </el-form-item>
        </el-form>
      </div>
      <el-button
        class="search-sbtn"
        type="text"
        size="mini"
        icon="el-icon-search"
        @click="search"
      >
        搜索
      </el-button>
      <el-button
        class="search-rbtn"
        type="text"
        size="mini"
        icon="el-icon-refresh"
        @click="reset"
      >
        重置
      </el-button>
    </div>
    <div
      v-waiting="screenLoading"
      class="box"
      :style="{ height: `calc(100% - ${isNotHasSelect ? '10px' : '80px'})`}"
    >
      <div
        v-if="tree.data.length"
        class="box-tree"
        :style="{width: width + x + 'px', height: fullscreen ? '100%' : '400px'}"
      >
        <Tree
          :data="tree.data"
          @setTargetNode="setTargetNode"
        />
      </div>
      <div
        v-if="tree.data.length && table.data.length"
        class="box-drop"
        :style="{ left: width + x + 'px' }"
      >
        <i class="iconfont icon-tuozhuai" @mousedown="move" />
      </div>
      <div
        v-if="table.data.length"
        class="box-list"
        :style="{marginLeft: width + x + 15 +'px', height: fullscreen ? '100%' : '400px'}"
      >
        <Table
          :data="table.data"
          :columns="table.columns"
          :height="tHeight"
          :multiple="multiple"
          row-key="id"
          :search="false"
          :tools="tools"
          @toolshandler="tableToolsHandler"
          @cellClick="cellClick"
          @select="selectionChange"
          @dblclick="rowDblclick"
        />
        <Pagination
          class="pagination"
          :amount="+table.total"
          :page-size="table.size"
          :current-page="table.page"
          @handleSizeChange="val => (table.size = val)"
          @handleCurrentChange="val => (table.page = val)"
        />
      </div>
    </div>
    <div slot="footer">
      <el-button type="info" size="mini" @click="() => $emit('update:show', false)">
        关闭
      </el-button>
      <el-button type="primary" size="mini" @click="confirm">
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: { // 模块名称
      type: String,
      default: 'globalBox'
    },
    path: { // 模块路径
      default: ''
    },
    multiple: { // 是否启用table复选框
      type: Boolean,
      default: false
    },
    option: { // 是否需要操作列
      type: Boolean,
      default: true
    },
    parameters: { // 额外参数
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      fullscreen: false,
      screenLoading: false,
      x: 0,
      width: 300,
      select: {},
      form: {},
      tree: {
        data: [],
        code: '',
        targetNode: {}
      },
      table: {
        columns: [],
        data: [],
        total: 0,
        page: 1,
        size: 200,
        targetRow: {},
        selection: []
      },
      showField: [],
      searchFields: []
    }
  },
  computed: {
    dataLength() {
      const treeD = this.tree.data
      const tableD = this.table.data
      return { treeD, tableD }
    },
    isNotHasSelect() {
      const { select } = this
      return JSON.stringify(select) === '{}'
    },
    moduleCodes() {
      return JSON.parse(localStorage.getItem('moduleCodes')) || {}
    },
    tHeight() {
      const { fullscreen } = this
      const sH = document.body.clientHeight
      const selectH = this.isNotHasSelect ? 70 : 0
      return fullscreen ? sH - 280 + selectH : 360
    },
    pageAndSize() {
      const { page, size } = this.table
      return { page, size }
    },
    tools() {
      return [
        { icon: 'el-icon-edit-outline', title: '编辑', type: 'edit' }
      ]
    }
  },
  watch: {
    dataLength(obj) {
      const { treeD, tableD } = obj
      const flag = treeD.length && tableD.length
      // eslint-disable-next-line no-nested-ternary
      this.width = flag ? 300 : treeD.length ? 900 : 0
    },
    path: {
      immediate: true,
      handler(str) {
        str && this.initBox(str)
      }
    },
    pageAndSize({ page, size }) {
      this.getPage({
        page,
        size,
        others: { ...this.form }
      })
    }
  },
  methods: {
    rowDblclick({ row }) {
      this.$emit('getChoiceDatas', row)
      this.$emit('update:show', false)
    },
    confirm() {
      const { treeD, tableD } = this.dataLength
      if (treeD.length && tableD.length === 0) this.$emit('update:show', false)
      else if (tableD.length === 0) this.$emit('getChoiceDatas', this.tree.targetNode)
      else this.$emit('getChoiceDatas', this.table[this.multiple ? 'selection' : 'targetRow'])
      this.$emit('update:show', false)
    },
    cellClick(obj) {
      this.table.targetRow = obj?.row
    },
    selectionChange(selection) {
      this.table.selection = selection
    },
    search() {
      const others = {}
      Object.keys(this.form).forEach(key => {
        this.form[key] !== '' && (others[key] = this.form[key])
      })
      this.getPage({
        page: 1,
        others
      })
    },
    reset() {
      Object.keys(this.form).forEach(key => {
        this.$set(this.form, key, '')
      })
    },
    // eslint-disable-next-line object-curly-newline
    getPage({ page, size, others = {} }) {
      const params = {
        page: page || this.table.page,
        size: size || this.table.size,
        needTree: false,
        ...others,
        ...this.parameters
      }
      const { targetNode } = this.tree
      targetNode?.id !== '0' && (params[this.tree.correspondence] = targetNode.id)
      this.$api.gb.basicData({
        schemeSn: this.moduleCodes[this.path],
        params: JSON.stringify(params)
      }).then(s => {
        const { tab } = s?.data
        this.table.data = tab?.dataSet?.records
        this.table.total = tab?.dataSet?.total
      }).catch(e => {
        this.$message.error(e.message)
      })
    },
    setTargetNode(node) {
      this.tree.targetNode = node
      this.multiple || (this.table.targetRow = {})
      this.getPage({
        page: 1
      })
    },
    tableToolsHandler(obj) { // table 操作栏事件
      const { type, scope } = obj
      const DISPOSE = {
        edit: () => {
          this.$router.push(this.path)
        }
      }
      DISPOSE[type]()
    },
    initCorresponding(json) {
      const p = JSON.parse(json)
      return Object.keys(p).map(key => ({
        label: p[key],
        prop: key
      }))
    },
    initTable(data) {
      const { correspondence, dataSet, showField } = data
      const headers = this.initCorresponding(correspondence)
      this.table.columns = [
        ...(headers.filter(h => JSON.parse(showField).includes(h.prop) && h.prop !== 'id'))
      ]
      if (this.option) {
        this.$set(this.table.columns, this.table.columns.length, { label: '操作', fixed: undefined })
      }
      this.table.data = dataSet.records
      this.table.total = dataSet.total || 0
    },
    initTree(data) {
      this.tree.correspondence = data.correspondence
      this.tree.data = this.$tools.treeNodeFormatter(data.dataSet, '', 'pid')
    },
    initSelect(select) {
      if (select) {
        const { searchFields } = this
        if (searchFields) {
          this.select = this.initCorresponding(select)?.filter(s => searchFields.includes(s.prop) && s.prop !== 'id')
          this.select.forEach(item => {
            item.label && this.$set(this.form, item.prop, '')
          })
        }
      }
    },
    initBox(path) {
      this.screenLoading = true
      this.$api.gb.basicData({
        schemeSn: this.moduleCodes[path],
        params: JSON.stringify({
          page: this.table.page,
          size: this.table.size,
          needTree: true, // 只有首次为true
          ...this.parameters
        })
      }).then(s => {
        const { select, tab, tree } = s.data
        this.showField = JSON.parse(tab.showField)
        this.searchFields = JSON.parse(tab.searchFields)
        tab && this.initSelect(tab.correspondence)
        tree && this.initTree(tree)
        tab && this.initTable(tab)
        this.screenLoading = false
      }).catch(e => {
        this.screenLoading = false
        this.$message.error(e.message)
      })
    },
    move(e) {
      document.onmousemove = ve => {
        this.x = ve.x - e.x
      }
      document.onmouseup = ve => {
        document.onmousemove = null
        document.onmouseup = null
        this.width += this.x
        this.x = 0
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .search {
    height: 70px;
    margin-bottom: 5px;
    position: relative;
    &-inside {
      height: 100%;
      width: 92%;
      border: 1px solid #ddd;
      border-radius: 4px;
      overflow-y: auto;
      .el-form {
        margin: 5px;
      }
    }
    &-sbtn, &-rbtn {
      position: absolute;
      right: 10px;
    }
    &-sbtn {
      top: 8px
    }
    &-rbtn {
      top: 38px
    }
  }
  .box {
    position: relative;
    height: calc(100% - 80px);
    &-tree, &-list {
      height: 400px;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-sizing: border-box;
      overflow: auto;
    }
    &-drop {
      position: absolute;
      top: 50%;
      cursor: e-resize;
      color: #4390de;
    }
    &-tree {
      float: left;
    }
  }
  .title i{
    float: right;
    margin-right: 30px;
    margin-top: 3px;
    z-index: 10001;
    cursor: pointer;
  }
  .title i:hover {
    color: #4390de;
  }
</style>
