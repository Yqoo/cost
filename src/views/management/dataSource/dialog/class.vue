<template>
  <el-dialog
    v-dialogDrag
    :modal="false"
    width="40%"
    :visible.sync="show"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :before-close="() => $emit('update:show', false)"
  >
    <div slot="title">
      {{ uid === "add" ? "新增" : "编辑" }}系统数据源分类
    </div>
    <el-form
      ref="form"
      v-waiting="loading"
      :model="form"
      :rules="rules"
      label-width="120px"
      status-icon
      size="mini"
    >
      <el-form-item label="编码" prop="sn">
        <el-input v-model="form.sn" clearable style="width:86%" />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" clearable style="width:86%" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button
        type="info"
        size="mini"
        @click="() => $emit('update:show', false)"
      >
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
    uid: {
      type: String,
      default: 'add'
    }
  },
  data() {
    return {
      loading: false,
      form: {
        name: '',
        sn: ''
      },
      rules: {
        name: [{ required: true, message: '请填写名称', trigger: 'blur' }],
        sn: [{ required: true, message: '请填写代码', trigger: 'blur' }]
      }
    }
  },
  watch: {
    uid: {
      immediate: true,
      handler: 'getInfo'
    }
  },
  methods: {
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          const params = { ...this.form }
          this.$api.dataSource
            .saveCategory(params)
            .then(s => {
              this.$emit('success', s.data)
              this.$emit('update:show', false)
              this.$message.success('保存成功！')
            })
            .catch(e => {
              this.loading = false
              this.$message.error(e.message)
            })
        }
      })
    },
    getInfo(val) {
      // console.log(val)
      if (val !== 'add') {
        // 编辑状态
        this.loading = true
        this.$api.dataSource
          .getSJYCategory({
            idOrSn: val
          })
          .then(s => {
            this.form.id = s.data.id
            this.form.sn = s.data.sn
            this.form.name = s.data.name
            this.$emit('success', s.data.id)
            this.loading = false
          })
          .catch(e => {
            this.loading = false
            this.$message.error(e.message)
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/.el-dialog__body{
  display: flex;
  justify-content: center;
  align-items: center;
  .el-form{
    width:100%;
    height:100%;
  }
}
</style>
