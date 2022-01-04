<template>
  <div>
    <el-dialog
      v-dialogDrag
      :visible.sync="show"
      :modal="false"
      width="35%"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="() => this.$emit('update:show', false)"
    >
      <div slot="title">
        批量设置上级
      </div>
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        size="mini"
        label-width="60px"
      >
        <el-form-item label="档案" prop="pidName">
          <el-select
            v-model="form.pidName"
            placeholder="请选择档案"
            size="mini"
            style="width:100%"
            @change="getPid"
          >
            <el-option value="" style="height: 250px; overflow-y:auto;padding: 0px;">
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
        <el-button type="info" size="mini" @click="() => this.$emit('update:show', false)">
          关闭
        </el-button>
        <el-button type="primary" size="mini" @click="save">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Higherup',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: () => []
    },
    xmId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      form: {
        pid: '',
        pidName: ''
      },
      tree: {
        data: [],
        ids: []
      },
      rules: {
        // pidName: [{ required: true, message: '请选择上级', trigger: 'change' }]
      }
    }
  },
  watch: {
    data: {
      immediate: true,
      handler(val) {
        if (val.length) {
          this.ids = val.map(s => s.id)
          this.$api.reportxm.getHigherup({
            xmId: this.xmId,
            dossierDataId: this.ids.join(',')
          }).then(s => {
            this.tree.data = [...s.data]
          }).catch(e => this.$message.error(e.message))
        }
      }
    }
  },
  methods: {
    getPid() {},
    setTargetNode(node) {
      this.form.pid = node.id
      this.form.pidName = node.label
    },
    save() {
      // this.$emit('update:show', false)
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = { ...this.form }
          delete params.pidName
          this.$api.reportxm.setDataPid({
            pid: params.pid,
            dossierDataId: this.ids.join(',')
          }).then(s => {
            this.$emit('refreshTable')
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
