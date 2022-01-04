<template>
  <el-dialog
    v-dialogDrag
    :modal="false"
    width="600px"
    :visible.sync="show"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :before-close="() => $emit('update:show', false)"
  >
    <div slot="title">
      SQL{{ type === 'SqlExecute' ? '执行' : type === 'SqlInput' ? '输入' : '输出' }}
    </div>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="mini"
      label-width="60px"
    >
      <el-form-item label="数据源" prop="dataSourceName">
        <el-popover
          placement="bottom-start"
          width="500"
          trigger="click"
        >
          <div style="width: 100%; height: 300px;">
            <Tree
              :data="tree.data"
              in-box
              @setTargetNode="setTargetNode"
            />
          </div>
          <el-input slot="reference" v-model="form.dataSourceName" readonly />
        </el-popover>
      </el-form-item>
      <el-form-item label="SQL" prop="sql">
        <el-input v-model="form.sql" type="textarea" :rows="5" />
      </el-form-item>
      <el-form-item v-if="['SqlInput', 'SqlOutput'].includes(type)" label="字段" prop="fields">
        <el-table
          ref="table"
          :data="form.fields || []"
          height="300px"
          size="mini"
          :header-row-style="{ align: 'center' }"
        >
          <el-table-column
            v-for="col in columns"
            :key="col.prop"
            :label="col.label"
            :prop="col.prop"
          >
            <template slot-scope="scope">
              <el-input v-if="col.type === 'input'" v-model="scope.row[col.prop]" />
              <el-select v-if="col.type === 'select'" v-model="scope.row[col.prop]">
                <el-option
                  v-for="op in outFields"
                  :key="op.field"
                  :label="op.field"
                  :value="op.field"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <div slot="header">
              <span style="padding-right: 10px;">操作</span>
              <el-button
                type="text"
                size="mini"
                icon="el-icon-circle-plus"
                @click="rowHeadersHandler"
              />
            </div>
            <template slot-scope="scope">
              <span v-if="type === 'SqlOutput'">
                <el-button
                  v-show="scope.$index !== 0"
                  size="mini"
                  type="text"
                  icon="el-icon-arrow-up"
                  title="上移"
                  style="margin-right: 5px;"
                  @click="toolsHandler('up', scope)"
                />
                <el-button
                  v-show="scope.$index !== form.fields.length - 1"
                  type="text"
                  size="mini"
                  icon="el-icon-arrow-down"
                  title="下移"
                  style="margin: 0 5px 0 0"
                  @click="toolsHandler('down', scope)"
                />
              </span>
              <el-button
                type="text"
                size="small"
                icon="el-icon-delete"
                @click="toolsHandler('del', scope)"
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
      type: Object,
      default: () => {}
    },
    type: {
      type: String,
      default: 'SqlInput'
    },
    outFields: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      form: {
        dataSourceName: '',
        dataSource: '',
        fields: [],
        sql: ''
      },
      rules: {
        dataSourceName: [{ required: true, message: '请选择数据源！', trigger: 'change' }],
        sql: [{ required: true, message: '请填写Sql语句', trigger: 'blur' }],
        fields: [{ required: true, message: '请添加字段', trigger: 'blur' }]
      },
      tree: {
        data: []
      }
    }
  },
  computed: {
    columns() {
      const { type } = this
      return [
        { label: '字段', prop: 'field', type: type === 'SqlInput' ? 'input' : 'select' }
      ]
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
  created() {
    this.getDataResource()
  },
  methods: {
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const result = this.checkFields(this.form.fields)
          if (result.success) {
            this.$emit('setNodeDatas', {
              type: this.type,
              data: this.form
            })
            this.$emit('update:show', false)
          } else this.$message.warning(result.message)
        }
      })
    },
    checkFields() {
      if (this.type === 'SqlExecute') {
        return {
          success: true
        }
      }
      const { fields } = this.form
      // eslint-disable-next-line no-control-regex
      const reg = /[~#^$@%&!*()<>:;'"{}【】 ]/gi
      const result = {
        success: true,
        message: ''
      }
      for (let i = 0, len = fields.length; i < len; i++) {
        if (fields[i].field === '') {
          result.success = false
          result.message = `第${i + 1}行字段为空!`
          break
        }
        if (reg.test(fields[i].field)) {
          result.success = false
          result.message = `第${i + 1}行字段包含特殊字符!`
          break
        }
        if (!isNaN(fields[i].field[0])) {
          result.success = false
          result.message = `第${i + 1}行字段首字符不能为数字!`
          break
        }
      }
      return result
    },
    rowHeadersHandler(data) {
      this.$set(this.form.fields, this.form.fields.length, {
        field: ''
      })
    },
    toolsHandler(type, scope) {
      const { $index } = scope
      const METHODS = {
        up: () => {
          if ($index !== 0) {
            // eslint-disable-next-line prefer-destructuring
            this.form.fields[$index] = this.form.fields.splice($index - 1, 1, this.form.fields[$index])[0]
          }
        },
        down: () => {
          // eslint-disable-next-line prefer-destructuring
          this.form.fields[$index] = this.form.fields.splice($index + 1, 1, this.form.fields[$index])[0]
        },
        del: () => {
          this.form.fields.splice(scope.$index, 1)
        }
      }
      METHODS[type]()
    },
    setTargetNode(node) {
      if (node.dataSourceSn) {
        this.form.dataSource = node.dataSourceSn
        this.form.dataSourceName = node.dataSourceName
      }
    },
    getDataResource() {
      this.$api.mxGraph.getDataResource({
        rootName: '系统数据源'
      }).then(s => {
        this.tree.data = s.data
      }).catch(e => this.$message.error(e.message))
    }
  }
}
</script>

<style>

</style>
