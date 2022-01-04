<template>
  <el-dialog
    v-dialogDrag
    :modal="false"
    width="500px"
    :visible.sync="show"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :before-close="() => $emit('update:show', false)"
  >
    <div slot="title">
      {{ form.id === '' ? '新增' : '编辑' }}
    </div>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="80px"
      size="mini"
    >
      <el-form-item label="父节点" prop="pidName">
        <el-popover
          width="380"
          trigger="click"
          placement="bottom-start"
        >
          <div style="padding: 10px;">
            <Tree
              :data="tree"
              in-box
              @setTargetNode="setTargetNode"
            />
          </div>
          <el-input slot="reference" v-model="form.pidName" readonly />
        </el-popover>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" @blur="getPinYin(form.name)" />
      </el-form-item>
      <el-form-item label="编码" prop="sn">
        <el-input v-model="form.sn" />
      </el-form-item>
      <el-form-item label="描述" prop="desc_">
        <el-input v-model="form.desc_" />
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
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      datault: false
    },
    info: {
      type: Object,
      default: () => {}
    },
    tree: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      form: {
        pid: '',
        pidName: '',
        name: '',
        sn: '',
        desc_: '',
        id: ''
      },
      rules: {
        name: [{ required: true, message: '请填写名称', trigger: 'blur' }],
        sn: [{ required: true, message: '请填写编码', trigger: 'blur' }]
      }
    }
  },
  watch: {
    show: {
      immediate: true,
      handler(bool) {
        if (bool) {
          Object.keys(this.form).forEach(key => {
            this.form[key] = this.info[key] || ''
          })
        }
      }
    }
  },
  methods: {
    setTargetNode(node) {
      this.$set(this.form, 'pidName', node.label)
      this.$set(this.form, 'pid', node.id)
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const p = { ...this.form }
          this.$api.mxGraph.saveType(p).then(s => {
            this.$emit('refreshTaregtNode', s.data?.id)
            this.$message.success('保存成功！')
            this.$emit('update:show', false)
          }).catch(e => this.$message.error(e.message))
        }
      })
    },
    getPinYin(query) {
      if (query !== '') {
        this.$api.mxGraph.getPinYin({ query }).then(s => {
          this.form.sn = s.data || ''
        })
      }
    }
  }
}
</script>

<style>

</style>
