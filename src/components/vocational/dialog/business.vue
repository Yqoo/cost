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
      {{ status === 'add' ? '添加' : '编辑' }}自定业务
    </div>
    <el-form
      ref="form"
      v-waiting="loading"
      :model="form"
      :rules="rules"
      size="mini"
      label-width="70px"
    >
      <el-form-item label="分类" prop="catName">
        <el-select
          v-model="form.catName"
          style="width: 100%;"
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
      <el-form-item label="编码" prop="sn">
        <el-input v-model="form.sn" />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" />
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
    from: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      default: 'add'
    },
    ztsn: {
      type: String,
      default: ''
    },
    objInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      loading: false,
      form: {
        catId: '',
        catName: '',
        sn: '',
        name: ''
      },
      rules: {
        catName: [{ required: true, message: '请选择分类', trigger: 'blur' }],
        sn: [{ required: true, message: '请填写编码', trigger: 'blur' }],
        name: [{ required: true, message: '请填写名称', trigger: 'blur' }]
      },
      tree: []
    }
  },
  watch: {
    status: {
      immediate: true,
      handler: 'getInfo'
    },
    objInfo: {
      immediate: true,
      handler(val) {
        if (val) {
          if (val && val.type === 'category') {
            this.form.catName = val.label
            this.form.catId = val.id
          } else {
            this.form.catName = ''
            this.form.catId = ''
          }
        }
      }
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
          delete params.catName
          let url = 'addBusiness'
          if (this.status !== 'add') {
            url = 'updateBusiness'
            params.id = this.status
          }
          this.$api.business[url]({
            ...params,
            ztsn: this.from === 'treatment' ? this.ztsn : ''
          }).then(s => {
            this.$emit('refresh', s.data)
            this.$emit('update:show', false)
          }).catch(e => {
            this.loading = false
            this.$message.error(e.message)
          })
        }
      })
    },
    getInfo(val) {
      if (val !== 'add') {
        this.$api.business.getBusInfo({
          id: val,
          ztsn: this.from === 'treatment' ? this.ztsn : ''
        }).then(s => {
          Object.assign(this.form, { ...s.data })
        }).catch(e => this.$message.error(e.message))
      }
    },
    getTree() {
      this.$api.business.getTypeTree({
        id: this.status === 'add' ? 0 : this.status,
        ztsn: this.from === 'treatment' ? this.ztsn : ''
      }).then(s => {
        this.tree = [...s.data]
      }).catch(e => {
        this.$message.error(e.message)
      })
    },
    setId(node) {
      this.form.catName = node.label
      this.form.catId = node.sn
    }
  }
}
</script>
