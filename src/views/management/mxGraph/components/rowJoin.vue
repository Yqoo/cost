<template>
  <el-dialog
    v-dialogDrag
    :modal="false"
    width="800px"
    :visible.sync="show"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :before-close="() => $emit('update:show', false)"
  >
    <div slot="title">
      行融合
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
          <el-table-column label="主类型" prop="mainType">
            <template slot-scope="scope">
              <el-select v-model="scope.row.mainType">
                <el-option label="携带" value="carry" />
                <el-option label="计算" value="calc" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="值" prop="mainField">
            <template slot-scope="scope">
              <el-select v-if="scope.row.mainType === 'carry'" v-model="scope.row.mainField">
                <el-option
                  v-for="op in sources.filter(s => s.id === form.main)[0].data.out || []"
                  :key="op.field"
                  :value="op.field"
                  :label="op.field"
                />
              </el-select>
              <el-input v-else v-model="scope.row.mainField" />
            </template>
          </el-table-column>
          <el-table-column label="次类型" prop="otherType">
            <template slot-scope="scope">
              <el-select v-model="scope.row.otherType">
                <el-option label="携带" value="carry" />
                <el-option label="计算" value="calc" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="次值" prop="otherField">
            <template slot-scope="scope">
              <el-select v-if="scope.row.otherType === 'carry'" v-model="scope.row.otherField">
                <el-option
                  v-for="op in sources.filter(s => s.id === form.other)[0].data.out || []"
                  :key="op.field"
                  :value="op.field"
                  :label="op.field"
                />
              </el-select>
              <el-input v-else v-model="scope.row.otherField" />
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
        out: []
      },
      rules: {
        main: [{ required: true, validator: checkMain, trigger: 'change' }],
        other: [{ required: true, validator: checkOther, trigger: 'change' }],
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
          const params = {
            in: {
              main: {
                id: clone.main
              },
              other: {
                id: clone.other
              }
            },
            out: clone.out,
            original: clone
          }
          this.$emit('setNodeDatas', {
            type: 'RowJoin',
            data: params
          })
          this.$emit('update:show', false)
        }
      })
    },
    mainChange(val) {
      val && this.clearFiledsValue('main')
    },
    otherChange(val) {
      val && this.clearFiledsValue('other')
    },
    clearFiledsValue(name) {
      this.form.out.forEach(o => {
        o[`${name}Type`] === 'carry' ? o[`${name}Field`] = '' : ''
      })
    },
    delOutRow(scope) {
      this.form.out.splice(scope.$index, 1)
    },
    addOutRow() {
      this.$set(this.form.out, this.form.out.length, {
        field: '',
        mainType: '',
        mainField: '',
        otherType: '',
        otherField: '',
        defaultValue: ''
      })
    }
  }
}
</script>
