<template>
  <div>
    <el-table
      ref="table"
      :data="tableData"
      size="mini"
      style="width: 100%"
      border
    >
      <el-table-column v-if="[2, 3].includes(type)" label="操作" width="120" fixed="left">
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
      <el-table-column label="显示宽度" prop="width">
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
      <el-table-column label="隐藏" prop="hidden" align="center" width="70">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.hidden" :disabled="scope.row.required" />
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
      <el-table-column label="排序" prop="sort_" align="center" width="70">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.sort_"
            type="number"
            @blur="() => scope.row.sort_ = scope.row.sort_ < 0 ? 0 : scope.row.sort_"
          />
        </template>
      </el-table-column>
      <el-table-column v-if="type === 2" label="标记" prop="flag" align="center" width="70">
        <template slot-scope="scope">
          {{ scope.row.flag === 'jx' ? '解析' : '添加' }}
        </template>
      </el-table-column>
      <el-table-column label="水平位置" prop="position" width="100">
        <template slot-scope="scope">
          <el-select v-model="scope.row.position">
            <el-option label="靠左" value="left" />
            <el-option label="居中" value="center" />
            <el-option label="靠右" value="right" />
          </el-select>
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
      <el-table-column label="长度" prop="len">
        <template slot-scope="scope">
          <el-input v-model="scope.row.len" />
        </template>
      </el-table-column>
      <el-table-column label="值配置" prop="value" width="150">
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
          <div v-else-if="['Float', 'Int', 'Money'].includes(scope.row.type)">
            <el-input v-model="scope.row.sym" style="margin-bottom:5px;">
              <template slot="prepend">
                前置符号
              </template>
            </el-input>
            <el-input
              v-if="scope.row.type !== 'Int'"
              v-model="scope.row.digit"
              style="margin-bottom:5px;"
              type="number"
            >
              <template slot="prepend">
                小数位数
              </template>
            </el-input>
            <el-checkbox v-model="scope.row.percent">
              千分位
            </el-checkbox>
          </div>
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
    dossier: () => import('./dossier')
  },
  props: {
    type: {
      type: Number,
      default: 3
    },
    meta: {
      type: Object,
      default: () => {}
    },
    ztsn: {
      type: String,
      default: ''
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
          // eslint-disable-next-line prefer-destructuring
          this.tableData[$index] = this.tableData.splice($index + 1, 1, this.tableData[$index])[0]
        },
        del: () => {
          this.tableData.splice($index, 1)
        }
      }
      METHODS[type]()
    },
    setReruied(index) {
      if (this.tableData[index].singleFlag) this.tableData[index].required = true
    },
    changeReuired(index) {
      if (!this.tableData[index].required) {
        this.tableData[index].isSnField = false
        this.tableData[index].isNameField = false
        this.tableData[index].singleFlag = false
      } else {
        this.tableData[index].hidden = false
      }
    },
    changeStatus(index, type) {
      for (let i = 0; i < this.tableData.length; i++) {
        if (i === index) {
          if (this.tableData[i][type]) this.tableData[i].required = true
          // eslint-disable-next-line no-continue
          continue
        } else this.tableData[i][type] = false
      }
      const other = type === 'isSnField' ? 'isNameField' : 'isSnField'
      this.tableData[index][other] = false
    },
    initRows(rows) {
      rows.forEach((row, index) => {
        this.$set(this.tableData, index, row)
      })
    },
    setRows(rows) {
      const old = []
      const jx = []
      this.tableData.forEach(item => {
        item.flag === 'tj' ? old.push(item) : jx.push(item)
      })
      const names = jx.map(t => t.name)
      for (let k = jx.length - 1; k > 0; k--) {
        if (!rows.includes(jx[k].name)) jx.splice(k, 1)
      }
      const r = []
      rows.forEach(row => {
        if (!names.includes(row)) {
          r.push({
            name: row,
            title: row,
            width: 120,
            singleFlag: false,
            required: false,
            isSnField: false,
            isNameField: false,
            queryColumn: false,
            advancedQuery: false,
            type: 'Varchar',
            len: 40,
            value: '无',
            valueStr: '',
            flag: 'jx'
          })
        }
      })
      this.tableData = [...r, ...old, ...jx]
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
        position: 'center',
        type: 'Varchar',
        len: 40,
        value: '无',
        valueStr: '',
        sym: '￥',
        digit: '2',
        percent: true, // 数字 小数 整数 的值配置
        flag: 'tj',
        order_: 'asc',
        sort_: 0
      }
      this.tableData.push(row)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
