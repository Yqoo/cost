<template>
  <div>
    <el-dialog
      v-dialogDrag
      :visible.sync="show"
      :modal="false"
      width="65%"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="() => $emit('update:show', false)"
    >
      <div slot="title">
        {{ usn ? '编辑' : '新增' }}报表项目
      </div>
      <el-steps :active="targetStep" finish-status="success" align-center style="margin-bottom: 10px;">
        <el-step title="基本信息" />
        <el-step title="关联档案" />
      </el-steps>
      <Jbxx
        v-show="targetStep === 0"
        ref="jbxx"
        :hy-info="hyInfo"
        :data="data"
        :usn="usn"
        @next="next"
        @getInfoData="getInfo"
      />
      <Glda
        v-if="targetStep === 1"
        ref="glda"
        :form-data="form"
        :get-info-data="getInfoData"
        :usn="usn"
        @refresh="refresh"
      />
      <div slot="footer">
        <el-button v-show=" targetStep === 0" type="info" size="mini" @click="() => $emit('update:show', false)">
          取消
        </el-button>
        <el-button v-show=" targetStep > 0" type="primary" size="mini" @click="prev">
          上一步
        </el-button>
        <el-button v-show="targetStep < 1 " type="primary" size="mini" @click="save">
          下一步
        </el-button>
        <el-button v-show="targetStep === 1" type="primary" size="mini" @click="save">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Bbxm',
  components: {
    Jbxx: () => import('./jbxx'),
    Glda: () => import('./glda')
  },
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
      targetStep: 0,
      form: {},
      getInfoData: {}
    }
  },
  watch: {},
  methods: {
    save() {
      const { targetStep } = this
      const Deal = {
        0: () => {
          this.$refs.jbxx.save()
        },
        1: () => {
          this.$refs.glda.save()
        }
      }
      Deal[targetStep]()
      // this.$emit('update:show', false)
    },
    prev() {
      this.targetStep--
    },
    next(obj) {
      const { step, params } = obj
      this.targetStep = step
      Object.keys(params).forEach(key => {
        this.form[key] = params[key]
      })
    },
    refresh(id) {
      this.$emit('update:show', false)
      this.$emit('refresh', id)
    },
    getInfo(obj) {
      this.getInfoData = obj
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
