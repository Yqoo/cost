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
        <el-form-item label="监测时间">
          <el-input v-model="form.createTime" readonly />
        </el-form-item>
        <el-form-item label="监测内容">
          <el-input v-model="form.remindDescribe" type="textarea" :autosize="{ minRows: 10}" readonly />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button v-if="info.status === 0" type="primary" size="mini" @click="read">
          已读
        </el-button>
        <el-button type="info" size="mini" @click="() => $emit('update:show', false)">
          取消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Desc',
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
  computed: {
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
    read() {
      this.$api.earlyWarning.changeReault({ id: this.info.id }).then(s => {
        this.$emit('refshTable')
        this.$emit('update:show', false)
      }).catch(e => this.$message.error(e.message))
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
