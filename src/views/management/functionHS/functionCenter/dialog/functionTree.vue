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
        {{ usn ? '编辑' : '新增' }}函数分类
      </div>
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        size="mini"
        label-width="120px"
      >
        <el-form-item label="编码" prop="sn">
          <el-input v-model="form.sn" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="所属上级" prop="pidName">
          <el-select v-model="form.pidName" style="width:100%">
            <el-option value="" style="height: 250px; overflow-y:auto;padding:0px;">
              <Tree
                :data="tree.data"
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
export default {
  name: 'FunctionTree',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    usn: {
      type: String,
      default: ''
    },
    treeNode: {
      type: Object,
      default: () => {}
    },
    fdData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      id: '',
      tree: {
        data: this.fdData
      },
      form: {
        pid: '',
        pidName: '',
        sn: '',
        name: ''
      },
      rules: {
        sn: [{ required: true, message: '请填写编码', trigger: 'blur' }],
        name: [{ required: true, message: '请填写名称', trigger: 'blur' }]
        // pidName: [{ required: true, message: '请选择上级', trigger: 'change' }]
      }
    }
  },
  watch: {
    treeNode: {
      immediate: true,
      handler(val) {
        if (Object.keys(val).length) {
          this.form.pid = val.id
          this.form.pidName = val.label
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
        this.$api.functionCenter.getTreeDesc({ id: val }).then(s => {
          Object.keys(this.form).forEach(key => {
            this.form[key] = s.data[key]
          })
          this.id = s.data.id
        })
      }
    },
    setTargetNode(node) {
      if (node.icon === 'fl') {
        this.form.pid = node.id
        this.form.pidName = node.label
      } else this.$message.warning('当前节点不可选择')
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = { ...this.form }
          delete params.pidName
          let url = 'addfunctionTree'
          if (this.id) {
            url = 'editfunctionTree'
            params.id = this.id
          }
          this.$api.functionCenter[url](params).then(s => {
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
