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
        {{ id ? '编辑' : '新增' }}预警分类
      </div>
      <el-form ref="form" :rules="rules" :model="form" label-width="80px" size="mini" status-icon>
        <el-form-item label="编码" prop="sn">
          <el-input v-model="form.sn" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="选择上级" prop="pidName">
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
// earlyWarning
export default {
  name: 'TreeClassify',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default: () => {}
    },
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      pidData: [],
      form: {
        sn: '',
        name: '',
        pidName: '',
        pid: '',
        model: 'earlyWarning'
      },
      rules: {
        sn: [{ required: true, message: '请输入编码', trigger: 'blur' }],
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      }
    }
  },
  watch: {
    id: {
      immediate: true,
      handler: 'getInfo'
    },
    info: {
      immediate: true,
      handler(val) {
        if (Object.keys(val).length) {
          this.form.pidName = val.label
          this.form.pid = val.id
        }
      }
    }
  },
  created() {
    this.getPidTree()
  },
  methods: {
    getInfo(id) {
      if (id) {
        this.$api.earlyWarning.getTreeDesc({ idOrSn: id }).then(s => {
          Object.keys(this.form).forEach(k => {
            this.form[k] = s.data[k]
          })
          this.form.id = s.data.id
        }).catch(e => this.$message.error(e.message))
      }
    },
    getPidTree() {
      this.$api.earlyWarning.getTree().then(s => {
        this.pidData = s.data
      }).catch(e => this.$message.error(e.message))
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = { ...this.form }
          delete params.pidName
          const url = this.id ? 'editTree' : 'addTree'
          this.$api.earlyWarning[url](params).then(s => {
            this.$message.success('保存成功')
            this.$emit('update:show', false)
            this.$emit('refshTree')
          }).catch(e => this.$message.error(e.message))
        }
      })
    },
    setTargetNode(node) {
      this.form.pidName = node.label
      this.form.pid = node.id
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
