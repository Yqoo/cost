<template>
  <div>
    <el-dialog
      v-dialogDrag
      :visible.sync="show"
      :model="false"
      append-to-body
      width="36%"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="() => $emit('update:show', false)"
    >
      <div slot="title">
        {{ lrhs?'录入函数':'查询条件' }}
      </div>
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
            v-else-if="e.type === 1 && e.navigation !== 'date' "
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
          <el-input v-else v-model="form[e.name]" :type="e.navigation" @blur="getNavFormula" @change="getNavFormula">
            <i
              v-if="list.param[i].qjwd"
              slot="suffix"
              class="el-input__icon el-icon-search"
              @click="dialogBoxShow(e.paramName, e.name, list.param[i].returnField)"
            />
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="info" size="mini" @click="() => this.$emit('update:show', false)">
          取消
        </el-button>
        <el-button type="primary" size="mini" @click="save">
          确定
        </el-button>
      </div>
    </el-dialog>
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
  name: 'ZhixSql',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    funcDesc: {
      type: Object,
      default: () => {}
    },
    lrhs: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      list: {},
      ysmc: '',
      param: [], // 表单数据
      dbDatas: [], // 枚举下拉框
      form: {},
      rules: {},
      fzhsBox: { // 辅助核算弹框
        show: false
      },
      // isLrhs: true,
      globalBox: {
        show: false,
        title: '会计科目',
        path: '/accountants',
        parameters: {} // 额外参数
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
    lrhs: {
      immediate: true,
      handler(val) {
        this.isLrhs = val
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
    dialogBoxShow(paramName, field, returnField) {
      this.field = field
      this.returnField = returnField
      if (paramName === 'kjkm') {
        this.globalBox.show = true
        let { ztsn } = JSON.parse(localStorage.getItem('startZT'))
        if (Object.values(this.form).length === 2) {
          ztsn = Object.values(this.form).join('_')
        }
        this.globalBox.parameters = {
          ztsn_: ztsn
        }
      } else {
        this.fzhsBox.show = true
      }
    },
    getChoiceDatas(row) {
      this.$set(this.form, `${this.field}`, `${row[this.returnField]}`)
      this.getNavFormula()
    },
    getNavData(id) { // 获得表单数据
      if (id) {
        this.$api.functionCenter.getNavData({
          hsId: id,
          hz: false
        }).then(s => {
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
    getNavFormula() { // 获取函数导航公式树
      if (Object.keys(this.form).length !== this.param.length) {
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
      }
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
    save() {
      this.$refs.navForm.validate(valid => {
        if (valid) {
          const arr = []
          for (let i = 0; i < this.list.param.length; i++) {
            const obj = {}
            obj.key = this.list.param[i].paramName
            obj.value = this.form[this.list.param[i].name]
            arr.push(obj)
          }
          if (this.isLrhs) {
            this.$parent.execute(arr)
          }
          this.$emit('getParam', this.list.ysmc)
          this.$emit('update:show', false)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-icon-search{
  cursor: pointer;
  font-size: 20px;
}
</style>
