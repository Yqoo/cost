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
        {{ usn ? '编辑': '新增' }}函数
      </div>
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        size="mini"
        label-width="120px"
      >
        <el-form-item label="参数名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="中文名称" prop="chineseName">
          <el-input v-model="form.chineseName" />
        </el-form-item>
        <el-form-item label="格式类型" prop="type">
          <el-select v-model="form.type" style="width:100%">
            <el-option label="字符串" value="string" />
            <el-option label="数字型" value="number" />
            <el-option label="日期型" value="date" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.type === 'date'" label="日期类型" prop="dateType">
          <el-select v-model="form.dateType" size="mini">
            <el-option v-for="item in dateArr" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="说明" prop="desc">
          <el-input v-model="form.desc" type="textarea" />
        </el-form-item>
        <el-form-item label="是否必填" prop="must">
          <el-checkbox v-model="form.must" />
        </el-form-item>
        <el-form-item v-if="form.type !== 'date'" label="全局维度" prop="qjwd">
          <el-row>
            <el-col :span="6">
              <el-checkbox v-model="form.qjwd" @change="isQJWD" />
            </el-col>
            <el-col :span="18">
              <el-select
                v-if="form.qjwd"
                v-model="form.qjwdId"
                placeholder="请选择全局维度"
              >
                <el-option
                  v-for="item in qjwdList"
                  :key="item.id_"
                  :label="item.name_"
                  :value="item.id_"
                />
              </el-select>
            </el-col>
          </el-row>
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
export default {
  name: 'Function',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    usn: {
      type: String || Number,
      default: ''
    },
    data: {
      type: Array,
      default: () => []
    },
    tips: {
      type: String,
      default: ''
    },
    sqlData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      qjwdList: [], // 全局维度下拉列表
      form: {
        id: Math.random(),
        name: '',
        chineseName: '',
        type: 'string',
        desc: '',
        must: true,
        dateType: 'yyyy-MM-dd',
        qjwd: false, // 是否为全局维度
        qjwdId: '' // 全局维度id
      },
      rules: {
        name: [{ required: true, message: '请填写名称', trigger: 'blur' }],
        chineseName: [{ required: true, message: '请填写中文名称', trigger: 'blur' }]
      },
      dateArr: [
        { label: 'yyyy', value: 'yyyy' },
        { label: 'yyyyMM', value: 'yyyyMM' },
        { label: 'yyyyMMdd', value: 'yyyyMMdd' },
        { label: 'yyyy-MM', value: 'yyyy-MM' },
        { label: 'yyyy-MM-dd', value: 'yyyy-MM-dd' },
        { label: 'yyyy/MM', value: 'yyyy/MM' },
        { label: 'yyyy/MM/dd', value: 'yyyy/MM/dd' }
      ]
    }
  },
  watch: {
    usn: {
      immediate: true,
      handler: 'getInfo'
    }
  },
  created() {
    this.getQJWDData()
  },
  methods: {
    isQJWD(val) { // 是否是全局维度
      this.form.qjwd = val
    },
    getQJWDData() { // 获取全局维度的下拉数据
      this.$api.functionCenter.getQJWDData().then(s => {
        this.qjwdList = [...s.data]
      }).catch(e => e)
    },
    getInfo(val) {
      if (+val) {
        this.form = JSON.parse(JSON.stringify(this.data.filter(l => l.id === +val)[0]))
      }
    },
    verify() {
      const params = { ...this.form }
      const results = {
        flag: true,
        message: '验证通过'

      }
      this.$parent.paramData.forEach(l => {
        if (l.tableList.length
              && l.tableList.some(e => `${e.field}${e.title}` === `${params.name}${params.chineseName}`)
        ) {
          results.flag = false
          results.message = '原始参数名称+中文名称与函数参数重复'
        }
      })
      return results
    },
    save() {
      // eslint-disable-next-line consistent-return
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = { ...this.form }
          if (/[\u4E00-\u9FA5]/i.test(params.name)) {
            this.$message.warning('函数名称只能由字符数字和字母组成！')
            return false
          }
          if (!this.usn && this.$parent.addPa.oldCanShuData.some(e => e.name === params.name)) {
            this.$message.warning('原始参数名称重复！')
            return false
          }
          const results = this.verify()
          const arr = JSON.parse(JSON.stringify(this.data))
          if (results.flag) {
            if (this.usn) {
              const index = arr.findIndex(l => l.id === params.id)
              this.$set(arr, index, params)
            } else {
              arr.push(params)
              this.$parent.activeStep = 3
            }
            this.$emit('refshData', arr)
            this.$emit('update:show', false)
          } else this.$message.warning(results.message)
        } else return false
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
