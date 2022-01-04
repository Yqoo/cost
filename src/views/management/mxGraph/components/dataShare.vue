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
      数据分摊
    </div>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="mini"
      inline-message
    >
      <el-row>
        <el-col :span="8">
          <el-form-item label="主数据" label-width="70px" prop="main">
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
        <el-col :span="8">
          <el-form-item label="次数据" label-width="70px" prop="other">
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
        <el-col :span="8">
          <el-form-item label="高级分摊" label-width="70px" prop="advanced">
            <el-radio v-model="form.advanced" :label="true">
              启用
            </el-radio>
            <el-radio v-model="form.advanced" :label="false">
              停用
            </el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="输出字段" label-width="70px">
        <el-button-group>
          <el-button
            v-for="tag in values"
            :key="tag.field"
            size="mini"
          >
            {{ tag.field }}
          </el-button>
        </el-button-group>
      </el-form-item>
      <el-table
        v-if="form.advanced"
        :data="form.relations"
        size="mini"
        style="width: 100%"
        height="200px"
      >
        <el-table-column label="主数据字段" prop="mainField">
          <template slot-scope="scope">
            <el-form-item
              :prop="'relations.' + scope.$index + '.mainField'"
              :rules="rules.mainField"
              label=""
              class="table-form-item"
            >
              <el-select v-model="form.relations[scope.$index].mainField" size="mini">
                <el-option
                  v-for="op in mainFields"
                  :key="op.field"
                  :value="op.field"
                  :label="op.field"
                />
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="次数据字段" prop="otherField">
          <template slot-scope="scope">
            <el-form-item
              label=""
              :prop="'relations.' + scope.$index + '.otherField'"
              :rules="rules.otherField"
            >
              <el-select v-model="form.relations[scope.$index].otherField">
                <el-option
                  v-for="op in otherFields"
                  :key="op.field"
                  :value="op.field"
                  :label="op.field"
                />
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column width="70px">
          <template slot="header" slot-scope="scope">
            <el-button
              type="text"
              size="small"
              icon="el-icon-circle-plus"
              title="新增"
              @click="addRelation(scope)"
            />
          </template>
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              icon="el-icon-delete"
              title="删除"
              @click="delRelation(scope)"
            />
          </template>
        </el-table-column>
      </el-table>
      <el-table
        :data="form.fields"
        size="mini"
        style="width: 100%"
        height="200px"
      >
        <el-table-column label="分摊字段" prop="shareKey">
          <template slot-scope="scope">
            <el-form-item
              :prop="'fields.' + scope.$index + '.shareKey'"
              :rules="rules.shareKey"
              label=""
              class="table-form-item"
            >
              <el-select v-model="form.fields[scope.$index].shareKey" size="mini">
                <el-option
                  v-for="op in mainFields"
                  :key="op.field"
                  :value="op.field"
                  :label="op.field"
                />
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="参数字段" prop="paramKey">
          <template slot-scope="scope">
            <el-form-item
              label=""
              :prop="'fields.' + scope.$index + '.paramKey'"
              :rules="rules.paramKey"
            >
              <el-select v-model="form.fields[scope.$index].paramKey">
                <el-option
                  v-for="op in otherFields"
                  :key="op.field"
                  :value="op.field"
                  :label="op.field"
                />
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="值字段" prop="valueKey">
          <template slot-scope="scope">
            <el-form-item
              label=""
              :prop="'fields.' + scope.$index + '.valueKey'"
              :rules="rules.valueKey"
            >
              <el-select
                v-model="form.fields[scope.$index].valueKey"
                filterable
                allow-create
                default-first-option
              >
                <el-option
                  v-for="op in otherFields"
                  :key="op.field"
                  :value="op.field"
                  :label="op.field"
                />
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="模式" prop="model">
          <template slot-scope="scope">
            <el-form-item label="" prop="model">
              <el-radio v-model="form.fields[scope.$index].model" label="ADD">
                累计
              </el-radio>
              <el-radio v-model="form.fields[scope.$index].model" label="SET">
                赋值
              </el-radio>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column width="70px">
          <template slot="header" slot-scope="scope">
            <el-button
              type="text"
              size="small"
              icon="el-icon-circle-plus"
              title="新增"
              @click="addNewRow(scope)"
            />
          </template>
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              icon="el-icon-delete"
              title="删除"
              @click="delFields(scope)"
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
    return {
      form: {
        main: '',
        other: '',
        out: [],
        fields: [],
        advanced: false,
        relations: []
      },
      rules: {
        main: [{ required: true, validator: checkMain, trigger: 'change' }],
        other: [{ required: true, validator: checkOther, trigger: 'change' }],
        shareKey: [{ required: true, message: '请选择分摊字段', trigger: 'change' }],
        paramKey: [{ required: true, message: '请选择参数字段', trigger: 'change' }],
        valueKey: [{ required: true, message: '请选择值字段', trigger: 'change' }],
        otherField: [{ required: true, message: '请选择次数据字段', trigger: 'change' }],
        mainField: [{ required: true, message: '请选择主数据字段', trigger: 'change' }]
      }
    }
  },
  computed: {
    values() {
      const { otherFields } = this
      const fixs = otherFields.map(o => o.field)
      const valueKey = this.form.fields.map(f => f.valueKey)?.filter(f => f && !fixs.includes(f))
      return [...otherFields, ...valueKey.map(v => ({
        field: v
      }))]
    },
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
          this.form.relations || this.$set(this.form, 'relations', [])
          this.form.advanced || this.$set(this.form, 'advanced', false)
        }
      }
    }
  },
  methods: {
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const clone = this.$tools.deepClone(this.form)
          if (this.form.fields.length) {
            const params = {
              in: {
                main: {
                  id: clone.main
                },
                other: {
                  id: clone.other
                },
                fields: clone.fields,
                advanced: clone.advanced,
                relations: clone.relations
              },
              out: this.values,
              original: clone
            }
            this.$emit('setNodeDatas', {
              type: 'DataShare',
              data: params
            })
            this.$emit('update:show', false)
          } else this.$message.warning('分摊数据至少存在一行！')
        }
      })
    },
    addRelation() {
      this.$set(this.form.relations, this.form.relations.length, {
        mainField: '', otherField: ''
      })
    },
    delRelation(scope) {
      this.form.relations.splice(scope.$index, 1)
    },
    addNewRow() {
      this.$set(this.form.fields, this.form.fields.length, {
        shareKey: '', paramKey: '', valueKey: '', model: 'ADD'
      })
    },
    delFields(scope) {
      this.form.fields.splice(scope.$index, 1)
    },
    mainChange(val) {
      if (val) {
        this.form.fields.forEach(f => {
          f.shareKey = ''
        })
        this.form.relations.forEach(f => {
          f.mainField = ''
        })
      }
    },
    otherChange(val) {
      if (val) {
        this.form.fields.forEach(f => {
          f.paramKey = ''
          f.valueKey = ''
        })
        this.form.relations.forEach(f => {
          f.otherField = ''
        })
        this.form.out.forEach(o => {
          o.field = ''
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-form-item {
    margin-bottom: 5px!important;
  }
  .showFieldsDiv {
    margin: 10px 0px;
    span {
      padding-right: 10px;
    }
  }
</style>
