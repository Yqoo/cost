<template>
  <div>
    <el-dialog
      v-dialogDrag
      :visible.sync="show"
      :model="false"
      width="25%"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="() => $emit('update:show', false)"
    >
      <div slot="title">
        单元格批注
      </div>
      <el-form ref="form" :model="form" label-width="60px">
        <el-form-item label="标注内容">
          <el-input v-model="form.comment" type="textarea" :rows="8" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="mini" type="info" @click="() => this.$emit('update:show', false)">
          取消
        </el-button>
        <el-button size="mini" type="primary" @click="save">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'SetComment',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        comment: ''
      }
    }
  },
  watch: {
    show: {
      immediate: true,
      handler: 'getInfo'
    }
  },
  methods: {
    getInfo(bool) {
      if (bool) {
        const hot = this.$parent.h
        const select = hot.getSelected()
        const cell = hot.getCellMeta(...select[0]).comment
        this.form.comment = cell ? cell.value : ''
      }
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('getComment', this.form)
          this.$emit('update:show', false)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
