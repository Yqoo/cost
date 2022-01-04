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
      编辑档案值定义
    </div>
    <el-form
      ref="form"
      v-waiting="tree.loading"
      :model="form"
      :rules="rules"
      size="mini"
      label-width="90px"
    >
      <el-form-item label="系统档案项" prop="snName">
        <el-select v-model="form.snName" style="width: 100%;">
          <el-option value="" style="height: 250px; overflow-y:auto;padding: 0px">
            <Tree
              :data="tree.data"
              :search="false"
              in-box
              @setTargetNode="setId"
            />
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="使用值" prop="useField.sn">
        <el-select v-model="form.useField.sn" placeholder="请选择使用值" style="width: 100%;">
          <el-option
            v-for="(op, key) in options"
            :key="key"
            :value="key"
            :label="op"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="标题值" prop="useField.name">
        <el-select v-model="form.useField.name" placeholder="请选择标题值" style="width: 100%;">
          <el-option
            v-for="(op, key) in options"
            :key="key"
            :value="key"
            :label="op"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="只显示标题值" prop="onlyShowName">
        <el-switch
          v-model="form.onlyShowName"
          active-color="#4390ee"
          active-text="是"
          inactive-text="否"
        />
      </el-form-item>
      <el-form-item label="多选" prop="multiple">
        <el-switch
          v-model="form.multiple"
          active-color="#4390ee"
          active-text="是"
          inactive-text="否"
        />
      </el-form-item>
      <el-form-item label="全路径展示" prop="showfullpath">
        <el-switch
          v-model="form.showfullpath"
          active-color="#4390ee"
          active-text="是"
          inactive-text="否"
        />
      </el-form-item>
      <el-form-item label="只选末级" prop="mj">
        <el-switch
          v-model="form.mj"
          active-color="#4390ee"
          active-text="是"
          inactive-text="否"
        />
      </el-form-item>
      <el-form-item label="禁用树形" prop="enabelTree">
        <el-switch
          v-model="form.enabelTree"
          active-color="#4390ee"
          active-text="是"
          inactive-text="否"
        />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="info" size="mini" @click="() => $emit('update:show', false)">
        取消
      </el-button>
      <el-button type="primary" size="mini" @click="save">
        保存
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: ['show', 'meta', 'info', 'ztsn'],
  data() {
    return {
      form: {
        snName: '',
        sn: '',
        useField: {
          sn: '',
          name: ''
        },
        onlyShowName: false,
        multiple: false,
        showfullpath: false,
        mj: true,
        enabelTree: false
      },
      rules: {
        snName: [{ required: true, message: '请选择系统档案项', trigger: 'blur' }],
        'useField.sn': [{ required: true, message: '请选择使用值', trigger: 'change' }],
        'useField.name': [{ required: true, message: '请选择标题值', trigger: 'change' }]
      },
      tree: {
        loading: false,
        data: []
      },
      options: {}
    }
  },
  watch: {
    info: {
      immediate: true,
      handler: 'setDefaultValues'
    }
  },
  created() {
    this.getTree()
  },
  methods: {
    async setDefaultValues(obj) {
      if (typeof (obj) === 'object') {
        await this.getCols(obj.sn)
        Object.assign(this.form, obj)
      }
    },
    getTree() {
      this.tree.loading = true
      this.$api.record.getTree(this.meta.inner, {
        ztsn: this.meta.outer === 'treatment' ? this.ztsn : ''
      }).then(s => {
        this.tree.data = [...s.data]
        this.tree.loading = false
      }).catch(e => {
        this.tree.loading = false
        this.$message.error(e.message)
      })
    },
    getCols(id) {
      this.$api.record.getCols(this.meta.inner, {
        id,
        ztsn: this.meta.outer === 'treatment' ? this.ztsn : ''
      }).then(s => {
        this.options = s.data && { ...s.data }
      }).catch(e => this.$message.error(e.message))
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) this.$emit('update:show', false)
      })
    },
    setId(node) {
      if (node.type === 'dossier') {
        this.form.snName = node.label
        this.form.sn = node.id
        Object.assign(this.form.useField, {
          sn: '',
          name: ''
        })
        this.getCols(node.id)
      } else this.$message.warning('当前节点不可用！')
    }
  }
}
</script>

<style>

</style>
