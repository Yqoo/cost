<template>
  <el-dialog
    v-dialogDrag
    :modal="false"
    width="80%"
    :visible.sync="show"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :before-close="() => $emit('update:show', false)"
  >
    <div slot="title">
      {{ status === 'add' ? '新增' : '编辑' }}
    </div>
    <el-form
      ref="form"
      v-waiting="loading"
      :model="form"
      :rules="rules"
      size="mini"
      label-width="100px"
      inline
      status-icon
    >
      <el-form-item
        v-for="item in formItem"
        :key="item.prop"
        :label="item.label"
        :prop="item.prop"
        :rules="item.rules"
      >
        <el-input
          v-if="item.type === 'Varchar'"
          v-model="form[item.prop]"
          clearable
        />
        <el-input
          v-if="item.type === 'Int'"
          v-model="form[item.prop]"
          clearable
          @blur="formaterNumber(form, item.prop, 'Int')"
        />
        <el-input
          v-if="item.type === 'Float'"
          v-model="form[item.prop]"
          clearable
          @blur="formaterNumber(form, item.prop, 'Float')"
        />
        <el-input
          v-if="item.type === 'Money'"
          v-model="form[item.prop]"
          clearable
          @blur="formaterNumber(form, item.prop, 'Money')"
        />
        <el-radio-group v-if="item.type === 'Bit'" v-model="form[item.prop]">
          <el-radio :label="true">
            是
          </el-radio>
          <el-radio :label="false">
            否
          </el-radio>
        </el-radio-group>
        <el-input v-if="item.type === 'Text'" v-model="form[item.prop]" type="textarea" :rows="4" />
        <el-date-picker
          v-if="item.type === 'date'"
          v-model="form[item.prop]"
          type="datetime"
          placeholder="选择日期"
          :format="item.value"
          :value-format="item.value"
        />
        <el-select
          v-if="item.type === 'systemDossier'"
          v-model="form[item.prop]"
          :multiple="item.value && item.value.multiple"
          style="width: 100%"
          clearable
        >
          <el-option
            v-for="op in sdSelect[item.prop]"
            :key="op.id"
            :label="op.label"
            :value="op.sn"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div class="content">
      <business-tabs
        :tid="tid"
        :tabs="tabs"
        :td="td"
        :index="index"
        :form="from"
        :ztsn="ztsn"
      />
    </div>
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
import businessTabs from './businessTabs'

export default {
  components: {
    businessTabs
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      default: 'add'
    },
    info: {
      type: Object,
      default: () => {}
    },
    td: {
      type: Object,
      default: () => {}
    },
    tid: {
      type: String,
      default: ''
    },
    index: {
      type: Object,
      default: () => {}
    },
    from: {
      type: String,
      default: ''
    },
    ztsn: {
      type: String,
      default: ''
    }
  },
  data() {
    const checkInt = (rules, value, callback) => {
      if (value === '') {
        callback(new Error('请输入整数'))
      } else if (/^\d+$/.test(value)) {
        callback()
      } else {
        callback(new Error('请输入整数'))
      }
    }
    const checkFloat = (rules, value, callback) => {
      if (value === '') {
        callback(new Error('请输入小数'))
      } else if (/^(-)?(([0-9])|([1-9]([0-9]+)))(.[0-9]{1,2})$/.test(value)) {
        callback()
      } else {
        callback(new Error('小数点后面保留两位'))
      }
    }
    return {
      loading: false,
      form: {},
      rules: {
        Int: [{ required: true, validator: checkInt, trigger: 'blur' }],
        Text: [{ required: true, message: '必填', trigger: 'blur' }],
        Varchar: [{ required: true, message: '必填', trigger: 'blur' }],
        Float: [{ required: true, validator: checkFloat, trigger: 'blur' }],
        Money: [{ required: true, message: '请输入金额', trigger: 'blur' }],
        date: [{ required: true, message: '请选择日期', trigger: 'blur' }],
        systemDossier: [{ required: true, message: '请设置档案', trigger: 'blur' }]
      },
      sdSelect: {}, // 系统档案下拉
      templateData: {}
    }
  },
  computed: {
    tabs() {
      return this.info
    },
    formItem() {
      const { info } = this
      const cols = JSON.parse(info.cols).filter(i => !i.hide).map(item => {
        if (item.type === 'systemDossier') this.getTD(item)
        return {
          label: item.title,
          prop: item.name,
          readonly: item.readonly,
          type: item.type,
          rules: item.required ? this.rules[item.type] : [],
          value: item.value
        }
      })
      return cols
    }
  },
  watch: {
    td: {
      immediate: true,
      handler: 'setFirstForm'
    }
  },
  methods: {
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          Object.keys(this.form).forEach(key => {
            this.td[this.tid][0][key] = Array.isArray(this.form[key]) ? this.form[key].join(',') : this.form[key]
          })
          this.$api.business.saveDataTable({
            data: JSON.stringify(this.td),
            ztsn: this.from === 'treatment' ? this.ztsn : ''
          }).then(s => {
            this.$emit('refresh')
            this.$emit('update:show', false)
            this.loading = false
          }).catch(e => {
            this.loading = false
            this.$message.error(e.message)
          })
        }
      })
    },
    getTD(item) {
      this.$api.record.getSJTree('dossier', {
        sn: item.value.sn,
        ztsn: this.from === 'treatment' ? this.ztsn : '',
        nameField: item.value?.useField?.name,
        snField: item.value?.useField?.sn
      }).then(s => {
        const { list } = s.data
        this.$set(this.sdSelect, item.name, [...list])
      }).catch(e => {
        this.$message.error(e.message)
      })
    },
    formaterNumber(form, prop, type) {
      const v = this.$tools.formatNumber(form[prop], type === 'Int' ? 0 : 2)
      form[prop] = this.$tools.delcommafy(v)
    },
    setFirstForm(obj) {
      if (obj[this.tid]) {
        this.formItem.forEach(item => {
          const v = obj[this.tid][0][item.prop]
          const value = item.value && item.value.multiple ? v && v.split(',') : v
          this.$set(this.form, item.prop, value)
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .content {
    height: 500px;
    overflow-y: auto;
  }
  .content::-webkit-scrollbar {
    display: none;
  }
</style>
