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
        {{ usn ? '编辑' : '新增' }}报表项目体系
      </div>
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        size="mini"
        label-width="120px"
      >
        <el-form-item label="代码" prop="sn">
          <el-input v-model="form.sn" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="所属分类">
          <el-select v-model="form.pidName" style="width:100%">
            <el-option value="" style="height: 250px; overflow-y:auto;padding:0px;">
              <Tree
                :data="td"
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
  name: 'Bbtx',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    usn: {
      type: String,
      default: ''
    },
    hyInfo: {
      type: Object,
      default: () => {}
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      td: this.data,
      id: '',
      form: {
        sn: '',
        name: '',
        pid: '',
        pidName: '',
        kjzd: '',
        hybb: ''
      },
      rules: {
        sn: [{ required: true, message: '请输入代码', trigger: 'blur' }],
        name: [{ required: true, messgae: '请输入名称', trigger: 'blur' }]
      }
    }
  },
  watch: {
    hyInfo: {
      immediate: true,
      handler(val) {
        if (val) {
          this.form.pid = val.pid
          this.form.pidName = val.pName
          this.form.kjzd = val.kjzd
          this.form.hybb = val.hybb
        }
      }
    },
    usn: {
      immediate: true,
      handler: 'getInfo'
    },
    // eslint-disable-next-line func-names
    'form.pidName': function (val) {
      if (val === '') this.form.pid = ''
    }
  },
  methods: {
    getInfo(id) {
      if (id) {
        this.$api.reportxm.getTreeDesc({ id }).then(s => {
          Object.keys(this.form).forEach(key => {
            this.form[key] = s.data[key]
            this.id = s.data.id
          })
        }).catch(e => this.$message.error(e.message))
      }
    },
    save() {
      this.$refs.form.validate(valit => {
        if (valit) {
          const params = { ...this.form }
          delete params.pidName
          let url = ''
          if (this.usn) {
            url = 'editBbTxTree'
            params.id = this.id
          } else url = 'addBbTxTree'
          this.$api.reportxm[url](params).then(s => {
            this.$message.success('保存成功')
            this.$emit('refreshTree')
            this.$emit('update:show', false)
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
