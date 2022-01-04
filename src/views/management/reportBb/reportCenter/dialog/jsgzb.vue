<template>
  <div>
    <el-dialog
      v-dialogDrag
      :visible.sync="show"
      :model="false"
      width="30%"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="() => $emit('update:show', false)"
    >
      <div slot="title">
        计算报表
      </div>
      <el-form ref="form" :model="form" label-width="100px" size="mini" :rules="rules">
        <el-form-item label="单位" prop="zth">
          <el-select v-model="form.zth" style="width: 100%" size="mini">
            <el-option
              v-for="item in unitData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="会计年" prop="kjnd">
          <el-select v-model="form.kjnd" style="width: 100%" size="mini">
            <el-option
              v-for="item in kjYear"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="会计起始月" prop="kjqj">
          <el-select v-model="form.kjqj" style="width: 100%" size="mini">
            <el-option
              v-for="it in kjMonth"
              :key="it.id"
              :label="it.name"
              :value="it.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="form.yjz">
            包含未记账
          </el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="form.showZero">
            是否显示 0 值
          </el-checkbox>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="info" size="mini" @click="() => this.$emit('update:show', false)">
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
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Jsgzb',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    status: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      kjYear: [], // 会计年
      kjMonth: [], // 会计月
      unitData: [], // 单位
      form: {
        kjnd: '',
        kjqj: '',
        zth: '',
        yjz: true,
        showZero: false
      },
      rules: {
        zth: [{ required: true, message: '请选择单位', trigger: 'change' }],
        kjnd: [{ required: true, message: '请选择会计年度', trigger: 'change' }],
        kjqj: [{ required: true, message: '请选择会计期间', trigger: 'change' }]
      }
    }
  },
  computed: {
    ...mapGetters(['targetAcset']),
    startZT() {
      const localAcset = JSON.parse(localStorage.getItem('startZT'))
      return localAcset
    }
  },
  watch: {
    show: {
      immediate: true,
      handler(val) {
        if (val) {
          if (this.startZT) {
            this.form.zth = this.startZT.zth
            this.getKjnd(this.form.zth)
            this.getDefaultValue(this.startZT.ztsn)
          }
        }
      }
    },
    // eslint-disable-next-line func-names
    'form.zth': function (val) {
      if (val) {
        this.getKjnd(val)
        this.form.kjnd = ''
        this.form.kjqj = ''
      }
    },
    // eslint-disable-next-line func-names
    'form.kjnd': function (val) {
      if (this.form.zth && val) {
        this.getKjqj(val)
        if (!this.qjFlag) {
          this.form.kjqj = ''
        }
      }
    }
  },
  created() {
    this.getZT().then(s => {
      s.forEach(l => {
        const obj = {}
        if (l.zth && l.ztmc) {
          obj.id = l.zth
          obj.name = l.ztmc
        }
        this.$set(this.unitData, this.unitData.length, obj)
      })
    })
  },
  methods: {
    ...mapActions({
      getZT: 'user/getZT'
    }),
    getDefaultValue(ztsn) {
      this.$api.reportDesign.getDefaultValue({ ztsn }).then(s => {
        this.qjFlag = true
        this.form.kjnd = s.data.kjnd
        this.form.kjqj = s.data.kjqj
      }).catch(e => this.$message.error(e.message))
    },
    getKjnd(id) { // 获取会计年度
      this.$api.reportDesign.getKjnd({ zth: id }).then(s => {
        this.qjFlag = true
        this.kjYear = [...s.data]
      }).catch(e => this.$message.error(e.message))
      this.$nextTick(() => {
        this.qjFlag = false
      })
    },
    async getKjqj(id) { // 获取会计起始月
      await this.$api.reportDesign.getKjqj({ zth: this.form.zth, kjnd: id }).then(s => {
        this.kjMonth = [...s.data]
      }).catch(e => this.$message.error(e.message))
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = { ...this.form }
          params.yjz = params.yjz ? 'wjz' : 'yjz'
          this.$emit('getGsHs', params)
          this.$emit('update:status', true)
          // this.$parent.status = true
          this.$emit('update:show', false)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
