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
      {{ id ? '编辑' : '新增' }}
    </div>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="80px"
      size="mini"
    >
      <el-form-item label="场景分类" prop="categoryName">
        <el-popover
          width="380"
          trigger="click"
          placement="bottom-start"
        >
          <div style="padding: 10px;">
            <Tree
              :data="tree"
              in-box
              @setTargetNode="setNode"
            />
          </div>
          <el-input slot="reference" v-model="form.categoryName" readonly />
        </el-popover>
      </el-form-item>
      <el-form-item label="场景名称" prop="name">
        <el-input v-model="form.name" @blur="getPinYin(form.name)" />
      </el-form-item>
      <el-form-item label="场景编码" prop="sn">
        <el-input v-model="form.sn" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-switch
          v-model="form.status"
          active-color="#409EFF"
          inactive-color="#909399"
        />
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
    tree: {
      type: Array,
      default: () => []
    },
    node: {
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
      form: {
        categoryName: '',
        categorySn: '',
        name: '',
        sn: '',
        status: true,
        id: '',
        flowXml: ''
      },
      rules: {
        categoryName: [{ required: true, message: '请选择场景分类', trigger: 'change' }],
        name: [{ required: true, message: '请填写场景名称', trigger: 'blur' }],
        sn: [{ required: true, message: '请填写场景编码', trigger: 'blur' }]
      }
    }
  },
  watch: {
    id: {
      immediate: true,
      handler: 'getInfo'
    },
    node: {
      immediate: true,
      handler(obj) {
        const { id } = this.form
        if (id === '') {
          this.form.categoryName = obj.label || ''
          this.form.categorySn = obj.id || ''
        }
      }
    }
  },
  methods: {
    getInfo(id) {
      if (id) {
        this.$api.mxGraph.getSceneInfo({ id }).then(s => {
          Object.keys(this.form).forEach(key => {
            this.form[key] = s.data?.[key] || ''
          })
          this.form.status = !!this.form.status
        }).catch(e => this.$message.error(e.message))
      }
    },
    setNode(node) {
      this.form.categoryName = node.label || ''
      this.form.categorySn = node.id || ''
    },
    getPinYin(query) {
      if (query !== '') {
        this.$api.mxGraph.getPinYin({ query }).then(s => {
          this.form.sn = s.data || ''
        })
      }
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const p = { ...this.form }
          this.$api.mxGraph.saveScene(p).then(s => {
            this.$emit('refreshTable')
            this.$emit('update:show', false)
            this.$message.success('保存成功！')
          })
        }
      })
    }
  }
}
</script>

<style>

</style>
