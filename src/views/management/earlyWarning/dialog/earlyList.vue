<template>
  <div>
    <el-dialog
      v-dialogDrag
      :visible.sync="show"
      :modal="false"
      width="45%"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="() => $emit('update:show', false)"
    >
      <div slot="title">
        {{ usn ? '编辑' : '新增' }}预警
      </div>
      <el-form ref="form" :model="form" :rules="rules" label-width="90px" size="mini">
        <el-form-item label="编码" prop="sn">
          <el-input v-model="form.sn" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="状态" prop="status_">
          <el-radio v-model="form.status_" label="1">
            开启
          </el-radio>
          <el-radio v-model="form.status_" label="0">
            关闭
          </el-radio>
        </el-form-item>
        <el-form-item label="选择分类" prop="schemeTypeName">
          <el-select v-model="form.schemeTypeName" style="width:100%">
            <el-option value="" style="height: 250px; overflow-y:auto;padding:0px;">
              <Tree
                :data="pidData"
                :search="false"
                in-box
                @setTargetNode="setTargetNode"
              />
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="提醒规则" prop="remindRule">
          <el-popover v-model="cronPopover">
            <VueCron v-model="form.remindRule" @change="changeCron" @close="cronPopover=false" />
            <el-input
              slot="reference"
              v-model="form.remindRule"
              placeholder="请输入定时策略"
              readonly
              @click="cronPopover=true"
            />
          </el-popover>
        </el-form-item>
        <el-form-item label="提醒方式" prop="remindMode">
          <el-select v-model="form.remindMode" multiple style="width:100%">
            <el-option v-for="item in warnWay" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="提醒配置" prop="remindConfigure">
          <el-input v-model="form.remindConfigure" />
        </el-form-item>
        <el-form-item label="提醒关键字" prop="remindKey">
          <el-input v-model="form.remindKey" />
        </el-form-item>
        <el-form-item label="提醒内容" prop="remindTemplate">
          <el-input v-model="form.remindTemplate" maxlength="50" />
        </el-form-item>
        <el-form-item label="描述" prop="describe_">
          <el-input v-model="form.describe_" :autosize="{ minRows: 4}" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="warning" size="mini" @click="test">
          测试
        </el-button>
        <el-button type="info" size="mini" @click="() => $emit('update:show', false)">
          取消
        </el-button>
        <el-button type="primary" size="mini" @click="save">
          确定
        </el-button>
      </div>
    </el-dialog>
    <ErrorMess v-if="errorMess.show" :show.sync="errorMess.show" :mess="errorMess.mess" />
  </div>
</template>

<script>
export default {
  name: 'EarlyList',
  components: {
    ErrorMess: () => import('./message.vue')
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
    info: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      cronPopover: false,
      warnWay: [],
      pidData: [],
      isTest: false,
      form: {
        sn: '',
        name: '',
        remindMode: [], // 提醒方式
        remindKey: '', // 提醒关键字
        describe_: '', // 描述内容
        remindRule: '0 0 0 L * ? *', // 提醒规则
        remindConfigure: '', // 提箱配置
        schemeType: '', // 分类
        remindTemplate: '', // 提醒内容
        schemeTypeName: '',
        status_: '1'
      },
      obj: {},
      rules: {
        sn: [{ required: true, message: '请输入编码', trigger: 'blur' }],
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        remind: [{ required: true, message: '请选择提醒方式', trigger: 'change' }],
        remindRule: [{ required: true, message: '请选择定时策略', trigger: 'blur' }],
        schemeTypeName: [{ required: true, message: '请选择分类', trigger: 'change' }],
        remindMode: [{ required: true, message: '请选择提醒方式', trigger: 'change' }],
        remindKey: [{ required: true, message: '请填写提醒关键字', trigger: 'blur' }],
        remindConfigure: [{ required: true, message: '请填写提醒配置', trigger: 'blur' }],
        remindTemplate: [{ required: true, message: '请填写提醒内容', trigger: 'blur' }],
        status_: [{ required: true, message: '请选择状态', trigger: 'change' }]
      },
      errorMess: {
        show: false,
        mess: ''
      }
    }
  },
  watch: {
    usn: {
      immediate: true,
      handler: 'getInfo'
    },
    info: {
      immediate: true,
      handler(val) {
        if (Object.keys(val).length && !this.usn) {
          this.form.schemeTypeName = val.label
          this.form.schemeType = val.id
        }
      }
    }
  },
  created() {
    this.getTree()
    this.getWarnWay()
  },
  // earlyWarning
  methods: {
    test() {
      const params = {}
      params.remindKey = this.form.remindKey
      params.remindConfigure = this.form.remindConfigure
      this.$api.earlyWarning.earlyTest(params).then(s => {
        this.$message.success('测试成功')
        this.isTest = true
      }).catch(e => {
        this.errorMess.show = true
        this.errorMess.mess = e.message
        this.isTest = false
      })
    },
    setTargetNode(node) {
      this.form.schemeTypeName = node.label
      this.form.schemeType = node.id
    },
    getTree() {
      this.$api.earlyWarning.getTree().then(s => {
        this.pidData = [...s.data]
      }).catch(e => this.$message.error(e.message))
    },
    getInfo(id) { // 数据回显
      if (id) {
        this.$api.earlyWarning.getEarlyDesc({ id }).then(s => {
          Object.keys(this.form).forEach(k => {
            this.form[k] = s.data[k]
          })
          this.form.remindMode = s.data.remindMode.split(',')
          this.form.id = s.data.id
          this.form.status_ = s.data.status_ === false ? '0' : '1'
          this.obj.remindConfigure = s.data.remindConfigure
          this.obj.remindKey = s.data.remindKey
        }).catch(e => this.$message.error(e.message))
      }
    },
    getWarnWay() { // 获取预警方式
      this.$api.earlyWarning.getWarnWay().then(s => {
        const arr = []
        const { remindMode } = s.data
        Object.keys(remindMode).forEach(k => {
          const obj = {}
          obj.label = k
          obj.id = remindMode[k]
          arr.push(obj)
        })
        this.warnWay = [...arr]
      }).catch(e => this.$message.error(e.message))
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = { ...this.form }
          delete params.schemeTypeName
          params.remindMode = params.remindMode.join(',')
          const url = this.usn ? 'editEarly' : 'addEarly'
          // console.log(params)
          if (!this.isTest && !this.usn) this.$message.warning('请先测试')
          else if (!this.isTest && this.usn
          && (this.obj.remindConfigure !== params.remindConfigure || this.obj.remindKey !== params.remindKey)) {
            this.$message.warning('请先测试')
          } else {
            this.$api.earlyWarning[url](params).then(s => {
              this.$message.success('保存成功')
              this.$emit('update:show', false)
              this.$emit('refshlist')
              this.isTest = false
            }).catch(e => {
              this.$message.error(e.message)
            })
          }
        }
      })
    },
    changeCron(val) {
      this.form.remindRule = val
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/.bottom{
  position: relative;
  box-sizing: border-box;
  text-align: right !important;
  padding-right: 16px !important;
  padding-bottom: 6px;
  .value{
    position: absolute;
    left:10px;
  }
}
</style>
