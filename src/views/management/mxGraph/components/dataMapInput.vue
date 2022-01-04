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
      数据映射
    </div>
    <el-form
      ref="form"
      v-waiting="loading"
      :model="form"
      :rules="rules"
      size="mini"
      label-width="70px"
    >
      <el-form-item label="映射方案" prop="mapName">
        <el-select v-model="form.mapName" style="width: 100%;">
          <el-option value="" style="height: 250px; overflow-y:auto;padding: 0px">
            <Tree
              :data="bmTree"
              :search="false"
              in-box
              @setTargetNode="setTargetNode"
            />
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="期间类型" prop="qjType">
        <el-select v-model="form.qjType" style="width: 100%;">
          <el-option
            v-for="item in qj"
            :key="item.valye"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="期间变量" prop="qjVariable">
        <el-select v-model="form.qjVariable">
          <el-option
            v-for="(value, key) in variableDefine"
            :key="key"
            :label="key"
            :value="key"
          />
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
    datas: {
      type: Object,
      default: () => {}
    },
    variableDefine: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      loading: false,
      form: {
        mapSn: '',
        mapName: '',
        qjType: '',
        qjVariable: ''
      },
      rules: {
        mapName: [{ required: true, message: '必填', trigger: 'change' }],
        qjType: [{ required: true, message: '必填', trigger: 'change' }],
        qjVariable: [{ required: true, message: '必填', trigger: 'change' }]
      },
      bmTree: [],
      qj: []
    }
  },
  watch: {
    datas: {
      immediate: true,
      handler(obj) {
        if (JSON.stringify(obj) !== '{}') {
          this.form = this.$tools.deepClone(obj)
        }
      }
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const clone = this.$tools.deepClone(this.form)
          const params = {
            in: {
              mapSn: clone.mapSn,
              qjType: clone.qjType,
              qjVariable: clone.qjVariable,
              model: 'DataMapInput'
            },
            out: [
              { field: 'key' },
              { field: 'value' }
            ],
            original: clone
          }
          this.$emit('setNodeDatas', {
            type: 'DataMapInput',
            data: params
          })
          this.$emit('update:show', false)
        }
      })
    },
    setTargetNode(node) {
      if (!node.disabled) {
        this.form.mapSn = node.id
        this.form.mapName = node.label
      }
    },
    async getInfo() {
      this.loading = true
      const bm = await this.$api.kettle.getDossierTree()
      const qj = await this.$api.kettle.getQjfaType()
      this.bmTree = bm.data
      this.qj = qj.data
      this.loading = false
    }
  }
}
</script>
