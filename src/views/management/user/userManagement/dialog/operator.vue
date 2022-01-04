<template>
  <el-dialog
    v-dialogDrag
    :visible.sync="show"
    :modal="false"
    width="30%"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :before-close="() => $emit('update:show', false)"
  >
    <div slot="title">
      {{ status === 'add' ? '新增' : '编辑' }}操作员
    </div>
    <el-form
      ref="form"
      v-waiting.fullscreen="loading"
      :model="form"
      :rules="rules"
      size="mini"
      label-width="100px"
    >
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" :disabled="status === 'update'" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" :type="view.typeone">
          <i
            v-if="status === 'add'"
            slot="suffix"
            class="el-input__icon el-icon-view"
            style="cursor:pointer"
            @click="viewType('typeone')"
          />
        </el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="pwd">
        <el-input v-model="form.pwd" :type="view.typetwo">
          <i
            v-if="status === 'add'"
            slot="suffix"
            class="el-input__icon el-icon-view"
            style="cursor:pointer"
            @click="viewType('typetwo')"
          />
        </el-input>
      </el-form-item>
      <el-form-item label="操作员编码" prop="sn">
        <el-input v-model="form.sn" :disabled="status === 'update'" />
      </el-form-item>
      <el-form-item label="所属单位" prop="org_sn">
        <el-select
          v-model="form.org_name"
          style="width: 100%;"
          @focus="isEcho = false"
          @visible-change="getDept"
        >
          <el-option value="" style="height: 250px; overflow-y:auto; padding: 0px;">
            <Tree
              check-box
              :data="tree"
              :search="false"
              :default-checked-keys="defaultCheckedKeys"
              in-box
              @check="formatterCheck"
            />
          </el-option>
        </el-select>
        <el-input v-show="false" v-model="form.org_sn" />
      </el-form-item>
      <el-form-item label="部门" prop="dept_sn">
        <el-select v-model="form.dept_sn" style="width: 100%;" multiple no-data-text="暂无数据或重新选择所属单位">
          <el-option
            v-for="item in dept"
            :key="item.id"
            :label="item.name"
            :value="item.sn"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="外部代码" prop="out_sn">
        <el-input v-model="form.out_sn" :disabled="status === 'update'" />
      </el-form-item>
      <el-form-item label="操作用说明" prop="desc_">
        <el-input v-model="form.desc_" type="textarea" :rows="4" />
        <el-checkbox v-model="form.status" :label="true">
          启用
        </el-checkbox>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="info" size="mini" @click="$emit('update:show', false)">
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
  name: 'Operator',
  props: {
    nodeVal: {
      type: Object,
      default: () => {}
    },
    show: {
      type: Boolean,
      default: false
    },
    tree: {
      type: Array,
      default: () => []
    },
    status: {
      type: String,
      default: 'add'
    },
    updateId: {
      type: String,
      default: ''
    }
  },
  data() {
    const checkPwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('密码不能为空'))
      } else {
        if (this.form.pwd !== '') {
          this.$refs.form.validateField('pwd')
        }
        callback()
      }
    }
    const checkPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      nodeInfo: {},
      form: {
        name: '',
        username: '',
        password: '',
        pwd: '',
        sn: '',
        org_name: '',
        org_sn: '',
        dept_sn: [],
        out_sn: '',
        desc_: '',
        status: true
      },
      rules: {
        name: [{ required: true, message: '请填写名称', trigger: 'blur' }],
        username: [{ required: true, message: '请填写用户名', trigger: 'blur' }],
        password: [{ required: true, validator: checkPwd, trigger: 'blur' }],
        pwd: [{ required: true, validator: checkPass, trigger: 'blur' }],
        org_sn: [{ required: true, message: '请选择单位', trigger: 'blur' }],
        sn: [{ required: true, message: '请填写操作员编码', trigger: 'blur' }]
      },
      view: {
        typeone: 'password',
        typetwo: 'password'
      },
      dept: [],
      isEcho: false,
      defaultCheckedKeys: []
    }
  },
  watch: {
    nodeVal: {
      immediate: true,
      handler(val) {
        this.nodeInfo = val
      }
    },
    show(val) {
      if (!val) {
        this.$refs.form.clearValidate()
        Object.assign(this.form, {
          name: '',
          username: '',
          password: '',
          pwd: '',
          sn: '',
          org_name: '',
          org_sn: '',
          dept_sn: '',
          out_sn: '',
          desc_: '',
          status: true
        })
        this.defaultCheckedKeys = []
        this.dept = []
      }
      val && this.getInfo(this.updateId)
    }
  },
  methods: {
    formatterCheck(obj) {
      const { checkedKeys, checkedNodes } = obj
      const ids = []
      const names = []
      checkedNodes.forEach(key => {
        ids.push(key.id)
        names.push(key.label)
      })
      this.form.org_name = names.join(',')
      this.form.org_sn = ids.join(',')
    },
    getDept(bool) {
      if (!bool) {
        this.$api.user.getDept({ unitsn: this.form.org_sn }).then(s => {
          this.dept = [...s.data]
          if (!this.isEcho) this.form.dept_sn = ''
        }).catch(e => this.$message.error(e.message))
      }
    },
    getInfo(val) {
      if (val) {
        this.loading = true
        this.isEcho = true
        this.$api.user.getDetail({ id: val }).then(s => {
          Object.keys(this.form).forEach(key => {
            if (key === 'dept_sn') {
              this.form.dept_sn = s.data.dept_sn ? s.data.dept_sn.split(',') : []
            } else this.form[key] = s.data[key]
          })
          this.defaultCheckedKeys = s.data.org_sn ? s.data.org_sn.split(',') : []
          this.getDept(false)
          this.form.pwd = s.data.password
          if (s.data.unit_name) {
            const name = s.data.unit_name.split('/')
            this.form.org_name = `${s.data.org_sn} ${name[name.length - 1]}`
          }
          this.loading = false
        }).catch(e => {
          this.loading = false
          this.$message.error(e.message)
        })
      } else if (this.nodeInfo) {
        this.form.org_sn = this.nodeInfo.id
        this.defaultCheckedKeys.push(this.nodeInfo.id)
        this.form.org_name = this.nodeInfo.label
      }
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          const params = { ...this.form }
          params.dept_sn = params.dept_sn && params.dept_sn.join(',')
          delete params.org_name
          let url = ''
          if (this.status === 'update') {
            url = 'updateUser'
            params.id = this.updateId
          } else url = 'addUser'
          this.$api.user[url](params).then(s => {
            this.loading = false
            this.$emit('update:show', false)
            this.$emit('refresh', params.org_sn)
          }).catch(e => {
            this.loading = false
            this.$message.error(e.message)
          })
        }
      })
    },
    viewType(type) {
      this.view[type] = this.view[type] === 'password' ? 'text' : 'password'
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
