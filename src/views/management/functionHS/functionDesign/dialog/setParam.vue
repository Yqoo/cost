<template>
  <div>
    <el-dialog
      v-dialogDrag
      :visible.sync="show"
      :model="false"
      width="35%"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="() => $emit('update:show', false)"
    >
      <div slot="title">
        设置字段
      </div>
      <el-form ref="paramdForm" :model="form" :rules="rules" label-width="110px" size="mini">
        <el-form-item v-for="(i, k) in formList" :key="k" :label="i" :prop="k">
          <el-select v-model="form[k]">
            <el-option v-for="e in list" :key="e.field" :label="e.field+e.type" :value="e.field" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="warning" size="mini" @click="empty">
          清空
        </el-button>
        <el-button type="info" size="mini" @click="() => this.$emit('update:show', false)">
          取消
        </el-button>
        <el-button type="primary" size="mini" @click="save">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'SetParam',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default: () => []
    },
    param: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      form: {
        returnData: '',
        showData: '',
        pid: ''
      },
      rules: {
        returnData: [{ required: true, message: '请选择返回值', trigger: 'change' }],
        showData: [{ required: true, message: '请选择显示字段', trigger: 'change' }],
        pid: [{ required: true, message: '请选择上级字段', trigger: 'change' }]
      },
      formList: { returnData: '返回值：', showData: '显示值：', pid: '上级字段：' }
    }
  },
  watch: {
    param: {
      immediate: true,
      handler(val) {
        if (Object.keys(val).length) {
          this.form = { ...val }
        }
      }
    }
  },
  methods: {
    empty() {
      this.$confirm('确定要清空所有字段吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Object.assign(this.form, {
          returnData: '',
          showData: '',
          pid: ''
        })
        this.$emit('update', this.form)
        this.$emit('update:show', false)
      }).catch(() => {})
    },
    save() {
      this.$refs.paramdForm.validate(valid => {
        if (valid) {
          const params = { ...this.form }
          if (params.returnData === params.pid) {
            this.$message.warning('返回值和上级字段不能一样')
          } else {
            this.$emit('update', params)
            this.$emit('update:show', false)
          }
        }
      })
      // this.$emit('update:show', false)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
