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
        查看详情
      </div>
      <el-form ref="form" :model="form" size="mini" label-width="80px">
        <el-form-item label="提醒时间">
          <el-input v-model="form.createTime" readonly />
        </el-form-item>
        <el-form-item label="提醒内容">
          <el-input v-model="form.remindDescribe" type="textarea" :autosize="{ minRows: 10}" readonly />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" size="mini" @click="checkDesc">
          查看详情
        </el-button>
        <el-button type="primary" size="mini" @click="read">
          已读
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Early',
  props: {
    info: {
      type: Object,
      default: () => {}
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        createTime: '',
        remindDescribe: '',
        id: ''
      }
    }
  },
  watch: {
    info: {
      immediate: true,
      handler(val) {
        if (Object.keys(val).length) {
          Object.keys(this.form).forEach(k => {
            this.form[k] = val[k]
          })
        }
      }
    }
  },
  methods: {
    checkDesc() {
      this.$router.push({
        path: '/earlyWarning'
      })
      this.$emit('update:show', false)
    },
    read() {
      this.$api.earlyWarning.changeReault({ id: this.info.id }).then(s => {
        this.$emit('refash', this.info.id)
        this.$emit('update:show', false)
      }).catch(e => this.$message.error(e.message))
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
