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
      常量数据
    </div>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="mini"
      label-width="0px"
      inline-message
    >
      <el-row>
        <el-col :span="2">
          <p style="font-size: 12px">
            字段
          </p>
          <el-button
            type="text"
            size="mini"
            @click="addOutRow"
          >
            新增
          </el-button>
          <el-button
            type="text"
            size="mini"
            style="margin-left: 0px;"
            @click="delOutRows"
          >
            删除
          </el-button>
        </el-col>
        <el-col :span="22">
          <el-table
            ref="table-1"
            :data="form.out"
            size="mini"
            style="width: 100%"
            height="250px"
            @selection-change="outTableSelection"
          >
            <el-table-column type="selection" />
            <el-table-column label="名称" prop="field">
              <template slot-scope="scope">
                <el-input v-model="scope.row.field" size="mini" />
              </template>
            </el-table-column>
            <el-table-column label="常量" prop="constant">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.constant"
                  size="mini"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  :active-value="true"
                  :inactive-value="false"
                  active-text="是"
                  inactive-text="否"
                />
              </template>
            </el-table-column>
            <el-table-column label="类型" prop="type">
              <template slot-scope="scope">
                <el-select v-model="scope.row.type" size="mini">
                  <el-option
                    v-for="type in types"
                    :key="type.value"
                    :label="type.label"
                    :value="type.value"
                  />
                </el-select>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row v-if="colmuns.length">
        <el-col :span="2">
          <p style="font-size: 12px">
            数据
          </p>
          <el-button
            type="text"
            size="mini"
            @click="addInRow"
          >
            新增
          </el-button>
          <el-button
            type="text"
            size="mini"
            style="margin-left: 0px;"
            @click="delInRows"
          >
            删除
          </el-button>
        </el-col>
        <el-col :span="22">
          <el-table
            ref="in"
            :data="form.in.datas"
            size="mini"
            style="width: 100%"
            height="250px"
            @selection-change="inTableSelection"
          >
            <el-table-column type="selection" />
            <el-table-column
              v-for="col in colmuns"
              :key="col.prop"
              :label="col.prop"
              :prop="col.prop"
            >
              <template slot-scope="scope">
                <el-form-item
                  label-width="0"
                  :prop="'in.datas.' + scope.$index + '.' + col.prop"
                  :rules="rules[col.type]"
                >
                  <el-input
                    v-model="scope.row[col.prop]"
                    :type="!col.constant ? 'text' : col.type !== 'STRING' ? 'number' : 'text' "
                  />
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
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
    datas: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      form: {
        in: {
          datas: []
        },
        out: []
      },
      types: [
        { label: '字符串', value: 'STRING' },
        { label: '整数', value: 'INT' },
        { label: '小数', value: 'DOUBLE' }
      ],
      rules: {
        DOUBLE: [{ required: true, message: '必填', trigger: 'blur' }],
        INT: [{ required: true, message: '必填', trigger: 'blur' }],
        STRING: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      selections: {
        in: [],
        out: []
      }
    }
  },
  computed: {
    colmuns() {
      const { out } = this.form
      const props = out.filter(d => !!d.field).map(d => ({
        prop: d.field,
        type: d.type,
        constant: d.constant
      }))
      return Array.from(new Set(props)) || []
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
            ...clone,
            original: clone
          }
          this.$emit('setNodeDatas', {
            type: 'ConstantData',
            data: params
          })
          this.$emit('update:show', false)
        }
      })
    },
    inTableSelection(selection) {
      this.selections.in = selection
    },
    outTableSelection(selection) {
      this.selections.out = selection
    },
    delInRows() {
      this.selections.in.forEach(s => {
        const index = this.form.in.datas.indexOf(s)
        index !== -1 && this.form.in.datas.splice(index, 1)
      })
    },
    delOutRows() {
      this.selections.out.forEach(s => {
        const index = this.form.out.indexOf(s)
        index !== -1 && this.form.out.splice(index, 1)
      })
    },
    addInRow() {
      const row = {}
      this.colmuns.forEach(col => {
        row[col.prop] = ['INT', 'DOUBLE'].includes(col.type) ? 0 : ''
      })
      this.$set(this.form.in.datas, this.form.in.datas.length, row)
    },
    addOutRow() {
      this.$set(this.form.out, this.form.out.length, {
        field: '',
        constant: true,
        type: 'STRING'
      })
    }
  }
}
</script>

<style>

</style>
