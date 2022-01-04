/* eslint-disable prefer-destructuring */
<template>
  <div>
    <el-dialog
      v-dialogDrag
      :visible.sync="show"
      :model="false"
      width="60%"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="() => $emit('update:show', false)"
    >
      <div slot="title">
        函数预览导航
      </div>
      <div>
        <div class="desc">
          <p>
            <span>函数名称：</span>
            <span>{{ list.hsmc }}</span>
          </p>
          <p>
            <span>函数说明：</span>
            <span>{{ list.hssm }}</span>
          </p>
        </div>
        <div :class="list.param !== undefined && list.param.length >= 3 ? 'form' : 'minForm'">
          <el-form ref="navForm" :model="form" :rules="rules" label-width="150px" size="mini">
            <el-form-item
              v-for="(e, i) in list.param"
              :key="e.id"
              :label="e.name"
              :prop="e.name"
            >
              <el-select
                v-if="e.navigation === '下拉框'"
                v-model="form[e.name]"
                style="width: 100%"
                @focus="getDbDatas(e)"
                @change="getNavFormula"
              >
                <el-option
                  v-for="item in dbDatas"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-select
                v-else-if="e.type === 1 && e.navigation !== 'date'"
                v-model="form[e.name]"
                style="width: 100%"
                filterable
                @visible-change="(bool)=>getOneData(bool, e.name, e.qjwd_id)"
                @blur="(event)=>blurOne(event, e.name, e.qjwd_id)"
                @change="selectTypeOne"
              >
                <el-option
                  v-for="item in typeOneData"
                  :key="item.id_"
                  :label="item.name_"
                  :value="item.id_"
                />
              </el-select>
              <el-select
                v-else-if="e.type === 2 && e.navigation !== 'date'"
                v-model="form[e.name]"
                style="width: 100%"
                @change="selectTypeTwo"
              >
                <el-option
                  v-for="item in e.key"
                  :key="item.id_"
                  :label="item.name_"
                  :value="item.id_"
                />
              </el-select>
              <el-input v-else-if="e.navigation === '对话框'" v-model="form[e.name]" readonly>
                <el-button slot="append" icon="el-icon-edit" @click="openSqlBox(e)" />
              </el-input>
              <div v-else-if="e.navigation === 'date'" class="block">
                <el-date-picker
                  v-model="form[e.name]"
                  type="date"
                  style="width:100%"
                  :value-format="e.dateType"
                  :format="e.dateType"
                  placeholder="选择日期"
                  @change="getNavFormula"
                />
              </div>
              <el-input
                v-else
                v-model="form[e.name]"
                :class="e.navigation === 'date' ? 'replaceType' : ''"
                :type="e.navigation"
                @blur="getNavFormula"
              >
                <i
                  v-if="list.param[i].qjwd"
                  slot="suffix"
                  class="el-input__icon el-icon-search"
                  @click="dialogBoxShow(e.paramName, e.name, list.param[i].returnField)"
                />
              </el-input>
            </el-form-item>
          </el-form>
        </div>
        <el-input
          v-model="list.ysmc"
          type="textarea"
          readonly
          :rows="list.param !== undefined && list.param.length >= 3 ? 9 : 20"
        />
      </div>
      <div slot="footer">
        <el-button type="info" size="mini" @click="() => this.$emit('update:show', false)">
          取消
        </el-button>
        <el-button type="primary" size="mini" @click="save">
          确定
        </el-button>
      </div>
    </el-dialog>
    <SqlDialogBox
      v-if="sqlDialogBox.show"
      :show.sync="sqlDialogBox.show"
      :data="sqlDialogBox.data"
      @update="updateFormVal"
    />
    <GlobalBox
      v-if="globalBox.show"
      :show.sync="globalBox.show"
      :title="globalBox.title"
      :path="globalBox.path"
      :parameters="globalBox.parameters"
      :option="false"
      @getChoiceDatas="getChoiceDatas"
    />
    <FzhsBox
      v-if="fzhsBox.show"
      :show.sync="fzhsBox.show"
      @select="select"
    />
  </div>
