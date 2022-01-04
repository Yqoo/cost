<template>
  <el-dialog
    v-dialogDrag
    :modal="false"
    width="400px"
    :visible.sync="show"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :before-close="() => $emit('update:show', false)"
  >
    <div slot="title">
      填写参数
    </div>
    <el-form
      ref="form"
      :model="form"
      size="mini"
      label-width="80px"
    >
      <el-form-item
        v-for="item in cs"
        :key="item"
        :label="item"
        :prop="item"
        :rules="[{ required: true, message: '必填', trigger: 'blur' }]"
      >
        <el-input v-model="form[item]" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="info" size="mini" @click="() => $emit('update:show', false)">
        取消
      </el-button>
      <el-button type="primary" size="mini" @click="save">
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
    cs: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      form: {}
    }
  },
  methods: {
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const p = { ...this.form }
          this.$emit('confirmParams', p)
          this.$emit('update:show', false)
        }
      })
    }
  }
}
</script>

<style>

</style>
