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
        {{ tip }}
      </div>
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="数据库" prop="dsId">
          <el-select v-model="form.dsId" style="width:100%" size="mini">
            <el-option
              v-for="item in baseData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
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
  </div>
</template>

<script>
export default {
  name: 'Database',
  props: {
    tip: {
      type: String,
      default: '数据库'
    },
    show: {
      type: Boolean,
      default: false
    },
    base: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      baseData: [],
      form: {
        dsId: ''
      },
      rules: {
        dsId: [{ required: true, message: '请选择数据库', trigger: 'change' }]
      }
    }
  },
  watch: {
    show: {
      immediate: true,
      handler: 'getInfo'
    },
    base: {
      immediate: true,
      handler(val) {
        if (val) this.form.dsId = val
      }
    }
  },
  methods: {
    getInfo(bool) {
      if (bool) {
        this.$api.functionCenter.getSJY().then(s => {
          this.baseData = [...s.data]
        }).catch(e => this.$message.error(e.message))
      }
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('dsId', this.form)
          this.$emit('update:show', false)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
