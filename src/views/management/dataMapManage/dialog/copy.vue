<template>
  <div>
    <el-dialog
      v-dialogDrag
      :modal="false"
      width="39%"
      :visible.sync="show"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="() => $emit('update:show', false)"
    >
      <div slot="title">
        另存为新版本
      </div>
      <div class="formBox">
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          size="mini"
          label-width="120px"
          status-icon
        >
          <el-form-item label="来源信息" prop="sourceInfo">
            <el-input v-model="form.sourceInfo" readonly />
          </el-form-item>
          <el-form-item label="默认期间方案" prop="defaultQjfaSn">
            <el-select
              v-model="form.defaultQjfaSn"
              placeholder="请选择期间方案"
            >
              <el-option value="" style="height: 250px; overflow-y:auto;padding:0px;">
                <Tree
                  :data="itemTree"
                  :search="false"
                  in-box
                  @setTargetNode="setTargetNode"
                />
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" clearable placeholder="请输入名称" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio v-model="form.status" :label="true">
              启用
            </el-radio>
            <el-radio v-model="form.status" :label="false">
              禁用
            </el-radio>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button
          type="info"
          size="mini"
          @click="() => $emit('update:show', false)"
        >
          取消
        </el-button>
        <el-button type="primary" size="mini" @click="save">
          保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      form: {
        id: '',
        sourceInfo: '',
        defaultQjfaSn: '',
        name: '',
        status: true
      },
      versionid: '',
      itemTree: [],
      rules: {
        name: [{ required: true, message: '请填写名称', trigger: 'blur' }]
      }
    }
  },
  watch: {
    versionId: {
      immediate: true,
      handler(val) {
        this.versionid = val
      }
    },
    info: {
      immediate: true,
      handler: 'getInfo'
    }
  },
  created() {
    this.getDefaultItem()
  },
  methods: {
    getInfo(val) {
      this.form.id = val.id
      this.form.sourceInfo = `${val.name} ${val.version}`
    },
    // 获取默认区间方案下拉树
    getDefaultItem() {
      this.$api.dataMapManage.getDefaultItem()
        .then(s => {
          this.itemTree = s.data
        })
        .catch(e => e)
    },
    setTargetNode(node) {
      if (node.dataType === 3) {
        this.form.defaultQjfaSn = node.sn
      } else {
        this.$message.warning('此节点不可选！')
      }
    },
    // 保存
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$api.dataMapManage
            .copyNewVersion({
              id: this.form.id,
              defaultQjfaSn: this.form.defaultQjfaSn,
              status: this.form.status,
              name: this.form.name
            })
            .then(s => {
              this.$emit('success', this.versionid)
              this.$emit('update:show', false)
            })
            .catch(e => {
              this.$emit('update:show', false)
              this.$message.error(e.message)
            })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.formBox{
  height:220px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
