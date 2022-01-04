<template>
  <div>
    <el-dialog
      v-dialogDrag
      :visible.sync="show"
      :modal="false"
      width="60%"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="close"
    >
      <div slot="title">
        函数详情
      </div>
      <div class="SelectFile_main">
        <div class="exhibition">
          <el-input
            v-model="content"
            :readonly="isEdit"
            type="textarea"
            :rows="12"
          />
        </div>
      </div>
      <div slot="footer">
        <el-button type="info" size="mini" @click="close">
          取消
        </el-button>
        <el-button v-if="isEdit" type="info" size="mini" @click="beautifyOpt()">
          {{ isBeaut? '美化':'还原' }}
        </el-button>
        <el-button type="primary" size="mini" @click="save">
          {{ isEdit? '编辑':'保存' }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    tableId: {
      type: String,
      default: ''
    },
    row: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      tableid: '',
      id: '',
      content: '',
      commonContent: '',
      beautContent: '',
      isEdit: true,
      isBeaut: true,
      operations: ['+', '-', '*', '/']
    }
  },
  watch: {
    tableId: {
      immediate: true,
      handler(val) {
        if (val) {
          this.tableid = val
        }
      }
    },
    row: {
      immediate: true,
      handler(val) {
        if (val.id) {
          this.id = val.id
          this.content = val.dataFormula
          this.commonContent = val.dataFormula
          // this.beautContent = val.dataFormula
        }
      }
    }
  },
  created() {
  },
  methods: {
    beautifyOpt() {
      if (this.isBeaut) {
        // eslint-disable-next-line no-useless-escape
        const reg = /[\÷\+\-\*\/]/g
        this.beautContent = this.content
        this.content = this.beautContent.replace(reg, '$&\r\n')
      } else {
        this.content = this.commonContent
      }
      this.isBeaut = !this.isBeaut
    },
    close() {
      this.$emit('update:show', false)
      this.$emit('close')
      this.content = this.commonContent
      this.isBeaut = true
      this.isEdit = true
    },
    editOpt() {
      const content = this.content.replace(/\s*/g, '')
      if (content !== this.commonContent) {
        const formData = new FormData()
        formData.append('id', this.id)
        formData.append('dataFormula', content)
        this.$http.post('/bbDossierDataController/updateBbMeasureFormula', formData).then(s => {
          this.$emit('refreshTable', this.tableid)
        }).catch(e => this.$message.error(e.message))
      }
    },
    save() {
      this.isEdit = !this.isEdit
      if (this.isEdit) {
        this.editOpt()
        this.$emit('update:show', false)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
