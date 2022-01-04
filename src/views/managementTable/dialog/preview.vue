<template>
  <el-dialog
    v-dialogDrag
    :modal="false"
    width="700px"
    :visible.sync="show"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :before-close="() => $emit('update:show', false)"
  >
    <div slot="title">
      数据预览
    </div>
    <Table
      :data="tableData"
      :columns="cols"
      :multiple="false"
      :search="false"
      :height="500"
    />
    <div slot="footer">
      <el-button type="primary" size="mini" @click="() => $emit('update:show', false)">
        关闭
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
    cols: {
      type: Array,
      default: () => []
    },
    tableData: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style>

</style>
