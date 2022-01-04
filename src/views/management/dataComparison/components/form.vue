<template>
  <el-dialog
    v-dialogDrag
    :visible.sync="show"
    :modal="false"
    width="800px"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :before-close="() => $emit('update:show', false)"
  >
    <div slot="title">
      {{ id ? '编辑' : '新增' }}比对规则
    </div>
    <el-form
      ref="form"
      v-waiting="formLoading"
      :model="form"
      :rules="rules"
      size="mini"
      label-width="100px"
    >
      <div v-show="step === 1" class="stepBox">
        <el-form-item label="分类" prop="categoryName">
          <el-popover
            width="450"
            trigger="click"
            placement="bottom-start"
          >
            <div style="padding: 10px;">
              <Tree
                :data="tree.data || []"
                in-box
                default-expand-all
                @setTargetNode="setCategory"
              />
            </div>
            <el-input
              slot="reference"
              v-model="form.categoryName"
              clearable
              readonly
            />
          </el-popover>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="编码" prop="sn">
          <el-input v-model="form.sn" />
        </el-form-item>
        <el-form-item label="主数据配置" prop="mainSql">
          <el-input v-model="form.mainSql" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="目标数据配置" prop="targetSql">
          <el-input v-model="form.targetSql" type="textarea" :rows="3" />
        </el-form-item>
      </div>
      <div v-show="step === 2" class="stepBox">
        <el-row>
          <el-col :span="11">
            <el-table
              :data="form.associatedFields"
              size="mini"
              style="width: 100%"
              height="280px"
            >
              <el-table-column label="关联字段" align="center">
                <el-table-column label="主数据" prop="main">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.main" size="mini">
                      <el-option
                        v-for="op in mainColumns"
                        :key="op.name"
                        :value="op.name"
                      />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="目标数据" prop="target">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.target" size="mini">
                      <el-option
                        v-for="op in targetColumns"
                        :key="op.name"
                        :value="op.name"
                      />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column>
                  <template slot="header" slot-scope="scope">
                    <el-button
                      type="text"
                      size="mini"
                      icon="el-icon-circle-plus"
                      @click="addRow('associatedFields', scope)"
                    />
                  </template>
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      size="mini"
                      icon="el-icon-delete"
                      @click="delRow('associatedFields', scope.$index)"
                    />
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="2">
            <br>
          </el-col>
          <el-col :span="11">
            <el-table
              :data="form.compareFields"
              size="mini"
              style="width: 100%"
              height="280px"
            >
              <el-table-column label="比对字段" align="center">
                <el-table-column label="主数据" prop="main">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.main" size="mini">
                      <el-option
                        v-for="op in mainColumns"
                        :key="op.name"
                        :value="op.name"
                      />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="目标数据" prop="target">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.target" size="mini">
                      <el-option
                        v-for="op in targetColumns"
                        :key="op.name"
                        :value="op.name"
                      />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column>
                  <template slot="header" slot-scope="scope">
                    <el-button
                      type="text"
                      size="mini"
                      icon="el-icon-circle-plus"
                      @click="addRow('compareFields', scope)"
                    />
                  </template>
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      size="mini"
                      icon="el-icon-delete"
                      @click="delRow('compareFields', scope.$index)"
                    />
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>
      <div v-show="step === 3" class="stepBox">
        <el-row>
          <el-col :span="11">
            <el-table
              :data="form.associatedRules"
              size="mini"
              style="width: 100%"
              height="280px"
            >
              <el-table-column label="关联字段" align="center">
                <el-table-column label="主数据" prop="main">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.main" size="mini">
                      <el-option
                        v-for="op in mainColumns"
                        :key="op.name"
                        :value="op.name"
                      />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="目标数据" prop="target">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.target" size="mini">
                      <el-option
                        v-for="op in targetColumns"
                        :key="op.name"
                        :value="op.name"
                      />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column>
                  <template slot="header" slot-scope="scope">
                    <el-button
                      type="text"
                      size="mini"
                      icon="el-icon-circle-plus"
                      @click="addRow('associatedRules', scope)"
                    />
                  </template>
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      size="mini"
                      icon="el-icon-delete"
                      @click="delRow('associatedRules', scope.$index)"
                    />
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="2">
            <br>
          </el-col>
          <el-col :span="11">
            <el-table
              :data="form.compareRules"
              size="mini"
              style="width: 100%"
              height="280px"
            >
              <el-table-column label="修正字段" align="center">
                <el-table-column label="主数据" prop="main">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.main" size="mini">
                      <el-option
                        v-for="op in mainColumns"
                        :key="op.name"
                        :value="op.name"
                      />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="目标数据" prop="target">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.target" size="mini">
                      <el-option
                        v-for="op in targetColumns"
                        :key="op.name"
                        :value="op.name"
                      />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column>
                  <template slot="header" slot-scope="scope">
                    <el-button
                      type="text"
                      size="mini"
                      icon="el-icon-circle-plus"
                      @click="addRow('compareRules', scope)"
                    />
                  </template>
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      size="mini"
                      icon="el-icon-delete"
                      @click="delRow('compareRules', scope.$index)"
                    />
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <div slot="footer">
      <el-button v-if="[1, 3].includes(step)" type="success" size="mini" @click="next">
        比对规则
      </el-button>
      <el-button v-if="step === 2" type="success" size="mini" @click="step = 1">
        基础数据
      </el-button>
      <el-button v-if="step === 2" type="warning" size="mini" @click="step = 3">
        修正规则
      </el-button>
      <el-button type="info" size="mini" @click="() => $emit('update:show', false)">
        取消
      </el-button>
      <el-button v-show="step === 3" type="primary" size="mini" @click="save">
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
    tree: {
      type: Object,
      default: () => {}
    },
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      step: 1,
      formLoading: false,
      form: {
        categorySn: '',
        categoryName: '',
        name: '',
        sn: '',
        correctionRule: '',
        mainSql: '',
        targetSql: '',
        associatedFields: [],
        compareFields: [],
        associatedRules: [],
        compareRules: []
      },
      rules: {
        name: [{ required: true, message: '请填写名称', trigger: 'blur' }],
        sn: [{ required: true, message: '请填写编码', trigger: 'blur' }],
        mainSql: [{ required: true, message: '请填写主数据配置SQL', trigger: 'blur' }],
        targetSql: [{ required: true, message: '请填写目标数据配置SQL', trigger: 'blur' }],
        categoryName: [{ required: true, message: '请选择分类', trigger: 'change' }]
      },
      mainColumns: [],
      targetColumns: []
    }
  },
  watch: {
    id: {
      immediate: true,
      handler: 'getInfo'
    },
    show: {
      immediate: true,
      handler(val) {
        if (val) {
          const { targetNode } = this.tree
          if (targetNode.id && targetNode.id !== '0') {
            this.form.categoryName = targetNode.label
            this.form.categorySn = targetNode.id
          }
        }
      }
    }
  },
  methods: {
    save() {
      if (this.checkTableLength() && this.checkTableDataComplete()) {
        const [associatedFields, compareFields, associatedRules, compareRules] = [
          this.generateTableDatas('associatedFields'),
          this.generateTableDatas('compareFields'),
          this.generateTableDatas('associatedRules'),
          this.generateTableDatas('compareRules')
        ]
        this.formLoading = true
        const p = {
          sn: this.form.sn,
          name: this.form.name,
          categorySn: this.form.categorySn,
          mainSql: this.form.mainSql,
          targetSql: this.form.targetSql
        }
        this.$api.dataComparison.saveComparison({
          ...p,
          id: this.id ? this.id : null,
          compareRule: JSON.stringify({
            associatedFields,
            compareFields
          }),
          correctionRule: JSON.stringify({
            associatedRules,
            compareRules
          })
        }, this.id ? '/dataCompare/update' : '/dataCompare/add').then(s => {
          this.formLoading = false
          this.$emit('refresh', this.form.categorySn)
          this.$emit('update:show', false)
        }).catch(e => {
          this.formLoading = false
          this.$message.error(e.message)
        })
      }
    },
    formaterDatas(data) {
      const obj = data && JSON.parse(data)
      Object.keys(obj).forEach(key => {
        Object.keys(obj[key]).forEach(inKey => {
          this.form[key].push({
            main: inKey,
            target: obj[key][inKey]
          })
        })
      })
    },
    getInfo(id) {
      if (id) {
        this.$api.dataComparison.getComparisonInfo({
          id
        }).then(s => {
          this.formaterDatas(s.data.compareRule)
          this.formaterDatas(s.data.correctionRule)
          Object.keys(this.form).forEach(key => {
            if (!['associatedFields', 'compareFields', 'associatedRules', 'compareRules'].includes(key)) {
              this.form[key] = s.data[key]
            }
          })
        })
      }
    },
    checkTableLength() {
      const {
        associatedFields, compareFields, associatedRules, compareRules
      } = this.form
      const RESULT = !!associatedFields.length
      && !!compareFields.length
      && !!associatedRules.length
      && !!compareRules.length
      if (!RESULT) this.$message.warning('每个表数据至少存在一行！')
      return RESULT
    },
    checkTableDataComplete() {
      const {
        associatedFields, compareFields, associatedRules, compareRules
      } = this.form
      const ALL = [...associatedFields, ...compareFields, ...associatedRules, ...compareRules]
      let flag = true
      for (let i = 0, len = ALL.length; i < len; i++) {
        const res = Object.values(ALL[i]).every(item => item !== '')
        if (!res) {
          flag = false
          this.$message.warning('请完整填写表数据！')
          break
        }
      }
      return flag
    },
    generateTableDatas(field) {
      const obj = {}
      this.form[field].forEach(row => {
        obj[row.main] = row.target
      })
      return obj
    },
    setCategory(node) {
      this.form.categoryName = node.label
      this.form.categorySn = node.id
    },
    delRow(field, index) {
      this.form[field].splice(index, 1)
    },
    addRow(field) {
      this.$set(this.form[field], this.form[field].length, {
        main: '',
        target: ''
      })
    },
    next() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.formLoading = true
          const { mainSql, targetSql } = this.form
          this.$api.dataComparison.getColumns({
            main: mainSql,
            target: targetSql
          }).then(s => {
            const { mainColumns, targetColumns } = s.data
            this.mainColumns = mainColumns
            this.targetColumns = targetColumns
            this.step = 2
            this.formLoading = false
          }).catch(e => {
            this.formLoading = false
            this.$message.error(e.message)
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .stepBox {
    height: 280px;
  }
</style>
