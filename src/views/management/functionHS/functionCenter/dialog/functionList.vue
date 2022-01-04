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
        {{ usn ? '编辑' : '新增' }}函数
      </div>
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="函数名称" prop="name">
          <el-input v-model="form.name" size="mini" />
        </el-form-item>
        <el-form-item label="中文名称" prop="chineseName">
          <el-input v-model="form.chineseName" size="mini" />
        </el-form-item>
        <el-form-item label="所属分类" prop="flSnAndName">
          <el-select v-model="form.flSnAndName" style="width:100%" size="mini">
            <el-option value="" style="height: 250px; overflow-y:auto;padding:0px;">
              <Tree
                :data="fdIdData"
                :search="false"
                in-box
                @setTargetNode="setTargetNode"
              />
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据库" prop="dsId">
          <el-select v-model="form.dsId" style="width:100%" placeholder="请选择" size="mini">
            <el-option
              v-for="item in dataList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="函数说明" prop="describ">
          <el-input v-model="form.describ" type="textarea" placeholder="请输入内容" size="mini" />
        </el-form-item>
        <el-form-item label="返回类型" prop="returnDataType">
          <el-radio v-model="form.returnDataType" label="1">
            单值
          </el-radio>
          <el-radio v-model="form.returnDataType" label="2">
            多值
          </el-radio>
        </el-form-item>
        <el-form-item label="可更换原型数据库" prop="isChangeSource">
          <el-radio v-model="form.changeSource" :label="true">
            是
          </el-radio>
          <el-radio v-model="form.changeSource" :label="false">
            否
          </el-radio>
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
  name: 'FunctionList',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    usn: {
      type: String,
      default: ''
    },
    targetNode: {
      type: Object,
      default: () => {}
    },
    fdData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dataList: [],
      fdIdData: this.fdData,
      id: '',
      form: {
        name: '',
        chineseName: '',
        returnDataType: '1',
        dsId: '',
        fdId: '',
        flSnAndName: '',
        describ: '',
        changeSource: true
      },
      rules: {
        name: [{ required: true, message: '请填写函数名称', trigger: 'blur' }],
        chineseName: [{ required: true, message: '请填写中文名称', trigger: 'blur' }],
        flSnAndName: [{ required: true, message: '请选择所属分类', trigger: 'change' }],
        dsId: [{ required: true, message: '请选择数据库', trigger: 'change' }]
      }
    }
  },
  watch: {
    targetNode: {
      immediate: true,
      handler(val) {
        if (Object.keys(val).length) {
          if (val.icon === 'fl') {
            this.form.flSnAndName = val.label
            this.form.fdId = val.id
          }
        }
      }
    },
    usn: {
      immediate: true,
      handler: 'getInfo'
    }
  },
  created() {
    this.getSJY()
  },
  methods: {
    getInfo(val) {
      if (val) {
        this.$api.functionCenter.getFunctionDesc({ id: val }).then(s => {
          Object.keys(this.form).forEach(key => {
            this.form[key] = s.data[key]
          })
          this.id = s.data.id
        }).catch(e => this.$message.error(e.message))
      }
    },
    getSJY() {
      this.$api.functionCenter.getSJY().then(s => {
        this.dataList = [...s.data]
      }).catch(e => this.$message.error(e.message))
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = { ...this.form }
          delete params.flSnAndName
          let url = 'addFunctionList'
          if (this.id) {
            url = 'editFunctionList'
            params.id = this.id
          }
          this.$api.functionCenter[url](params).then(s => {
            this.$emit('refshList')
            this.$emit('update:show', false)
          }).catch(e => this.$message.error(e.message))
        }
      })
    },
    setTargetNode(node) {
      if (node.icon === 'fl') {
        this.form.flSnAndName = node.label
        this.form.fdId = node.id
      } else this.$message.warning('当前节点不可选择')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
