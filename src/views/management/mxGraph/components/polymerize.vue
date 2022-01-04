<template>
  <el-dialog
    v-dialogDrag
    :modal="false"
    width="900px"
    :visible.sync="show"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :before-close="() => $emit('update:show', false)"
  >
    <div slot="title">
      聚合
    </div>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="mini"
      label-width="0px"
      inline-message
    >
      <el-table
        ref="table"
        :data="form.out"
        size="mini"
        style="width: 100%"
        height="400px"
        @row-click="rowClick"
        @selection-change="selectionChange"
      >
        <el-table-column type="selection" />
        <el-table-column label="字段名称" prop="field">
          <template slot-scope="scope">
            <el-form-item
              :prop="'out.'+ scope.$index + '.field'"
              :rules="rules.field"
            >
              <el-input v-model="scope.row.field" size="mini" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="是否分组" prop="group">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.group"
              size="mini"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="true"
              :inactive-value="false"
              active-text="是"
              inactive-text="否"
              @change="checkActionValue(scope)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作类型" prop="action" width="110">
          <template slot-scope="scope">
            <el-select
              v-if="scope.row.group"
              v-model="scope.row.action"
              size="mini"
            >
              <el-option
                v-for="item in groups"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-select
              v-else
              v-model="scope.row.action"
              size="mini"
            >
              <el-option
                v-for="item in actions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="值描述" prop="value" width="140">
          <template slot-scope="scope">
            <el-form-item
              v-if="['carry','max', 'mix', 'min','sum','avg','join', 'fill'].includes(scope.row.action)"
              :prop="'out.'+ scope.$index + '.value'"
              :rules="rules.field"
            >
              <el-input
                v-if="scope.row.action === 'fill'"
                v-model="scope.row.value"
                size="mini"
              />
              <el-select v-else v-model="scope.row.value">
                <el-option
                  v-for="f in fields"
                  :key="f"
                  :label="f"
                  :value="f"
                />
              </el-select>
            </el-form-item>
            <el-input
              v-else
              v-model="scope.row.value"
              size="mini"
            />
          </template>
        </el-table-column>
        <el-table-column label="连接符" prop="separator" width="80">
          <template slot-scope="scope">
            <el-input v-model="scope.row.separator" size="mini" />
          </template>
        </el-table-column>
        <el-table-column label="小数位数" prop="scale" width="80">
          <template slot-scope="scope">
            <el-form-item
              :prop="'out.' + scope.$index + '.scale'"
              :rules="rules.scale"
            >
              <el-input v-model.number="scope.row.scale" type="number" size="mini" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot="header" slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              icon="el-icon-circle-plus"
              @click="addRow(scope)"
            />
            <el-button
              type="text"
              size="mini"
              icon="el-icon-delete"
              @click="deleteRows"
            />
          </template>
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              icon="el-icon-delete"
              @click="deleteRows([scope.row])"
            />
          </template>
        </el-table-column>
      </el-table>
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
    const checkScale = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('小数位数不能为空！'))
      } else if (value < 0) {
        callback(new Error('小数位数不能小于0！'))
      } else callback()
    }
    return {
      form: {
        out: []
      },
      rules: {
        field: [{ required: true, message: '必填', trigger: 'blur' }],
        scale: [{ required: true, validator: checkScale, trigger: 'blur' }]
      },
      selections: [],
      fields: []
    }
  },
  computed: {
    actions() {
      const arr = [
        { label: '舍弃', value: 'abandon' },
        { label: '统计', value: 'count' },
        { label: '相加', value: 'sum' },
        { label: '最大值', value: 'max' },
        { label: '最小值', value: 'min' },
        { label: '平均值', value: 'avg' },
        { label: '占比化', value: 'mix' },
        { label: '连接', value: 'join' },
        { label: '填充', value: 'fill' },
        { label: '携带', value: 'carry' }
      ]
      const { out } = this.form
      return out.some((o => o.group)) ? arr.slice(0, -1) : arr
    },
    groups() {
      return [
        { label: '填充', value: 'fill' },
        { label: '携带', value: 'carry' }
      ]
    }
  },
  watch: {
    sources: {
      immediate: true,
      handler: 'getDefaultFields'
    },
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
            ...clone,
            original: clone
          }
          this.$emit('setNodeDatas', {
            type: 'Polymerize',
            data: params
          })
          this.$emit('update:show', false)
        }
      })
    },
    rowClick(row) {
      this.targetRow = { ...row }
    },
    actionChange(row) {
      row.value = ''
    },
    checkActionValue(scope) {
      const { row, $index } = scope
      const { out } = this.form
      if (row.group) {
        out.forEach((o, i) => {
          if (i === $index) {
            o.action = 'carry'
          } else {
            o.action === 'carry' && !o.group && (o.action = 'abandon')
          }
        })
      }
    },
    selectionChange(selection) {
      this.selections = selection
    },
    addRow() {
      this.$set(this.form.out, this.form.out.length, {
        field: '',
        group: false,
        action: 'abandon',
        value: '',
        separator: '',
        scale: 2
      })
    },
    deleteRows(rows) {
      const dels = Array.isArray(rows) ? rows : this.selections
      dels.forEach(d => {
        const index = this.form.out.indexOf(d)
        index !== -1 && this.form.out.splice(index, 1)
      })
    },
    setDefaultTableDatas(arr = []) {
      const uniqueArr = Array.from(new Set(arr))
      this.fields = [...uniqueArr]
      uniqueArr.forEach((u, i) => {
        this.$set(this.form.out, i, {
          field: u,
          group: false,
          action: 'carry',
          value: u,
          separator: '',
          scale: 2
        })
      })
    },
    getDefaultFields(arr) {
      const defaults = []
      arr.forEach(a => {
        if (a.data?.out.length) {
          if (a.data.type !== 'SqlOutput') {
            defaults.push(...a.data.out?.map(o => o.field))
          }
        }
      })
      this.setDefaultTableDatas(defaults)
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-form-item {
    margin-bottom: 0px!important;
  }
</style>
