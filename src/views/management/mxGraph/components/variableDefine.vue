<template>
  <el-dialog
    v-dialogDrag
    :modal="false"
    width="700px"
    :visible.sync="show"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :before-close="() => $emit('update:show', false)"
  >
    <div slot="title">
      定义变量
    </div>
    <Search class="search" :content.sync="content">
      <div slot="button">
        <el-button
          type="default"
          size="mini"
          style="margin-top: 4px"
          @click="addRow"
        >
          新增
        </el-button>
        <el-button
          type="default"
          size="mini"
          style="margin-top: 4px"
          @click="delRows(table.selection)"
        >
          删除
        </el-button>
      </div>
    </Search>
    <Table
      ref="table"
      v-waiting="table.loading"
      :data="td"
      :height="400"
      :columns="columns"
      :multiple="true"
      :search="false"
      :tools="[
        {
          icon: 'el-icon-delete',
          type: 'del',
          title: '删除'
        }
      ]"
      :header-row-style="{ align: 'center' }"
      row-key="timestamp"
      empty-text="暂无数据或可点击表单右上角添加数据"
      @toolshandler="tableToolsHandler"
      @select="selectionChange"
    />
    <div slot="footer">
      <el-button type="info" size="mini" @click="() => $emit('update:show', false)">
        取消
      </el-button>
      <el-button type="primary" size="mini" @click="save">
        保存
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
    datas: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      content: '',
      table: {
        loading: false,
        selection: []
      }
    }
  },
  computed: {
    columns() {
      return [
        { label: '名称', prop: 'variable', input: true },
        { label: '值', prop: 'value', input: true },
        { label: '常量', prop: 'constant', switch: true },
        { label: '可覆盖', prop: 'overrideAble', switch: true },
        { label: '操作', fixed: 'right' }
      ]
    },
    td() {
      const { content, datas } = this
      return content
        ? datas.filter(row => Object.values(row).some(o => o.toString().includes(content.toString().trim())))
        : datas
    }
  },
  methods: {
    save() {
      this.$emit('setNodeDatas', {
        type: 'VariableDefine',
        data: this.datas
      })
      this.$emit('update:show', false)
    },
    addRow() {
      this.$set(this.datas, this.datas.length, {
        variable: '',
        value: '',
        constant: true,
        overrideAble: true,
        timestamp: new Date().getTime()
      })
    },
    delRows(rows) {
      const rs = rows || this.table.selection
      if (rs.length) {
        this.$emit('update:datas', this.datas.filter(row => !rs.includes(row)))
        this.$refs.table.clearSelection()
      }
    },
    selectionChange(selection) {
      this.table.selection = selection
    },
    tableToolsHandler(obj) {
      const { type, scope } = obj
      this.delRows([scope.row])
    }
  }
}
</script>

<style>

</style>
