<template>
  <el-dialog
    v-dialogDrag
    :modal="false"
    width="400px"
    :visible.sync="show"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :before-close="() => $emit('update:show', false)"
  >
    <div slot="title">
      {{ status === 'add' ? '添加' : '编辑' }}分类
    </div>
    <el-form
      ref="form"
      v-waiting="loading"
      :model="form"
      :rules="rules"
      size="mini"
      label-width="80px"
    >
      <el-form-item label="分类编码" prop="sn">
        <el-input v-model="form.sn" />
      </el-form-item>
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="上级分类" prop="parent_name">
        <el-select
          v-model="form.parent_name"
          style="width: 100%;"
          clearable
          @clear="() => form.psn = ''"
        >
          <el-option value="" style="height: 250px; overflow-y:auto;padding: 0px">
            <Tree
              :data="tree"
              :search="false"
              in-box
              @setTargetNode="setId"
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
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    meta: {
      type: Object,
      default: () => {}
    },
    status: {
      type: String,
      default: 'add'
    },
    parent: {
      type: Object,
      default: () => {}
    },
    ztsn: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      form: {
        sn: '',
        name: '',
        psn: '',
        parent_name: '',
        model: ''
      },
      rules: {
        sn: [{ required: true, message: '请填写分类编码', trigger: 'blur' }],
        name: [{ required: true, message: '请填写分类名称', trigger: 'blur' }]
      },
      tree: [],
      targetNode: null
    }
  },
  watch: {
    status: {
      immediate: true,
      handler: 'getInfo'
    },
    parent: {
      immediate: true,
      handler: 'setParent'
    }
  },
  created() {
    this.getTree()
  },
  methods: {
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          const params = { ...this.form }
          delete params.parent_name
          params.model = this.meta.inner
          let url = 'addType'
          if (this.status !== 'add') {
            url = 'updateType'
            params.id = this.status
          }
          this.$api.record[url](this.meta.inner, {
            ...params,
            ztsn: this.meta.outer === 'treatment' ? this.ztsn : ''
          }).then(s => {
            this.$emit('refresTree', s.data)
            this.$emit('update:show', false)
            this.$message.success('保存成功！')
          }).catch(e => {
            this.loading = false
            this.$message.error(e.message)
          })
        }
      })
    },
    setParent(obj) {
      if (obj) this.setId(obj)
    },
    getInfo(val) {
      if (val !== 'add') {
        this.$api.record.getTypeInfo({
          id: val,
          ztsn: this.meta.outer === 'treatment' ? this.ztsn : ''
        }).then(s => {
          Object.assign(this.form, { ...s.data })
          delete this.form.zth
        }).catch(e => this.$message.error(e.message))
      }
    },
    setId(node) {
      this.form.parent_name = node.label
      this.form.psn = node.sn
    },
    getTree() {
      this.$api.record.simpleTree(this.meta.inner, {
        id: this.status === 'add' ? 0 : this.status,
        type: this.meta.inner,
        ztsn: this.meta.outer === 'treatment' ? this.ztsn : ''
      }).then(s => {
        this.tree = [...s.data]
      }).catch(e => {
        this.$message.error(e.message)
      })
    }
  }
}
</script>
