<template>
  <div class="businessTbas">
    <el-tabs v-model="activeTabName">
      <el-tab-pane
        v-for="tab in tabs.children"
        :key="tab.id"
        :name="tab.id"
        :label="tab.name"
      >
        <el-table
          :ref="tab.id ? tab.id : 'table'"
          :data=" tab.id ? childTd[tab.id] : []"
          size="mini"
          style="width: 100%"
          :height="height"
          max-height="200"
          :row-class-name="tableRowClassName"
        >
          <!-- <el-table-column type="selection" /> -->
          <el-table-column type="index" label="序号" />
          <el-table-column
            v-for="col in JSON.parse(tab.cols)"
            :key="col.name"
            :prop="col.name"
            :label="col.title"
          >
            <template slot-scope="scope">
              <el-select
                v-if="col.type === 'systemDossier'"
                v-model="scope.row[col.name]"
                size="mini"
                clearable
                :disabled="scope.row.__isDeleted"
                @focus="getSelect(col.value.sn, tab)"
              >
                <el-option
                  v-for="op in tab.selectValue"
                  :key="op.id"
                  :label="op.label"
                  :value="op.id"
                />
              </el-select>
              <el-input
                v-if="col.type === 'Text'"
                v-model="scope.row[col.name]"
                :disabled="scope.row.__isDeleted"
                :rows="3"
                clearable
                size="mini"
                type="textarea"
              />
              <el-input
                v-if="col.type === 'Int'"
                v-model="scope.row[col.name]"
                :disabled="scope.row.__isDeleted"
                size="mini"
                clearable
                @blur="formaterNumber(scope, col.name, 'Int')"
              />
              <el-input
                v-if="col.type === 'Float'"
                v-model="scope.row[col.name]"
                :disabled="scope.row.__isDeleted"
                size="mini"
                clearable
                @blur="formaterNumber(scope, col.name, 'Float')"
              />
              <el-input
                v-if="col.type === 'Money'"
                v-model="scope.row[col.name]"
                :disabled="scope.row.__isDeleted"
                size="mini"
                clearable
                @blur="formaterNumber(scope, col.name, 'Money')"
              />
              <el-radio-group
                v-if="col.type === 'Bit'"
                v-model="scope.row[col.name]"
                size="mini"
              >
                <el-radio :label="true">
                  是
                </el-radio>
                <el-radio :label="false">
                  否
                </el-radio>
              </el-radio-group>
              <el-date-picker
                v-if="col.type === 'date'"
                v-model="scope.row[col.name]"
                :format="col.value"
                :value-format="col.value"
                type="datetime"
                size="mini"
                placeholder="选择日期"
                style="width: 100%"
              />
              <el-input
                v-if="col.type === 'Varchar'"
                v-model="scope.row[col.name]"
                size="mini"
                :disabled="scope.row.__isDeleted"
                @focus="changeIndex(tabs, tab, scope)"
              />
            </template>
          </el-table-column>
          <el-table-column>
            <template slot="header">
              <el-button
                type="text"
                size="small"
                icon="el-icon-circle-plus"
                title="新增"
                @click="tableHeaderHandler('add', tabs, tab)"
              />
            </template>
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                :icon="scope.row.__isDeleted ? 'el-icon-refresh-left' : 'el-icon-delete'"
                :title="scope.row.__isDeleted ? '撤销删除' : '删除' "
                @click="tableRowHandler('del', scope)"
              />
            </template>
          </el-table-column>
        </el-table>
        <business-tabs
          :tid="tab.id"
          :tabs="tab"
          :td="childTd"
          :index.sync="index"
          :form="from"
          :ztsn="ztsn"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'BusinessTabs',
  props: {
    tabs: {
      type: Object,
      default: () => {}
    },
    td: {
      type: Object,
      default: () => {}
    },
    tid: {
      type: String,
      default: ''
    },
    index: {
      type: Object,
      default: () => {}
    },
    from: {
      type: String,
      default: ''
    },
    ztsn: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      activeTabName: this.tabs.children[0] && this.tabs.children[0].id,
      height: 200
    }
  },
  computed: {
    childTd() {
      const { tid, index } = this
      const i = index[tid]
      return this.td[tid][i] && this.td[tid][i].__children
    }
  },
  watch: {
    tabs: {
      immediate: true,
      handler: 'setData'
    }
  },
  mounted() {
    this.height = 200
  },
  methods: {
    formaterNumber(scope, name, type) {
      const v = this.$tools.formatNumber(scope.row[name], type === 'Int' ? 0 : 2)
      scope.row[name] = this.$tools.delcommafy(v)
    },
    tableRowClassName({ row, rowIndex }) {
      return row.__isDeleted ? 'warning-row' : ''
    },
    tableRowHandler(type, scope) {
      const METHODS = {
        del: () => {
          const deepDel = (child, bool) => { // 递归讲该table下的所有子table以及孙子等状态都修改
            if (child) {
              Object.keys(child).forEach(key => {
                child[key].forEach(row => {
                  row.__isDeleted = bool
                  row.__children && deepDel(row.__children, row.__isDeleted)
                })
              })
            }
          }
          scope.row.__isDeleted = !scope.row.__isDeleted
          deepDel(scope.row.__children, scope.row.__isDeleted)
        }
      }
      METHODS[type]()
    },
    tableHeaderHandler(type, parent, self, child) {
      const METHODS = {
        add: () => {
          const data = this.childTd[self.id]
          const row = JSON.parse(JSON.stringify(data[0]))
          Object.keys(row).forEach(key => {
            if (key === '__children') this.clearChildRowData(row.__children)
            else {
              row[key] = key === '__isDeleted' ? false : ''
            }
          })
          this.$set(data, data.length, row)
          this.$refs[self.id][0].doLayout() // 解决高度问题 不出现滚动条
        }
      }
      METHODS[type]()
    },
    clearChildRowData(row) {
      Object.keys(row).forEach(key => {
        row[key].forEach(child => {
          Object.keys(child).forEach(item => {
            if (item === '__children') this.clearChildRowData(child.__children)
            else {
              child[item] = item === '__isDeleted' ? false : ''
            }
          })
        })
      })
    },
    changeIndex(parent, self, scope) {
      // 修改对应table 的行下标
      this.index[self.id] = scope.$index
    },
    getSelect(sn, tab) {
      if (tab.selectValue.length === 0) {
        this.$api.record.getSJTree('dossier', {
          sn,
          ztsn: this.from === 'treatment' ? this.ztsn : ''
        }).then(s => {
          const { list } = s.data
          this.$set(tab, 'selectValue', [...list])
        }).catch(e => {
          this.$message.error(e.message)
        })
      }
    },
    setData(val) {
      this.$set(val, 'selectValue', [])
    }
  }
}
</script>

<style lang="scss">
  .el-table .warning-row {
    background: #f2f6fc;
  }
  .el-table th, .el-table tr {
    background: #fff;
  }
</style>
