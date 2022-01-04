<template>
  <div>
    <el-dialog
      v-dialogDrag
      :visible.sync="show"
      :model="false"
      width="35%"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="() => $emit('update:show', false)"
    >
      <div slot="title">
        {{ usn ? '编辑' : '新增' }}报表
      </div>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="mini">
        <el-form-item label="报表名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="报表分类" prop="categoryName">
          <el-select v-model="form.categoryName" style="width:100%">
            <el-option value="" style="height: 250px; overflow-y:auto;padding:0px;">
              <Tree
                :data="pidData"
                :search="false"
                in-box
                @setTargetNode="setTargetNode"
              />
            </el-option>
          </el-select>
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
  name: 'ReportList',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    usn: {
      type: String,
      default: ''
    },
    pidData: {
      type: Array,
      default: () => []
    },
    node: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      id: '',
      form: {
        name: '',
        categoryName: '',
        categoryId: '',
        fileType: 'xls'
      },
      rules: {
        name: [{ required: true, message: '报表名称不能为空', trigger: 'blur' }],
        categoryName: [{ required: true, message: '请选择报表分类', trigger: 'change' }]
      }
    }
  },
  watch: {
    node: {
      immediate: true,
      handler(val) {
        if (Object.keys(val).length && !this.usn) {
          if (val.icon === 'fl') {
            this.form.categoryName = val.label
            this.form.categoryId = val.id
          }
        }
      }
    },
    usn: {
      immediate: true,
      handler: 'getInfo'
    }
  },
  methods: {
    getInfo(val) {
      if (val) {
        this.$api.reportDesign.getBbDesc({ id: val }).then(s => {
          Object.keys(this.form).forEach(k => {
            this.form[k] = s.data[k]
            this.id = s.data.id
          })
        }).catch(e => this.$message.error(e.message))
      }
    },
    setTargetNode(node) {
      if (node.icon === 'fl') {
        this.form.categoryName = node.label
        this.form.categoryId = node.id
      } else this.$message.warning('该节点不可选择')
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = { ...this.form }
          delete params.categoryName
          let url = 'addReportList'
          if (this.id) {
            url = 'editReportList'
            params.id = this.id
          }
          this.$api.reportDesign[url](params).then(s => {
            this.$message.success('保存成功')
            this.$emit('refshBbList', params.categoryId)
            this.$emit('update:show', false)
          }).catch(e => this.$message.error(e.message))
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
