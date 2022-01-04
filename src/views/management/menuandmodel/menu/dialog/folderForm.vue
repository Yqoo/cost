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
      {{ status === 'add' ? '新增' : '编辑' }}目录
    </div>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="mini"
      label-width="60px"
      status-icon
    >
      <el-form-item
        label="名称"
        prop="name"
      >
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item
        label="别名"
        prop="alias"
      >
        <el-input v-model="form.alias" />
      </el-form-item>
      <el-form-item label="路径" prop="path">
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
      <el-form-item
        label="上级"
        prop="pidName"
      >
        <el-select
          v-model="form.pidName"
          style="width: 100%"
        >
          <el-option
            value=""
            style="height: 250px; overflow-y:auto;padding: 0px;"
          >
            <Tree
              :data="td"
              :search="false"
              in-box
              style="height: 250px"
              @setTargetNode="setTargetNode"
            />
          </el-option>
        </el-select>
        <el-input
          v-if="false"
          v-model="form.pid"
        />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button
        type="primary"
        size="mini"
        @click="save"
      >
        确定
      </el-button>
      <el-button
        type="info"
        size="mini"
        @click="close"
      >
        取消
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import Icons from '@/assets/js/icons'

export default {
  name: 'FolderForm',
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
      default: () => { }
    },
    updateInfo: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    const checkAlias = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请填写别名'))
      } else {
        const reg = /^[a-z]+$/i
        if (!reg.test(value)) {
          callback(new Error('别名必须由英文组成'))
        }
        callback()
      }
    }
    return {
      form: {
        name: '',
        alias: '',
        pidName: '',
        pid: '',
        type: 'folder',
        path: '',
        icon: ''
      },
      rules: {
        name: [{ required: true, message: '请填写名称', trigger: 'blur' }],
        alias: [{ required: true, validator: checkAlias, trigger: 'blur' }],
        pidName: [{ required: true, message: '请选择上级目录', trigger: 'blur' }],
        path: [{ required: true, message: '请填写路径', trigger: 'blur' }],
        icon: [{ required: true, message: '请选择菜单图标', trigger: 'change' }]
      },
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
    }
  },
  methods: {
    setInfo(obj) {
      if (JSON.stringify(obj) !== '{}') {
        this.status = 'update'
        Object.assign(this.form, obj)
      }
    },
    setParent(obj) {
      this.form.pid = obj.id
      this.form.pidName = obj.label
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = { ...this.form }
          delete params.pidName
          const URL = this.status === 'add' ? 'addFolder' : 'updateFolder'
          this.$api.menu[URL](params).then(s => {
            this.$message.success('保存成功！')
            this.$emit('refresh', s.data || params.id)
            this.close()
          }).catch(e => this.$message.error(e.message))
        }
      })
    },
    setTargetNode(node) {
      this.form.pidName = node.label
      this.form.pid = node.id
    },
    close() {
      this.status = 'add'
      this.$emit('update:show', false)
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
