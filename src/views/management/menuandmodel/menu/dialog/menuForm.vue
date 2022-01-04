<template>
  <el-dialog
    v-dialogDrag
    :visible.sync="show"
    :modal="false"
    width="30%"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :before-close="close"
  >
    <div slot="title">
      {{ status === 'add' ? '新增' : '编辑' }}{{ updateInfo.type === 'folder' ? '目录' : '菜单' }}
    </div>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="mini"
      label-width="90px"
      status-icon
    >
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="别名" prop="alias">
        <el-input v-model="form.alias" />
      </el-form-item>
      <el-form-item v-if="updateInfo.type!= 'folder'" label="是否外部连接" prop="outLink">
        <el-radio-group v-model="form.outLink">
          <el-radio :label="true">
            是
          </el-radio>
          <el-radio :label="false">
            否
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.outLink" label="外部连接" prop="outLinkUrl">
        <el-input v-model="form.outLinkUrl" />
      </el-form-item>
      <el-form-item v-if="!form.outLink" label="路径" prop="path">
        <el-input v-model="form.path" />
      </el-form-item>
      <el-form-item label="图标" prop="icon">
        <el-popover
          placement="bottom-start"
          width="400"
          trigger="click"
        >
          <ul class="iconbox">
            <li v-for="icon in icons" :key="icon" @click="form.icon = icon">
              <i :class="'iconfont ' + icon" />
            </li>
          </ul>
          <el-input
            slot="reference"
            v-model="form.icon"
            readonly
            :prefix-icon="form.icon ? 'iconfont ' + form.icon : ''"
          />
        </el-popover>
      </el-form-item>
      <el-form-item label="上级" prop="pname">
        <el-select v-model="form.pname" style="width: 100%">
          <el-option value="" style="height: 250px; overflow-y:auto; padding: 0px;">
            <Tree
              :data="td"
              :search="false"
              in-box
              @setTargetNode="setTargetNode"
            />
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="!form.outLink" label="模块" prop="modelId">
        <el-select v-model="form.modelId" filterable style="width: 100%;">
          <el-option
            v-for="item in modelList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="primary" size="mini" @click="save">
        确定
      </el-button>
      <el-button type="info" size="mini" @click="close">
        取消
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import Icons from '@/assets/js/icons'

export default {
  name: 'Menuform',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    td: {
      type: Array,
      default: () => []
    },
    parent: {
      type: Object,
      default: () => {}
    },
    updateInfo: {
      type: Object,
      default: () => {}
    },
    objInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    const checkAlias = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请填写别名'))
      } else {
        const reg = /^\w+$/
        // eslint-disable-next-line no-constant-condition
        if (!isNaN(value.slice(0, 1))) {
          callback(new Error('别名不能以数字开头！'))
        } else if (!reg.test(value)) {
          callback(new Error('别名以英文/数字/下划线组成！'))
        }
        callback()
      }
    }
    return {
      form: {
        name: '',
        alias: '',
        pid: '',
        pname: '',
        path: '',
        icon: '',
        type: 'menu',
        modelId: '',
        outLink: true,
        outLinkUrl: ''
      },
      rules: {
        name: [{ required: true, message: '请填写名称', trigger: 'blur' }],
        outLinkUrl: [{ required: true, message: '请填写外部连接', trigger: 'blur' }],
        alias: [{ required: true, validator: checkAlias, trigger: 'blur' }],
        pname: [{ required: true, message: '请选择上级目录', trigger: 'blur' }],
        path: [{ required: true, message: '请填写路径', trigger: 'blur' }],
        icon: [{ required: true, message: '请选择菜单图标', trigger: 'change' }]
      },
      modelList: [],
      status: 'add',
      icons: Icons
    }
  },
  watch: {
    parent: {
      immediate: true,
      handler: 'setParent'
    },
    updateInfo: {
      immediate: true,
      handler: 'setInfo'
    },
    objInfo: {
      immediate: true,
      deep: true,
      handler(val) {
        this.form.pid = val.id || ''
        this.form.pname = val.label || ''
      }
    }
  },
  created() {
    this.getModeList()
  },
  methods: {
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.form.outLink) {
            // eslint-disable-next-line no-bitwise
            const param = {}
            param.name = this.form.name
            param.url = this.form.outLinkUrl
            this.form.path = `/addMenu/${encodeURIComponent(JSON.stringify(param))}`
          }
          const params = { ...this.form }
          delete params.pname
          const URL = this.status === 'add' ? 'addFolder' : 'updateFolder'
          this.$api.menu[URL](params).then(s => {
            this.$message.success('保存成功！')
            this.$emit('refresh', params.pid)
            this.close()
          }).catch(e => this.$message.error(e.message))
        }
      })
    },
    setInfo(obj) {
      if (JSON.stringify(obj) !== '{}') {
        this.status = 'update'
        Object.assign(this.form, obj)
      }
    },
    setParent(obj) {
      this.form.pid = obj.id
      this.form.pname = obj.label
    },
    setTargetNode(node) {
      this.form.pid = node.id
      this.form.pname = node.label
    },
    getModeList() {
      this.$api.menu.getModelList().then(s => {
        this.modelList = [...s.data]
      }).catch(e => this.$message.error(e.message))
    },
    close() {
      this.status = 'add'
      this.$emit('close')
    }
  }
}
</script>

<style lang='scss' scoped>
  .iconbox {
    height: 400px;
    overflow-y: auto;
    padding: 10px;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    align-content: flex-start;
    li {
      cursor: pointer;
      padding: 3px 8px;
      margin: 5px;
      border-radius: 4px;
      border: 1px solid #ddd;
      i {
        font-size: 20px;
      }
    }
    li:hover {
      background: #4390de;
      color: #fff;
    }
  }
</style>
