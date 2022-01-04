<template>
  <div>
    <Search v-if="search" :show-icon="true" class="search" :content.sync="content" @search="searchData">
      <el-button
        slot="refresh"
        size="mini"
        type="text"
        icon="el-icon-refresh-right"
        @click="refresh"
      >
        刷新
      </el-button>
      <div v-if="apiBtns.length" slot="button">
        <ToolsBar :items="apiBtns" @btnsHandler="btnsHandler" />
      </div>
    </Search>
    <div class="table">
      <el-table
        ref="table"
        border
        :data="data"
        style="width:100%;"
        :size="size"
        :row-key="getRowkey"
        :height="calcHeight"
        :cell-style="cellStyle"
        highlight-current-row
        :empty-text="emptyText"
        :default-sort="{order: 'descending'}"
        :header-row-style="{
          fontWeight: 500,
        }"
        :header-cell-style="{'text-align':'center'}"
        @selection-change="select"
        @select="handlerSelect"
        @cell-click="cellClick"
        @row-dblclick="dblclick"
        @row-click="rowclick"
        @row-contextmenu="rowContextmenu"
      >
        <el-table-column v-if="multiple" type="selection" reserve-selection />
        <el-table-column v-if="number" type="index" label="序号" width="50" align="center" />
        <el-table-column
          v-for="column in columns"
          :key="column.prop"
          :align="align"
          :label="column.label"
          :prop="column.prop"
          :fixed="column.fixed"
          :type="column.type"
          :show-overflow-tooltip="column.prop ? true : false"
        >
          <template slot-scope="scope" class="fixed-right">
            <template v-if="column.input">
              <el-input v-model="scope.row[column.prop]" size="mini" />
            </template>
            <template v-else-if="column.checkbox">
              <el-checkbox
                v-model="scope.row[column.prop]"
                :disabled="scope.row.disabled"
                @change="colCheckBoxChange(scope.row)"
              />
            </template>
            <template v-else-if="column.switch">
              <el-switch
                v-model="scope.row[column.prop]"
                :inactive-text="column.inactiveText || '否'"
                :active-text="column.activeText || '是'"
                active-color="#4390ee"
                @change="colCheckBoxChange(scope.row)"
              />
            </template>
            <template v-else>
              {{
                column.formatter
                  ? column.formatter(scope.row[column.prop])
                  : scope.row[column.prop]
              }}
            </template>
            <template v-if="column.prop === undefined && tools.length">
              <el-button
                v-for="(tool, index) in apiTools"
                :key="index"
                type="text"
                size="small"
                :icon="tool.icon"
                :title="tool.title"
                @click="btnHandler(tool.type, scope)"
              />
            </template>
          </template>
          <template v-if="column.children">
            <el-table-column
              v-for="child in column.children"
              :key="child.prop"
              :align="align"
              :label="child.label"
              :prop="child.prop"
              :fixed="child.fixed"
              :type="child.type"
              :show-overflow-tooltip="child.prop ? true : false"
            />
          </template>
          <template>
            <div slot="header">
              {{ column.label }}
              <el-button
                v-for="header in column.headers || []"
                :key="header.type"
                :icon="header.icon"
                type="text"
                @click="rowHeadersHandler(header)"
              />
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Table',
  props: {
    data: {
      type: Array,
      required: true
    },
    columns: {
      type: Array,
      required: true
    },
    tools: {
      type: Array,
      default: () => []
    },
    size: {
      type: String,
      default: 'mini'
    },
    multiple: {
      type: Boolean,
      default: false
    },
    number: { // 序号
      type: Boolean,
      default: false
    },
    search: {
      type: Boolean,
      default: true
    },
    emptyText: {
      type: String,
      default: '暂无数据'
    },
    align: {
      type: String,
      default: 'left'
    },
    surplusHeight: { // 需额外减去的高度
      type: Number,
      default: 0
    },
    pagination: {
      type: Boolean,
      default: true
    },
    btns: {
      type: Array,
      default: () => []
    },
    cellStyle: {
      type: Function,
      default: () => {}
    },
    rowKey: {
      type: String,
      default: 'id'
    },
    height: {
      type: Number,
      default: 0
    },
    moduleName: { // 父组件name 用于获取父组件的按钮权限apis
      type: String,
      default: ''
    }
  },
  data() {
    return {
      defaultHeight: 500,
      content: '',
      pageSize: 1,
      currentPage: 1
    }
  },
  computed: {
    apiBtns() {
      const { btns, moduleName } = this
      if (!moduleName) return btns
      return this.checkBtnsAPI(btns)
    },
    apiTools() {
      const { tools, moduleName } = this
      if (!moduleName) return tools
      return this.checkToolsAPI(tools)
    },
    apis() {
      const { moduleName } = this
      return this.$tools.getModuleAPIS(moduleName)
    },
    calcHeight() {
      const { height, defaultHeight } = this
      return height || defaultHeight
    }
  },
  mounted() {
    if (!this.height) {
      this.calcTableHeight()
      window.addEventListener('resize', this.calcTableHeight, false)
      this.$once('hook:beforeDestroy', () => {
        window.removeEventListener('resize', this.calcTableHeight)
      })
    }
  },
  methods: {
    checkBtnsAPI(items = []) {
      const { apis } = this
      const arr = []
      items.forEach(item => {
        if (item.children) {
          item.children = item.children.filter(child => apis.includes(child.api) || child.api === undefined)
          item.children.length && arr.push(item)
        } else {
          (item.api === undefined || apis.includes(item.api)) && arr.push(item)
        }
      })
      return arr
    },
    checkToolsAPI(tools) {
      const { apis } = this
      return tools.filter(t => t.api === undefined || apis.includes(t.api))
    },
    rowContextmenu(row, cell, event) {
      this.$emit('rowContextmenu', { row, cell, event })
    },
    dblclick(row, column, event) {
      this.$emit('dblclick', { row, column, event })
    },
    rowclick(row, column, event) { // 点击表格某一行
      this.$emit('rowclick', { row, column, event })
    },
    rowHeadersHandler(data) {
      this.$emit('rowHeadersHandler', data)
    },
    btnsHandler(met) {
      this.$emit('btnsHandler', met)
    },
    colCheckBoxChange(obj) {
      this.$emit('clo-checkbox-status', obj)
    },
    calcTableHeight() {
      // table高度自适应
      const el = document.querySelector('.el-table')
      try {
        const boxH = document.querySelector('.routerBox').offsetHeight
        if (el) {
          this.$nextTick(() => {
            const p = this.pagination ? 40 : 0
            this.defaultHeight = boxH - el.offsetTop - p - this.surplusHeight
          })
        }
      } catch (error) {
        // ...
      }
    },
    btnHandler(type, scope) {
      this.$emit('toolshandler', { type, scope })
    },
    getRowkey(row) {
      return row[this.rowKey]
    },
    refresh() {
      // 刷新
      this.$emit('refresh')
    },
    select(selection) { // 选中checkBox 事件
      this.$emit('select', selection)
    },
    handlerSelect(select, row) {
      this.$emit('handlerSelect', { select, row })
    },
    searchData(value) {
      this.$emit('search', value)
    },
    cellClick(row, column, cell, event) {
      this.$emit('cellClick', {
        row,
        column,
        cell,
        event
      })
    },
    clearSelection() {
      this.$refs.table.clearSelection()
    },
    toggleRowSelection(row, selected) {
      this.$refs.table.toggleRowSelection(row, selected)
    },
    setCurrentRow(row) { // 用于单选表格，设定某一行为选中行,不加参数，则会取消目前高亮行的选中状态。
      this.$refs.table.setCurrentRow(row)
    }
  }
}
</script>

<style lang="scss" scoped>
.table {
  padding: 3px;
}
.search {
  // width: %;
  text-align: center;
  padding: 10px;
}
.pagination {
  text-align: right;
  padding: 10px 15px;
}
</style>
