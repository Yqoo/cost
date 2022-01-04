<template>
  <div>
    <el-dialog
      v-dialogDrag
      :modal="false"
      width="40%"
      :visible.sync="show"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="() => $emit('update:show', false)"
    >
      <div slot="title">
        {{ uid ? "编辑" : "新增" }}系统数据源
      </div>
      <el-form
        ref="form"
        v-waiting="loading"
        :model="form"
        :rules="rules"
        size="mini"
        label-width="120px"
        status-icon
      >
        <el-form-item label="所属分类" prop="categorySn" class="category_sn">
          <el-select
            v-model="form.categorySn"
            style="width: 50%"
            placeholder="请选择分类"
          >
            <el-option
              v-for="op in classList"
              :key="op.id"
              :label="op.label"
              :value="op.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="是否本库"
          prop="isbk"
          style="width: 50%"
          class="isbk"
        >
          <el-radio v-model="form.isbk" :label="true">
            是
          </el-radio>
          <el-radio v-model="form.isbk" :label="false">
            否
          </el-radio>
        </el-form-item>
        <el-form-item label="编码" prop="sn" style="width: 50%" class="dib">
          <el-input v-model="form.sn" clearable placeholder="请输入编码" />
        </el-form-item>
        <el-form-item label="名称" prop="name" style="width: 50%" class="dib">
          <el-input v-model="form.name" clearable placeholder="请输入名称" />
        </el-form-item>
        <el-form-item v-if="!form.isbk" label="数据源类型" prop="type">
          <el-select
            v-model="form.type"
            placeholder="请选择数据源类型"
            style="width: 100%"
          >
            <el-option
              v-for="op in typeList"
              :key="op.value"
              :label="op.label"
              :value="op.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="!form.isbk" label="ip" prop="ip" style="width: 100%">
          <el-input v-model="form.ip" clearable placeholder="请输入ip地址" />
        </el-form-item>
        <el-form-item
          v-if="!form.isbk"
          label="端口"
          prop="port"
          style="width: 100%"
        >
          <el-input v-model="form.port" type="number" clearable placeholder="请输入端口" />
        </el-form-item>
        <el-form-item
          v-if="!form.isbk"
          label="数据库名称"
          prop="dbName"
          style="width: 100%"
        >
          <el-input
            v-model="form.dbName"
            clearable
            placeholder="请输入数据库名称"
          />
        </el-form-item>
        <el-form-item
          v-if="!form.isbk"
          label="其他参数"
          prop="parameters"
          style="width: 100%"
        >
          <el-input v-model="form.params" clearable placeholder="请输入参数" />
        </el-form-item>
        <el-form-item label="描述" prop="descr">
          <el-input
            v-model="form.descr"
            type="textarea"
            placeholder="请输入描述"
          />
        </el-form-item>
        <el-form-item
          v-if="!form.isbk"
          label="用户名"
          prop="username"
          style="width: 50%"
          class="dib"
        >
          <el-input
            v-model="form.username"
            clearable
            placeholder="请输入用户名"
          />
        </el-form-item>

        <el-form-item
          v-if="!form.isbk"
          prop="password"
          label="用户密码"
          style="width: 50%"
          class="dib"
        >
          <el-input v-model="form.password" :type="showPwd ? 'text' : 'password'">
            <i
              slot="suffix"
              class="el-icon-view"
              style="cursor: pointer"
              @click="showPwd = !showPwd"
            />
          </el-input>
        </el-form-item>

        <el-form-item label="状态" prop="disabled">
          <el-radio v-model="form.disabled" :label="false">
            启用
          </el-radio>
          <el-radio v-model="form.disabled" :label="true">
            停用
          </el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button
          type="info"
          size="mini"
          @click="() => $emit('update:show', false)"
        >
          取消
        </el-button>
        <el-button type="primary" size="mini" @click="link">
          测试连接
        </el-button>
        <el-button type="primary" size="mini" @click="save">
          保存
        </el-button>
      </div>
    </el-dialog>
    <!-- 连接测试弹框 -->
    <PromptBox
      v-if="linkTest.show"
      :show.sync="linkTest.show"
      :title-name="linkTest.titleName"
      :status="linkTest.status"
    />
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    uid: {
      type: String,
      default: ''
    },
    sn: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      default: 'add'
    }
  },
  data() {
    return {
      // 测试连接
      linkTest: {
        titleName: '测试连接',
        show: false,
        status: ''
      },
      loading: false,
      form: {
        id: '',
        categorySn: '',
        isbk: false,
        sn: '',
        name: '',
        type: '',
        ip: '',
        port: '',
        dbName: '',
        params: '',
        descr: '',
        username: '',
        password: '',
        disabled: false
      },
      rules: {
        categorySn: [
          { required: true, message: '请选择所属大类', trigger: 'change' }
        ],
        isbk: [{ required: true, message: '请选择库类型', trigger: 'blur' }],
        name: [{ required: true, message: '请填写名称', trigger: 'blur' }],
        sn: [{ required: true, message: '请填写编码', trigger: 'blur' }],
        type: [
          { required: true, message: '请选择数据源类型', trigger: 'blur' }
        ],
        ip: [{ required: true, message: '请输入ip地址', trigger: 'blur' }],
        port: [{ required: true, message: '请输入端口', trigger: 'blur' }],
        dbName: [
          { required: true, message: '请输入数据库名称', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ]
      },
      typeList: [],
      classList: [],
      showPwd: false
    }
  },
  watch: {
    uid: {
      immediate: true,
      handler: 'getInfo'
    },
    sn: {
      immediate: true,
      handler(val) {
        if (val !== 'root') {
          this.form.categorySn = val
        }
      }
    }
  },
  created() {
    this.getClassList()
    this.getDSList()
  },

  methods: {
    // 连接测试
    link() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.linkTest.show = true
          const params = this.form
          this.$api.dataSource.testByRow(params).then(s => {
            this.linkTest.status = 'success'
          }).catch(e => {
            this.linkTest.status = 'fail'
          })
        }
      })
    },
    // 保存数据源
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = new FormData()
          Object.keys(this.form).forEach(key => {
            if (this.form[key] !== null) {
              params.append(key, this.form[key])
            }
          })
          this.loading = true
          this.$api.dataSource
            .saveDataSource(params)
            .then(s => {
              this.$emit('success', params.categorySn)
              this.$emit('update:show', false)
              this.loading = false
            })
            .catch(e => {
              this.loading = false
              this.$message.error(e.message)
            })
        }
      })
    },
    // 获取数据源
    getInfo(val) {
      const { status } = this
      if (val) {
        this.$api.dataSource
          .getInfoById({ id: val })
          .then(s => {
            Object.keys(this.form).forEach(key => {
              this.form[key] = s.data[key]
            })
          })
          .catch(e => this.$message.error(e.message))
      }
    },
    // 获取所有大类
    getClassList() {
      this.$api.dataSource.getSJYTree().then(s => {
        this.classList = [...s.data]
      })
    },
    // 获取数据源类型
    getDSList() {
      this.$api.dataSource.getDSType().then(s => {
        const tmp = []
        Object.keys(s.data).forEach(key => {
          tmp.push({ label: s.data[key], value: key })
        })
        this.typeList = tmp
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.category_sn {
  width: 50%;
  display: inline-block;
  .el-select {
    width: 77% !important;
  }
  /deep/.el-form-item__content {
    width: 90%;
  }
}
.isbk {
  display: inline-block;
  width: 22px;
}
.dib {
  display: inline-block;
}
</style>
