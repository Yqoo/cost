<template>
  <div>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="mini"
      label-width="100px"
      status-icon
    >
      <el-form-item label="代码" prop="sn">
        <el-input v-model="form.sn" />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" @blur="getZJM" />
      </el-form-item>
      <el-form-item label="助记码" prop="zjm">
        <el-input v-model="form.zjm" />
      </el-form-item>
      <el-form-item label="体系" prop="xmtxName">
        <el-select v-model="form.xmtxName" style="width:100%">
          <el-option value="" style="height: 250px; overflow-y:auto;padding: 0px;">
            <Tree
              :data="txData"
              :search="false"
              default-expand-all
              in-box
              @setTargetNode="setTargetNode"
            />
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="使用状态" prop="syzt">
        <el-radio v-model="form.syzt" :label="true">
          启用
        </el-radio>
        <el-radio v-model="form.syzt" :label="false">
          禁用
        </el-radio>
      </el-form-item>
      <el-form-item label="启用数据档案" prop="syzt">
        <el-radio v-model="form.useDataType" :label="true">
          启用
        </el-radio>
        <el-radio v-model="form.useDataType" :label="false">
          禁用
        </el-radio>
      </el-form-item>
      <el-form-item label="本级单位控制" prop="self">
        <el-checkbox-group v-model="form.self">
          <el-checkbox label="允许资料修改和删除" name="self" />
          <el-checkbox label="允许添加下级资料" name="self" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="下级单位控制" prop="sub">
        <el-checkbox-group v-model="form.sub">
          <el-checkbox label="允许资料修改和删除" name="sub" />
          <el-checkbox label="允许添加下级资料" name="sub" />
        </el-checkbox-group>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Jbxx',
  props: ['hyInfo', 'data', 'usn'],
  data() {
    const validZjm = (rules, value, callback) => {
      if (!/^[0-9A-Za-z]{1,16}$/.test(value)) {
        return callback(new Error('助记码由1-16位数字或字母组成'))
      }
      return callback()
    }
    return {
      txData: this.data,
      getInfoData: {},
      form: {
        kjzd: this.hyInfo.kjzd,
        hybb: this.hyInfo.hybb,
        sn: '',
        name: '',
        zjm: '',
        xmtxId: '',
        xmtxName: '',
        useDataType: true,
        syzt: true,
        bjUpdateDelete: true, // 本级单位允许修改和删除
        bjAddChild: true, // 本级单位允许添加下级
        xjUpdateDelete: true, // 下级单位允许修改和删除
        xjAddChild: true, // 下级单位允许添加下级
        self: ['允许资料修改和删除', '允许添加下级资料'],
        sub: ['允许资料修改和删除', '允许添加下级资料']
      },
      rules: {
        sn: [{ required: true, message: '请输入编码', trigger: 'blur' }],
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        zjm: [{ required: true, validator: validZjm, trigger: 'blur' }],
        xmtxName: [{ required: true, message: '请选择上级', trigger: 'change' }],
        syzt: [{ required: true, trigger: 'change' }],
        self: [
          {
            type: 'array', required: true, message: '本级单位控制请至少选择一个', trigger: 'change'
          }
        ],
        sub: [
          {
            type: 'array', required: true, message: '下级单位控制请至少选择一个', trigger: 'change'
          }
        ]
      }
    }
  },
  watch: {
    hyInfo: {
      immediate: true,
      handler(val) {
        this.form.xmtxName = val.pName
        this.form.xmtxId = val.pid
      }
    },
    usn: {
      immediate: true,
      handler: 'getInfo'
    }
  },
  methods: {
    getInfo(val) { // 数据回显
      if (val) {
        this.$api.reportxm.getXmDacs({
          id: val
        }).then(s => {
          this.$emit('getInfoData', s.data)
          this.getInfoData = s.data
          this.form.self = []
          this.form.sub = []
          if (s.data.bjUpdateDelete === true && s.data.bjAddChild === true) {
            this.form.self.push('允许资料修改和删除', '允许添加下级资料')
          } else if (s.data.bjUpdateDelete === true) {
            this.form.self.push('允许资料修改和删除')
          } else if (s.data.bjAddChild === true) {
            this.form.self.push('允许添加下级资料')
          }
          if (s.data.xjAddChild === true && s.data.xjUpdateDelete === true) {
            this.form.sub.push('允许资料修改和删除', '允许添加下级资料')
          } else if (s.data.xjAddChild === true) {
            this.form.sub.push('允许添加下级资料')
          } else if (s.data.xjUpdateDelete === true) {
            this.form.sub.push('允许资料修改和删除')
          }
          this.form.kjzd = s.data.kjzd
          this.form.hybb = s.data.hybb
          this.form.sn = s.data.sn
          this.form.name = s.data.name
          this.form.zjm = s.data.zjm
          this.form.xmtxId = s.data.xmtxId
          this.form.xmtxName = s.data.xmtxName
          this.form.syzt = s.data.syzt
          this.form.bjUpdateDelete = s.data.bjUpdateDelete
          this.form.bjAddChild = s.data.bjAddChild
          this.form.xjUpdateDelete = s.data.xjUpdateDelete
          this.form.xjAddChild = s.data.xjAddChild
          this.form.useDataType = s.data.useDataType
        }).catch(e => this.$message.error(e.message))
      }
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = { ...this.form }
          params.bjUpdateDelete = !!this.form.self.includes('允许资料修改和删除')
          params.bjAddChild = !!this.form.self.includes('允许添加下级资料')
          params.xjUpdateDelete = !!this.form.sub.includes('允许资料修改和删除')
          params.xjAddChild = !!this.form.sub.includes('允许添加下级资料')
          delete params.self
          delete params.sub
          delete params.xmtxName
          this.$emit('next', {
            step: 1,
            params
          })
        }
      })
    },
    setTargetNode(node) {
      this.form.xmtxName = node.label
      this.form.xmtxId = node.id
    },
    getZJM() { // 获取助记码
      if (this.form.name) {
        this.$api.accountants.getZJM(this.form.name).then(s => {
          this.form.zjm = s.data
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
