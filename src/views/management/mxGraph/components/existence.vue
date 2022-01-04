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
      存在性分组
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
                  v-for="op in otherFields"
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
                  v-for="op in mainFields"
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
      <el-form-item label="取值" prop="exists">
        <el-radio v-model="form.exists" :label="true">
          存在值
        </el-radio>
        <el-radio v-model="form.exists" :label="false">
          不存在值
        </el-radio>
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
    return {
      form: {
        main: '',
        other: '',
        comparison: [],
        exists: false
      },
      rules: {
        main: [{ required: true, validator: checkMain, trigger: 'change' }],
        other: [{ required: true, validator: checkOther, trigger: 'change' }],
        comparison: [{ required: true, validator: checkComparison, trigger: 'change' }]
      }
    }
  },
  computed: {
    mainFields() {
      const { main } = this.form
      const arr = this.sources.filter(s => s.id === main)[0]
      return arr ? arr.data.out : []
    },
    otherFields() {
      const { other } = this.form
      const arr = this.sources.filter(s => s.id === other)[0]
      return arr ? arr.data.out : []
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
          const main = this.sources.filter(s => s.id === this.form.main)[0]
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
              },
              exists: clone.exists
            },
            out: main.data ? main.data.out : [],
            original: clone
          }
          this.$emit('setNodeDatas', {
            type: 'Existence',
            data: params
          })
          this.$emit('update:show', false)
        }
      })
    },
    mainChange(val) {
      val && this.clearFieldsValue('main')
    },
    otherChange(val) {
      val && this.clearFieldsValue('other')
    },
    clearFieldsValue(name) {
      this.form.comparison.forEach(c => {
        c[name] = ''
      })
    },
    delOutRow(scope) {
      this.form.comparison.splice(scope.$index, 1)
    },
    addOutRow() {
      this.$set(this.form.comparison, this.form.comparison.length, {
        main: '',
        other: ''
      })
    }
  }
}
</script>
