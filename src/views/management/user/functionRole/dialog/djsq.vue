<template>
  <div>
    <el-dialog
      v-dialogDrag
      :visible.sync="show"
      :modal="false"
      width="30%"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="() => $emit('update:show', false)"
    >
      <div slot="title">
        <span>单据授权</span>
      </div>
      <div>
        <Tree
          ref="tree"
          search
          :check-box="true"
          :data="djsqData"
          :default-checked-keys="defaultKeys"
          @check="djsqCheck"
        />
      </div>
      <div slot="footer">
        <el-button type="info" size="mini" @click="() => $emit('update:show', false)">
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
  name: 'Djsq',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      djsqData: [],
      defaultKeys: []
    }
  },
  methods: {
    djsqCheck(val) {
      console.log(val)
    },
    save() {
      this.$emit('update:show', false)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
