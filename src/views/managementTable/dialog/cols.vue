<template>
  <div>
    <el-table
      ref="table"
      :data="tableData"
      size="mini"
      style="width: 100%"
      height="200px"
      border
    >
      <el-table-column label="操作" width="120" fixed="left">
        <template slot-scope="scope">
          <el-row>
            <el-col :span="8">
              <el-button
                v-show="scope.$index !== 0"
                size="mini"
                type="text"
                icon="el-icon-arrow-up"
                title="上移"
                @click="toolsHandler('up', scope)"
              />
            </el-col>
            <el-col :span="8">
              <el-button
                v-show="scope.$index !== tableData.length - 1"
                type="text"
                size="mini"
                icon="el-icon-arrow-down"
                title="下移"
                @click="toolsHandler('down', scope)"
              />
            </el-col>
            <el-col :span="8">
              <el-button
                type="text"
                size="mini"
                icon="el-icon-delete"
                title="删除"
                @click="toolsHandler('del', scope)"
              />
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="字段" prop="name">
        <template slot-scope="scope">
          <el-input v-model="scope.row.name" />
        </template>
      </el-table-column>
      <el-table-column label="标题" prop="title">
        <template slot-scope="scope">
          <el-input v-model="scope.row.title" />
        </template>
      </el-table-column>
      <el-table-column label="显示宽度" prop="width" width="100">
        <template slot-scope="scope">
          <el-input v-model="scope.row.width" />
        </template>
      </el-table-column>
      <el-table-column label="唯一标识" prop="singleFlag" align="center" width="70">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.singleFlag" @change="setReruied(scope.$index)" />
        </template>
      </el-table-column>
      <el-table-column label="必填" prop="required" align="center" width="70">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.required" @change="changeReuired(scope.$index)" />
        </template>
      </el-table-column>
      <el-table-column label="编码字段" prop="isSnField" align="center" width="70">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.isSnField" @change="changeStatus(scope.$index, 'isSnField')" />
        </template>
      </el-table-column>
      <el-table-column label="名称字段" prop="isNameField" align="center" width="70">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.isNameField" @change="changeStatus(scope.$index, 'isNameField')" />
        </template>
      </el-table-column>
      <el-table-column label="普通查询" prop="queryColumn" align="center" width="70">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.queryColumn" @change="queryChange(scope.$index, 'queryColumn')" />
        </template>
      </el-table-column>
      <el-table-column label="高级查询" prop="advancedQuery" align="center" width="70">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.advancedQuery" @change="queryChange(scope.$index, 'advancedQuery')" />
        </template>
      </el-table-column>
      <el-table-column label="隐藏" prop="hide" width="70">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.hide" :disabled="scope.row.required" />
        </template>
      </el-table-column>
      <el-table-column
        v-for="h in additionalHeaders"
        :key="h.prop"
        :prop="h.prop"
        :label="h.label"
        width="120"
      >
        <template slot-scope="scope">
          <el-select v-model="scope.row[h.prop]" clearable>
            <el-option
              v-for="op in options"
              :key="op.name"
              :label="op.label"
              :value="op.name"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="排序方式" prop="order_" align="center" width="100">
        <template slot-scope="scope">
          <el-select v-model="scope.row.order_">
            <el-option label="升序" value="asc" />
            <el-option label="倒序" value="desc" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="sort_" width="70">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.sort_"
            type="number"
            @blur="() => scope.row.sort_ = scope.row.sort_ < 0 ? 0 : scope.row.sort_"
          />
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="type" width="120">
        <template slot-scope="scope">
          <el-select v-model="scope.row.type">
            <el-option
              v-for="t in typeList"
              :key="t.value"
              :label="t.label"
              :value="t.value"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="长度" prop="len" width="70">
        <template slot-scope="scope">
          <el-input v-model="scope.row.len" />
        </template>
      </el-table-column>
      <el-table-column label="值定义" prop="value" width="150">
        <template slot-scope="scope">
          <el-select
            v-if="scope.row.type === 'date'"
            v-model="scope.row.value"
            placeholder="请选择时间格式"
          >
            <el-option
              v-for="dt in dateType"
              :key="dt"
              :label="dt"
              :value="dt"
            />
          </el-select>
          <el-input
            v-else-if="scope.row.type === 'systemDossier'"
            v-model="scope.row.valueStr"
            @focus="showDossier(scope.$index)"
          />
          <span v-else>
            {{ scope.row.value = '无' }}
          </span>
        </template>
      </el-table-column>
    </el-table>
    <dossier
      v-if="systemDossier.show"
      ref="dossier"
      :show.sync="systemDossier.show"
      :meta="meta"
      :info="info"
      :ztsn="ztsn"
      @hook:beforeDestroy="getColsValue"
    />
  </div>
</template>

