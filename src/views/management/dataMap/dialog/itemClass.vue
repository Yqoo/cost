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
      {{ id ? "编辑" : "新增" }}方案分类
    </div>
    <div class="formBox">
      <el-form
        ref="form"
        v-waiting="loading"
        :model="form"
        :rules="rules"
        label-width="120px"
        status-icon
        size="mini"
      >
        <el-form-item label="代码" prop="sn">
          <el-input v-model="form.sn" clearable placeholder="编码规则：2-2-2" style="width:84%" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" clearable style="width:84%" />
        </el-form-item>
      </el-form>
    </div>
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
    id: {
      type: String,
      default: ''
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
    id: {
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
          this.$api.dataMap
            .saveYSFATree(params)
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
      if (val) {
        // 编辑状态
        this.loading = true
        this.$api.dataMap
          .editYSFATree({
            idOrSn: val
          })
          .then(s => {
            this.form.id = s.data.id
            this.form.sn = s.data.sn
            this.form.name = s.data.name
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
.formBox{
  width:100%;
  min-height: 200px;
  display:flex;
  justify-content: center;
  align-items: center;
  .el-form{
    width:100%;
    height:100%;
  }
}
</style>
