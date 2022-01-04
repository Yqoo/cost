<template>
  <div class="alter myTool">
    <el-dialog
      v-dialogDrag
      :visible.sync="show"
      :model="false"
      width="20%"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="() => $emit('update:show', false)"
    >
      <div slot="title">
        {{ info.type && info.type.indexOf('remove_') > -1 ? '删除' : '插入' }}{{ info.type && info.type.indexOf('row') > -1 ? '行' : '列' }}
      </div>
      <el-form ref="form" :model="form" size="mini">
        <el-form-item label="请选择：">
          <el-select
            v-model="form.amount"
            filterable
            allow-create
            default-first-option
            size="mini"
            :popper-class="info.class"
          >
            <el-option v-for="key in amountArr" :key="key.value" :label="key.label" :value="key.value" />
          </el-select>
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
  name: 'Alter',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      form: {
        amount: 1
      },
      amountArr: [
        { label: 1, value: 1 },
        { label: 5, value: 5 },
        { label: 8, value: 8 },
        { label: 10, value: 10 },
        { label: 15, value: 15 },
        { label: 20, value: 20 },
        { label: 50, value: 50 },
        { label: 100, value: 100 }
      ]
    }
  },
  methods: {
    save() {
      this.$emit('updateAmount', {
        amount: this.form.amount,
        type: this.info.type
      })
      this.$emit('update:show', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.alter {
  /deep/ .el-dialog__body {
    min-height: 48px;
  }
}
</style>