<script>
export default {
  components: {
    dossier: () => import('@/components/record/dialog/dossier')
  },
  props: {
    meta: {
      type: Object,
      default: () => {}
    },
    ztsn: {
      type: String,
      default: ''
    },
    additionalHeaders: { // 额外的列头
      type: Array,
      default: () => []
    },
    options: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      tableData: [],
      typeList: [
        { label: '字符串', value: 'Varchar' },
        { label: '长文本', value: 'Text' },
        { label: '整数', value: 'Int' },
        { label: '小数', value: 'Float' },
        { label: '金额', value: 'Money' },
        { label: '时间', value: 'date' },
        { label: '系统档案', value: 'systemDossier' },
        { label: '布尔', value: 'Bit' }
      ],
      dateType: [
        'yyyy', 'yyyyMM', 'yyyyMMdd', 'yyyy-MM', 'yyyy-MM-dd', 'yyyy-MM-dd HH', 'yyyy-MM-dd HH:mm',
        'yyyy-MM-dd HH:mm:ss', 'yyyy/MM', 'yyyy/MM/dd', 'yyyy/MM/dd HH', 'yyyy/MM/dd HH:mm', 'yyyy/MM/dd HH:mm:ss',
        'yyyy年', 'yyyy年MM月', 'yyyy年MM月dd日', 'yyyy年MM月dd日 HH时', 'yyyy年MM月dd日 HH时mm分', 'yyyy年MM月dd日 HH时mm分ss秒',
        'yyyy年MM月dd日 HH:mm:ss'
      ],
      systemDossier: {
        show: false
      },
      colsIndex: null, // 选择时所在的行数
      info: null // 编辑系统值定义回显所需数据
    }
  },
  updated() {
    this.$nextTick(() => {
      this.$refs.table.doLayout()
    })
  },
  methods: {
    queryChange(index, prop) {
      const row = this.tableData[index]
      const MET = {
        advancedQuery: () => {
          if (row.queryColumn) row.advancedQuery = true
        },
        queryColumn: () => {
          this.$set(row, 'advancedQuery', !!row.queryColumn)
        }
      }
      MET[prop]()
    },
    getColsValue() {
      this.info = null
      const cols = this.$refs.dossier.form
      if (this.colsIndex !== null) {
        if (cols.useField.sn && cols.useField.name) {
          this.tableData[this.colsIndex].value = cols
          this.$set(this.tableData[this.colsIndex], 'valueStr', `${cols.snName}[${Object.values(cols.useField)}]`)
        }
      }
    },
    getTableData() {
      return this.tableData
    },
    clearTableOptions(prop) {
      this.tableData.forEach(t => {
        this.$set(t, prop, '')
      })
    },
    clearTable() {
      this.tableData = []
    },
    showDossier(index) {
      this.colsIndex = index
      this.info = this.tableData[index].value
      this.systemDossier.show = true
    },
    toolsHandler(type, scope) {
      const { $index } = scope
      const METHODS = {
        up: () => {
          if ($index !== 0) {
            // eslint-disable-next-line prefer-destructuring
            this.tableData[$index] = this.tableData.splice($index - 1, 1, this.tableData[$index])[0]
          }
        },
        down: () => {
          if ($index !== 0) {
            // eslint-disable-next-line prefer-destructuring
            this.tableData[$index] = this.tableData.splice($index + 1, 1, this.tableData[$index])[0]
          }
        },
        del: () => {
          this.tableData.splice($index, 1)
        }
      }
      METHODS[type]()
    },
    setReruied(index) {
      if (!this.tableData[index].required) this.tableData[index].required = true
    },
    changeReuired(index) {
      if (this.tableData[index].singleFlag) {
        this.tableData[index].singleFlag = false
      }
      this.tableData[index].hide = false
    },
    changeStatus(index, type) {
      for (let i = 0; i < this.tableData.length; i++) {
        if (i === index) {
          if (this.tableData[i][type]) this.tableData[i].required = true
          // eslint-disable-next-line no-continue
          continue
        } else this.tableData[i][type] = false
      }
    },
    initRows(rows) {
      rows.forEach((row, index) => {
        this.$set(this.tableData, index, row)
      })
    },
    setRows(rows) {
      const r = rows.map(row => ({
        name: row,
        title: row,
        width: 120,
        singleFlag: false,
        required: false,
        /* readonly: false, */
        hide: false,
        order_: 'asc',
        sort_: 0,
        type: 'Varchar',
        len: 40,
        value: '无',
        valueStr: ''
      }))
      this.tableData = [...r]
    },
    addRow(name) {
      const row = {
        name: name || '',
        title: '',
        width: 120,
        singleFlag: false,
        required: false,
        isSnField: false,
        isNameField: false,
        queryColumn: false,
        advancedQuery: false,
        /* readonly: false, */
        hide: false,
        order_: 'asc',
        sort_: 0,
        type: 'Varchar',
        len: 40,
        value: '无',
        valueStr: ''
      }
      this.tableData.push(row)
    }
  }
}
</script>

<style>

</style>
