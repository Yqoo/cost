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
        {{ id ? "修改":"新增" }}版本管理
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
          <el-form-item label="映射方案编码" prop="mapSn">
            <el-input v-model="form.mapSn" clearable readonly />
          </el-form-item>
          <el-form-item v-if="id" label="版本" prop="version">
            <el-input v-model="form.version" clearable placeholder="请输入版本" />
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" clearable placeholder="请输入名称" />
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
    id: {
      type: String,
      default: ''
    },
    mapSn: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      form: {
        id: '',
        mapSn: '',
        name: '',
        version: '',
        defaultQjfaSn: '',
        status: true
      },
      mapsn: '',
      itemTree: [],
      rules: {
        mapSn: [{ required: true, message: '请填写编码', trigger: 'blur' }],
        defaultQjfaSn: [
          { required: true, message: '请选择区间方案', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    id: {
      immediate: true,
      handler: 'getInfo'
    },
    mapSn: {
      immediate: true,
      handler(val) {
        if (val) {
          this.form.mapSn = val
        }
      }
    }
  },
  created() {
    this.getDefaultItem()
  },
  methods: {
    // 保存
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = this.form
          this.$api.dataMapManage
            .saveYSFAVersion(params)
            .then(s => {
              this.$emit('success', this.form.mapSn)
              this.$emit('update:show', false)
            })
            .catch(e => {
              this.$emit('update:show', false)
              this.$message.error(e.message)
            })
        }
      })
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
    getInfo(val) {
      if (val) {
        this.$api.dataMapManage
          .getVersionInfo({ id: val })
          .then(s => {
            this.form.id = s.data.id
            this.form.mapSn = s.data.mapSn
            this.form.name = s.data.name
            this.form.version = s.data.version
            this.form.defaultQjfaSn = s.data.defaultQjfaSn || ''
            this.form.status = s.data.status
          })
          .catch(e => this.$message.error(e.message))
      }
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
