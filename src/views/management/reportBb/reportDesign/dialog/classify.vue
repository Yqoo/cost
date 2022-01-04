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
        {{ usn ? '编辑' : '新增' }}报表分类
      </div>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="mini">
        <el-form-item label="编码" prop="sn">
          <el-input v-model="form.sn" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="上级分类" prop="pidName">
          <el-select v-model="form.pidName" style="width:100%">
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
  name: 'Classify',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    usn: {
      type: String,
      default: ''
    },
    treeData: {
      type: Array,
      default: () => []
    },
    info: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      pidData: this.treeData,
      form: {
        sn: '',
        name: '',
        pid: '',
        pidName: ''
      },
      id: '',
      rules: {
        sn: [{ required: true, message: '请输入编码', trigger: 'blur' }],
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      }
    }
  },
  watch: {
    info: {
      immediate: true,
      handler(val) {
        if (Object.keys(val).length) {
          if (val.icon === 'fl') {
            this.form.pidName = val.label
            this.form.pid = val.id
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
    getInfo(usn) {
      if (usn) {
        this.$api.reportDesign.getTreeDesc({ id: usn }).then(s => {
          Object.keys(this.form).forEach(k => {
            this.form[k] = s.data[k]
          })
          this.id = s.data.id
        }).catch(e => this.$message.error(e.message))
      }
    },
    setTargetNode(node) {
      if (node.icon === 'fl') {
        this.form.pidName = node.label
        this.form.pid = node.id
      } else this.$message.warning('该节点不可选择')
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = { ...this.form }
          delete params.pidName
          let url = 'addTree'
          if (this.id) {
            url = 'editTree'
            params.id = this.id
          }
          this.$api.reportDesign[url](params).then(s => {
            this.$message.success('保存成功')
            this.$emit('refshTree')
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
