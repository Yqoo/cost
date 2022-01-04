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
      列融合
    </div>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="mini"
      label-width="70px"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="主数据" prop="main">
            <el-select v-model="form.main" @change="mainChange">
              <el-option
                v-for="op in sources"
                :key="op.id"
                :value="op.id"
                :label="op.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="次数据" prop="other">
            <el-select v-model="form.other" @change="otherChange">
              <el-option
                v-for="op in sources"
                :key="op.id"
                :value="op.id"
                :label="op.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item v-if="form.main && form.other" label="比对字段" prop="comparison">
        <el-table
          ref="table"
          :data="form.comparison"
          size="mini"
          style="width: 100%;"
          height="200px"
        >
          <el-table-column label="次数据字段" prop="other">
            <template slot-scope="scope">
              <el-select v-model="scope.row.other">
                <el-option
                  v-for="op in sources.filter(s => s.id === form.other)[0].data.out"
                  :key="op.field"
                  :value="op.field"
                  :label="op.field"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="主数据字段" prop="main">
            <template slot-scope="scope">
              <el-select v-model="scope.row.main">
                <el-option
                  v-for="op in sources.filter(s => s.id === form.main)[0].data.out"
                  :key="op.field"
                  :value="op.field"
                  :label="op.field"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column>
            <div slot="header">
              <span style="padding-right: 5px;">操作</span>
              <el-button
                type="text"
                size="small"
                icon="el-icon-circle-plus"
                title="新增"
                @click="addComparisonRow"
              />
            </div>
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                icon="el-icon-delete"
                title="删除"
                @click="delComparisonRow(scope)"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item v-if="form.main && form.other" label="输出字段" prop="out">
        <el-table
          ref="table"
          :data="form.out"
          size="mini"
          style="width: 100%;"
          height="200px"
        >
          <el-table-column label="名称" prop="field">
            <template slot-scope="scope">
              <el-input v-model="scope.row.field" />
            </template>
          </el-table-column>
          <el-table-column label="来源" prop="from">
            <template slot-scope="scope">
              <el-select v-model="scope.row.from">
                <el-option label="主数据" value="main" />
                <el-option label="次数据" value="other" />
                <el-option label="计算" value="calc" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="值" prop="value">
            <template slot-scope="scope">
              <el-select v-if="['main', 'other'].includes(scope.row.from)" v-model="scope.row.value">
                <el-option
                  v-for="op in sources.filter(s => s.id === form[scope.row.from])[0].data.out || []"
                  :key="op.field"
                  :value="op.field"
                  :label="op.field"
                />
              </el-select>
              <el-input v-else v-model="scope.row.value" />
            </template>
          </el-table-column>
          <el-table-column label="默认值" prop="defaultValue">
            <template slot-scope="scope">
              <el-input v-model="scope.row.defaultValue" />
            </template>
          </el-table-column>
          <el-table-column>
            <div slot="header">
              <span style="padding-right: 5px;">操作</span>
              <el-button
                type="text"
                size="small"
                icon="el-icon-circle-plus"
                title="新增"
                @click="addOutRow"
              />
            </div>
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                icon="el-icon-delete"
                title="删除"
                @click="delOutRow(scope)"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="info" size="mini" @click="() => $emit('update:show', false)">
        取消
      </el-button>
      <el-button type="primary" size="mini" @click="save">
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
    sources: {
      type: Array,
      default: () => []
    },
    datas: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    const checkMain = (rule, value, callback) => {
      if (value === '') callback(new Error('请选择主数据！'))
      else {
        if (this.form.other !== '') {
          this.$refs.form.validateField('other')
        }
        callback()
      }
    }
    const checkOther = (rule, value, callback) => {
      if (value === '') callback(new Error('请选择次数据！'))
      else if (value === this.form.main) {
        callback(new Error('主数据与次数据值不能相同！'))
      } else {
        callback()
      }
    }
    const checkComparison = (rule, value, callback) => {
      if (value.length === 0) callback(new Error('至少一行有效数据！'))
      else if (value[0].main && value[0].other) callback()
      else callback(new Error('至少一行有效数据！'))
    }
    const checkOut = (rule, value, callback) => {
      const fields = value.map(v => v.field)
      if (fields.some(f => f === '')) callback(new Error('输出字段名称不能为空！'))
      if (fields.length !== [...new Set(fields)].length) callback(new Error('输出字段名称存在重复！'))
      callback()
    }
    return {
      form: {
        main: '',
        other: '',
        comparison: [],
        out: []
      },
      rules: {
        main: [{ required: true, validator: checkMain, trigger: 'change' }],
        other: [{ required: true, validator: checkOther, trigger: 'change' }],
        comparison: [{ required: true, validator: checkComparison, trigger: 'change' }],
        out: [{ required: true, validator: checkOut, trigger: 'change' }]
      }
    }
  },
  watch: {
    datas: {
      immediate: true,
      handler(obj) {
        if (JSON.stringify(obj) !== '{}') {
          this.form = this.$tools.deepClone(obj)
        }
      }
    }
  },
  methods: {
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const clone = this.$tools.deepClone(this.form)
          const otherKeysObj = {}
          const mainKeysArr = []
          clone.comparison.forEach(com => {
            mainKeysArr.push(com.main)
            otherKeysObj[com.other] = com.main
          })
          const params = {
            in: {
              main: {
                id: clone.main,
                keys: mainKeysArr
              },
              other: {
                id: clone.other,
                keys: otherKeysObj
              }
            },
            out: clone.out,
            original: clone
          }
          this.$emit('setNodeDatas', {
            type: 'ColumnJoin',
            data: params
          })
          this.$emit('update:show', false)
        }
      })
    },
    mainChange(main) {
      this.form.out = this.form.out.filter(o => !o.auto)
      const rows = this.sources.filter(s => s.id === main)[0].data
      this.form.out.forEach(r => {
        r.from === 'main' ? r.value = '' : ''
      })
      this.form.comparison.forEach(c => {
        c.main = ''
      })
      if (Array.isArray(rows.out)) {
        rows.out.forEach(row => {
          this.$set(this.form.out, this.form.out.length, {
            field: row.field,
            from: 'main',
            value: row.field,
            defaultValue: '',
            auto: true
          })
        })
      }
    },
    otherChange(other) {
      if (other) {
        this.form.comparison.forEach(c => { c.other = '' })
        this.form.out.forEach(o => {
          o.from === 'other' ? o.value = '' : ''
        })
      }
    },
    delOutRow(scope) {
      this.form.out.splice(scope.$index, 1)
    },
    addOutRow() {
      this.$set(this.form.out, this.form.out.length, {
        field: '',
        from: '',
        value: '',
        defaultValue: ''
      })
    },
    delComparisonRow(scope) {
      this.form.comparison.splice(scope.$index, 1)
    },
    addComparisonRow() {
      this.$set(this.form.comparison, this.form.comparison.length, {
        main: '',
        other: ''
      })
    }
  }
}
</script>
