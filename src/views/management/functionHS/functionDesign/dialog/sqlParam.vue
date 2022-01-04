<template>
  <div>
    <el-dialog
      v-dialogDrag
      :visible.sync="show"
      :model="false"
      width="30%"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="() => $emit('update:show', false)"
    >
      <div slot="title">
        设置返回值
      </div>
      <el-form
        ref="sqlform"
        :model="form"
        :rules="rules"
        label-width="120px"
        size="mini"
      >
        <el-form-item label="返回字段" prop="field">
          <el-input v-model="form.field" disabled />
        </el-form-item>
        <el-form-item label="中文名称" prop="chineseName">
          <el-input v-model="form.chineseName" />
        </el-form-item>
        <el-form-item label="格式类型" prop="returnType">
          <el-select v-model="form.returnType" style="width: 100%">
            <el-option label="字符串" value="string" />
            <el-option label="数字型" value="num" />
            <el-option label="时间型" value="time" />
          </el-select>
        </el-form-item>
        <el-form-item label="说明" prop="desc">
          <el-input v-model="form.desc" type="textarea" />
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
  </div>
</template>

<script>
export default {
  name: 'SqlParam',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      form: {
        field: '',
        returnType: '',
        sort: 0,
        type: '',
        desc: '',
        chineseName: ''
      },
      rules: {
        returnType: [{ required: true, message: '请选择格式类型', trigger: 'change' }]
      }
    }
  },
  watch: {
    data: {
      immediate: true,
      handler: 'getInfo'
    }
  },
  methods: {
    getInfo(val) {
      if (Object.keys(val).length) {
        Object.assign(this.form, {
          field: val.field,
          returnType: val.returnType,
          sort: val.sort,
          type: val.type,
          chineseName: val.chineseName || '',
          desc: val.desc || ''
        })
      }
    },
    save() {
      this.$refs.sqlform.validate(valid => {
        if (valid) {
          const params = { ...this.form }
          const names = this.$parent.tree.data[0].children.filter(e => e.type !== this.form.type)
          this.$emit('refshSqlParam', params)
          this.$emit('update:show', false)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
