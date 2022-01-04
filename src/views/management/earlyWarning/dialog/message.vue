<template>
  <div>
    <el-dialog
      v-dialogDrag
      :visible.sync="show"
      :modal="false"
      width="35%"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="() => $emit('update:show', false)"
    >
      <div slot="title">
        错误信息
      </div>
      <el-input v-model="mess" type="textarea" :autosize="{ minRows: 12}" />
      <div slot="footer">
        <el-button type="info" size="mini" @click="() => $emit('update:show', false)">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ErrorMes',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    mess: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
