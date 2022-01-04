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
        设置sql字段
      </div>
      <el-form ref="form" :model="form" :rules="rules" size="mini" label-width="100px">
        <el-form-item v-for="(it, index) in formData" :key="it + index" :label="it" :prop="it">
          <el-input v-model="form[it]" />
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
  name: 'YzSql',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    formArr: {
      tyep: Array,
      default: () => []
    }
  },
  data() {
    return {
      formData: [],
      form: {},
      rules: {}
    }
  },
  watch: {
    formArr: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val.length) this.formData = [...val]
      }
    },
    formData: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val.length) {
          val.forEach(e => {
            if (e) {
              this.$set(this.rules, e, {
                required: true,
                message: `${e}不能为空`,
                trigger: 'blur'
              })
            }
          })
        }
      }
    }
  },
  methods: {
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = { ...this.form }
          this.$emit('updateSql', params)
          this.$emit('update:show', false)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
