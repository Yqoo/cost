<template>
  <el-dialog
    v-dialogDrag
    :modal="false"
    width="400px"
    :visible.sync="show"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :before-close="() => $emit('update:show', false)"
  >
    <div slot="title">
      上传文件
    </div>
    <div class="content">
      <el-upload
        ref="upload"
        class="upload-demo"
        drag
        :action="action"
        :multiple="multiple"
        :name="name"
        :limit="limit"
        :format="format"
        :show-file-list="showFileList"
        :headers="{
          Authorization: auth
        }"
        :data="params"
        :before-upload="beforeUpload"
        :on-success="uploadSuccess"
        :on-error="uploadError"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">
          将文件拖到此处，或<em>点击上传</em>
        </div>
      </el-upload>
    </div>
    <p class="tips">
      允许上传的文件格式为： {{ format.join(',') }}
    </p>
    <div slot="footer">
      <el-button type="primary" size="mini" @click="() => $emit('update:show', false)">
        关闭
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: 'file'
    },
    action: {
      type: String,
      default: ''
    },
    limit: {
      type: Number,
      default: 1
    },
    format: {
      type: Array,
      default: () => []
    },
    showFileList: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    params: { // 上传文件额外参数
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {}
  },
  computed: {
    auth() {
      return this.$tools.getCookie()
    }
  },
  methods: {
    beforeUpload(file) {
      const { name } = file
      const arr = name.split('.')
      const type = arr[arr.length - 1]
      if (this.format.includes(type)) {
        return true
      }
      this.$message.warning(`请上传${this.format.join(',')}格式文件！`)
      return false
    },
    uploadSuccess(res) {
      const type = +res.code === 200 ? 'success' : 'error'
      this.$message[type](type === 'success' ? '上传成功！' : res.message)
      if (+res.code === 200) {
        this.$emit('update:show', false)
        this.$emit('success', res.data)
      }
    },
    uploadError(err) {
      this.$message.error('系统错误，请联系管理员！')
    }
  }
}
</script>

<style lang="scss" scoped>
  .upload-demo {
    text-align: center;
  }
  .tips {
    font-size: 12px;
    text-align: center;
    color: #4390de;
  }
</style>
