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
        修改报表数据
      </div>
      <el-form ref="form" :model="form" :rules="rules" size="mini" label-width="100px">
        <el-form-item label="报表编码" peop="sn">
          <el-input v-model="form.sn" />
        </el-form-item>
        <el-form-item label="报表名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="说明" prop="desc_">
          <el-input v-model="form.desc_" type="textarea" />
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
  name: 'ChangeBbsj',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    usn: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      form: {
        sn: '',
        name: '',
        desc_: '',
        id: ''
      },
      rules: {
        sn: [{ required: true, message: '请输入编码', trigger: 'blur' }],
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      }
    }
  },
  watch: {
    usn: {
      immediate: true,
      handler(val) {
        if (val) {
          this.$api.reportDesign.getSjDesc({ id: val }).then(s => {
            const {
              name, sn, desc_, id
            } = s.data
            Object.assign(this.form, {
              name,
              sn,
              desc_,
              id
            })
          }).catch(e => this.$message.error(e.message))
        }
      }
    }
  },
  methods: {
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const param = { ...this.form }
          this.$api.reportDesign.editBbsj(param).then(s => {
            this.$message.success('修改成功')
            this.$emit('refreshBbsj')
            this.$emit('update:show', false)
          }).catch(e => this.$message.error(e.message))
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