</template>

<script>
export default {
  name: 'PreviewNav',
  components: {
    SqlDialogBox: () => import('./sqlDialogBox')
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    funcDesc: {
      type: Object,
      default: () => {}
    },
    dsSn: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      list: {}, // 导航框数据
      dbDatas: [], // 枚举下拉框
      textareas: '', // 文本框内容
      formList: [],
      form: {},
      rules: {},
      oldCanShuData: [], // 原始参数
      paramData: [], // 函数参数
      sqlDialogBox: {
        show: '',
        data: {}
      },
      sqlstr: '', // 对话框值
      param: [], // form数据
      globalBox: {
        show: false,
        title: '会计科目',
        path: '/accountants',
        parameters: {} // 额外参数
      },
      fzhsBox: { // 辅助核算弹框
        show: false
      },
      ztsn: '',
      typeOneData: []
    }
  },
  watch: {
    funcDesc: {
      immediate: true,
      handler(val) {
        if (Object.keys(val).length) {
          this.getNavData(val.id)
        }
      }
    },
    form: {
      immediate: true,
      deep: true,
      handler(val) {
        if (Object.keys(val).length) {
          const obj = {}
          this.list.param.forEach(l => {
            Object.keys(val).forEach(k => {
              if (l.name === k) {
                this.$set(obj, k, {
                  id: l.id,
                  data: val[k]
                })
              }
            })
          })
          const valus = Object.values(obj)
          this.param = [...valus]
        }
      }
    },
    sqlstr: {
      immediate: true,
      handler(val) {
        if (val) {
          this.getNavFormula()
        }
      }
    }
  },
  methods: {
    getOneData(bool, name, qjwdId) {
      if (bool) {
        let param = ''
        if (name === '[kjqj|会计期间]=') {
          param = this.ztsn
        } else if (name === '[#zth|账套号]=') {
          param = ''
        } else if (name === '[#kjnd|会计年度]=') {
          // eslint-disable-next-line prefer-destructuring
          param = this.ztsn.split('_')[1]
        }
        this.$api.functionCenter.getQJWDTypeIsOne({
          qjwdId,
          param
        }).then(s => {
          this.typeOneData = [...s.data]
        }).catch(e => this.$message.error(e.message))
      }
    },
    blurOne(event, name) {
      if (event.target.value) {
        if (Object.keys(this.form).includes(name)) {
          this.form[name] = event.target.value
        } else {
          this.$set(this.form, name, event.target.value)
        }
        this.getNavFormula()
      }
    },
    selectTypeOne(val) {
      this.getNavFormula()
    },
    selectTypeTwo(val) {
      this.getNavFormula()
    },
    select(selection) { // 选择辅助核算回显
      if (Object.values(selection)) {
        this.$set(this.form, `${this.field}`, JSON.stringify(selection))
        this.getNavFormula()
      }
    },
    dialogBoxShow(paramName, field, returnField) { // 显示会计科目或辅助核算弹框
      this.field = field
      this.returnField = returnField
      if (paramName === 'kjkm') {
        this.globalBox.show = true
        if (Object.values(this.form).length === 2) {
          this.ztsn = Object.values(this.form).join('_') || ''
          this.globalBox.parameters = {
            ztsn_: this.ztsn
          }
        }
      }
      if (paramName === '!fzhs') {
        this.fzhsBox.show = true
      }
    },
    getChoiceDatas(row) { // 选择会计科目回显
      if (Object.values(row).length) {
        this.$set(this.form, `${this.field}`, `${row[this.returnField]}`)
        this.getNavFormula()
      }
    },
    updateFormVal(obj) {
      const { name, str } = obj
      this.$set(this.form, name, str)
      this.sqlstr = str
    },
    getNavFormula() { // 获取函数导航公式树
      const obj = {}
      this.list.param.forEach(l => {
        Object.keys(this.form).forEach(k => {
          if (l.name === k) {
            this.$set(obj, k, {
              id: l.id,
              data: this.form[k]
            })
          }
        })
      })
      const valus = Object.values(obj)
      this.param = [...valus]
      const { id } = this.funcDesc
      const formData = new FormData()
      formData.append('hsId', id)
      formData.append('param', JSON.stringify(this.param))
      if (this.param.length) {
        this.$http.post('/bbFunctionWorkController/getFunctionGs', formData).then(s => {
          this.list.ysmc = s.data
        }).catch(e => this.$message.error(e.message))
      }
    },
    openSqlBox(e) { // sql对话框
      this.sqlDialogBox.show = true
      this.sqlDialogBox.data = {
        ...e,
        hsId: this.funcDesc.id,
        dsSn: this.dsSn
      }
    },
    getDbDatas(e) { // 获取下拉框数据
      const { id } = this.funcDesc
      if (!e.afferentType) {
        this.$api.functionCenter.getEnmuData({
          hsId: id,
          paramId: e.id
        }).then(s => {
          this.dbDatas = [...s.data]
        }).catch(k => this.$message.error(k.message))
      }
    },
    getNavData(id) { // 获得导航框数据
      if (id) {
        this.$api.functionCenter.getNavData({ hsId: id }).then(s => {
          this.list = { ...s.data }
          const { param } = this.list
          param.forEach(l => {
            if (l.key) {
              l.key = JSON.parse(l.key)
            }
            if (l.must === 'true') {
              this.$set(this.rules, l.name, [{
                required: true,
                message: `${l.name}不能为空`,
                trigger: l.navigation === '下拉框' ? 'change' : 'blur'
              }])
            }
            if (l.data) {
              this.$set(this.form, `${l.name}`, `${l.data}`)
              this.ztsn = Object.values(this.form).join('_')
            }
          })
        }).catch(e => this.$message.error(e.message))
      }
    },
    save() {
      this.$refs.navForm.validate(valid => {
        if (valid) {
          const formData = new FormData()
          const { ysmc } = this.list
          this.$emit('update', ysmc)
          this.$emit('update:show', false)
        }
      })
    }
    // getFormType(bool) {
    //   if (bool) {
    //     const { addPa, paramData } = this.$parent
    //     this.oldCanShuData = JSON.parse(JSON.stringify(addPa.oldCanShuData)).map(l => { l.must = true; return l })
    //     this.paramData = [...paramData]
    //     const arr = []
    //     this.paramData.map(e => e.tableList).forEach(l => {
    //       arr.push(...l)
    //     })
    //     this.formList = [...this.oldCanShuData, ...arr]
    //     console.log(this.formList)
    //     this.formList.forEach(e => {
    //       e.id = (`${e.id}`).indexOf('.') > -1 ? (`${e.id}`).substring(2) : e.id
    //       if (e.must) {
    //         this.$set(this.rules, e.id, {
    //           required: true,
    //           message: `${e.name || e.field || e.type}不能为空`,
    //           trigger: e.navigation === '下拉框' ? 'change' : 'blur'
    //         })
    //       }
    //     })
    //   }
    // },
  }
}
</script>

<style lang="scss" scoped>
.minForm {
  border: 1px solid #ddd;
  height: 80px;
  border-radius: 5px;
  margin: 10px 0;
  padding: 5px;
}
.form {
  border: 1px solid #ddd;
  height: 300px;
  overflow-y: auto;
  border-radius: 5px;
  margin: 10px 0;
  padding: 5px;
}
.el-icon-search{
  cursor: pointer;
  font-size: 20px;
}
.block {
  display: flex;
  .search {
    position: absolute;
    right: 28px;
    top: 6px;
    font-size: 16px;
  }
  .el-date-picker {
    position: relative;
  }
}
</style>
